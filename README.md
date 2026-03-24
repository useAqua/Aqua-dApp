# Aqua dApp

A DeFi yield-vault frontend built on the **T3 Stack** (Next.js Pages Router · tRPC · React Query) with Wagmi v2 / viem v2 / RainbowKit v2, targeting Sepolia (MegaETH testnet swap available in `src/lib/chainToUse.ts`).

---

## What is IYO?

**IYO (Initial Yield Offering)** is the core smart-contract system. It is a time-bounded, phase-driven campaign manager that sits on top of Aave. Each **Campaign** groups one or more **CampaignVaults**. Users deposit ERC-20 assets into a vault; the contract supplies them to Aave and issues ERC-4626 vault shares in return. Yield accrues via Aave's `aToken` mechanism.

```
User ──deposit(asset)──▶ IYO contract ──supply──▶ Aave Pool
                                │                      │
                         mints shares           accrues aToken yield
                                │
                         CampaignVault (ERC-4626)
```

### Campaign lifecycle

| State | Condition |
|---|---|
| **Upcoming** | `active && now < startTime` |
| **Active** | `active && startTime ≤ now ≤ endTime` |
| **Ended** | `now > endTime` |
| **Inactive** | `!active` (deactivated by admin) |

### Key contract functions (from `src/lib/contracts/iyo.ts`)

**User actions**
- `deposit(campaignId, vaultIndex, amount)` — ERC-20 must be approved to IYO address first.
- `withdraw(campaignId, vaultIndex, sharesToWithdraw)` — only callable after campaign ends.
- `earlyExit(campaignId, vaultIndex, sharesToWithdraw)` — callable any time; incurs `EARLY_EXIT_PRINCIPAL_PENALTY_BPS` principal penalty and forfeits accrued yield.

**Read-only**
- `campaignCount()`, `getCampaign(id)`, `getVaults(id)`, `getVault(id, vaultIndex)`
- `getPosition(id, vaultIndex, user)` → `{ shares, principal }`
- `estimatedUserYield / pendingYield / positionValue(id, vaultIndex, user)`
- `getCurrentPhase(id)`, `isCampaignEnded(id)`, `isWhitelisted(id, user)`
- `totalVaultValue(id, vaultIndex)`

**Admin**
- `createCampaign(startTime, duration, phaseDuration, protocolFeeBps)`
- `addVault(campaignId, asset, aToken)` — each vault tracks its underlying asset and Aave aToken.
- `deactivateCampaign`, `setVaultEnabled`, `setWhitelistEnabled`, `setWhitelistNFT`

### IYO contract helpers

```ts
// Client components — uses NEXT_PUBLIC_IYO_ADDRESS
import { getIyoContractClient } from "~/lib/contracts/iyo";
const iyo = getIyoContractClient();

// Server-only (tRPC routers / trpcContext) — uses IYO_ADDRESS
import { getIyoContractServer } from "~/lib/contracts/iyo";
const iyo = getIyoContractServer();
```

Never cross-import these: `getIyoContractServer` pulls in `server-only` transitively via `viemClient`.

---

## Architecture

```
Browser  ──wagmi hooks──▶  IYO contract writes (client only)
Browser  ──tRPC queries──▶  Next.js API (/api/trpc)
                                   │
                            unifiedCache (5 min TTL)
                            └─ getNewContractConfigs()
                                   │ multicall: getCampaign(i) + getVaults(i)
                            viemClient  (server-only, Sepolia RPC)
                                   │
                            IYO contract on-chain
```

**Core rule**: All RPC *reads* run through tRPC server procedures. `src/lib/viemClient.ts` is marked `import "server-only"` and must never be imported by client code. Contract *writes* use wagmi hooks directly inside components.

### Server-side cache

`src/lib/trpcContext/unifiedCache.ts` is a singleton in-memory cache (5-minute TTL). On every tRPC request that misses the cache, `getNewContractConfigs()` fires a multicall to read all campaigns and their vaults, populates `CampaignConfigs = Map<number, CampaignInfo>`, and stores the result. The tRPC context (`src/server/trpc.ts`) is built from this cache.

To force a refresh from a client component, call `useVaultRefresh()` after a transaction — it calls `api.vaults.invalidateCache` (clears server cache) then `utils.invalidate()` (clears all React Query caches).

---

## Key Directories

| Path | Purpose |
|---|---|
| `src/lib/contracts/iyo.ts` | Full IYO ABI + `getIyoContractClient` / `getIyoContractServer` |
| `src/lib/trpcContext/contractConfig.ts` | `getNewContractConfigs()` — live multicall fetch of all campaigns |
| `src/lib/trpcContext/unifiedCache.ts` | 5-min singleton cache; `invalidateUnifiedCache()` to bust |
| `src/server/routers/campaigns.ts` | `getCampaignTable`, `getSingleCampaign` tRPC procedures |
| `src/server/routers/zap.ts` | `previewDeposit`, `previewWithdraw` via ERC-4626 interface |
| `src/components/campaign/` | All campaign UI: table, detail header, deposit/withdraw tabs, trading panel |
| `src/types/contracts.ts` | `CampaignInfo`, `CampaignVaults`, `CampaignConfigs` types |
| `src/utils/api.ts` | tRPC client — always import `api` from here |

---

## Data Types

```ts
// src/types/contracts.ts
interface CampaignInfo {
  id: number;
  name: string;
  creator: `0x${string}`;
  startTime: bigint;   // unix seconds
  endTime: bigint;     // unix seconds
  phaseDuration: bigint;
  protocolFeeBps: bigint;
  active: boolean;
  whitelistEnabled: boolean;
  vaults: CampaignVaults[];
}

interface CampaignVaults {
  asset: `0x${string}`;       // ERC-20 deposit token
  aToken: `0x${string}`;      // Aave yield-bearing token
  vault: `0x${string}`;       // CampaignVault (ERC-4626) — source of user shares
  addedInPhase: bigint;
  enabled: boolean;
}
```

User share balance lives on the ERC-4626 `vault` address; read it with `erc20.balanceOf(vault, userAddress)` via a wagmi `useReadContract`.

---

## Contract Write Patterns

**Deposit** (with auto-approval):
```tsx
import { WriteButtonWithAllowance } from "~/components/ui/write-button-with-allowance";
import { getIyoContractClient } from "~/lib/contracts/iyo";

const iyo = getIyoContractClient();

<WriteButtonWithAllowance
  {...iyo}
  functionName="deposit"
  args={[BigInt(campaignId), BigInt(vaultIndex), parseUnits(amount, decimals)]}
  tokenAddress={selectedVault.asset}
  tokenDecimals={18}
  tokenSymbol="TOKEN"
  spenderAddress={iyo.address}
  requiredAmount={amount}
  onSuccess={handleDeposited}
>
  Deposit
</WriteButtonWithAllowance>
```

`WriteButtonWithAllowance` checks the current ERC-20 allowance via `api.contracts.getAllowance`. If the wallet supports EIP-7702 atomic batching (`useEIP7702Batch`), the approve + deposit are sent as one bundle; otherwise they execute sequentially.

**Withdraw / Early exit** — same pattern, swap `functionName` between `"withdraw"` and `"earlyExit"` based on campaign end state and the user's "Exit Early" toggle.

**Connect-gate** — wrap standalone action buttons with `<ContractActionButton>` to automatically show "Connect Wallet" when the wallet is disconnected.

---

## Reading Campaign Data (tRPC)

```ts
// Campaign list
const { data } = api.campaign.getCampaignTable.useQuery();

// Single campaign (includes its vaults array)
const { data: campaign } = api.campaign.getSingleCampaign.useQuery(
  { id: campaignId },
  { enabled: !isNaN(campaignId) },
);

// ERC-4626 deposit/withdraw previews
const { data: sharesOut } = api.zap.previewDeposit.useQuery({
  vaultAddress: selectedVault.vault,
  amountIn: parseUnits(amount, decimals).toString(),
});
```

---

## Developer Workflows

```bash
yarn dev          # Start dev server (Turbo)
yarn build        # Production build (validates env vars)
yarn check        # Lint + TypeScript check — run before committing
yarn typecheck    # TypeScript only
yarn lint:fix     # Auto-fix lint issues
```

Add `SKIP_ENV_VALIDATION=1` to skip env validation in Docker / CI.

---

## Environment Variables

Validated at startup via `src/env.ts` (`@t3-oss/env-nextjs`). All Ethereum addresses must match `addressSchema` (`/^0x[a-fA-F0-9]{40}$/`).

```
# Server
IYO_ADDRESS                    # IYO contract (server reads)
AQUA_REGISTRY_ADDRESS          # Legacy — still required by schema
AQUA_POINTS_POOL_ADDRESS       # Legacy — still required by schema
LP_SHARE_CALCULATION_ORACLE    # Legacy — still required by schema
GTE_API                        # GTE external API base URL
NODE_ENV

# Client (NEXT_PUBLIC_*)
NEXT_PUBLIC_IYO_ADDRESS        # IYO contract (client writes)
NEXT_PUBLIC_PROJECT_ID         # WalletConnect project ID (optional)
```

Copy `.env.example` → `.env`. Adding a new variable requires updating both the `server`/`client` schema **and** the `runtimeEnv` map in `src/env.ts`.

---

## Project Conventions

- **Import alias**: `~/` → `src/`. Never use relative paths.
- **Styling**: Tailwind CSS v4 + `cn()` from `src/lib/utils.ts`. Brand colors: `#01387C` (primary), `#F1C67C` (accent).
- **Numbers**: `formatNumber()` from `src/utils/numbers.tsx` for display; `formatUnits` / `parseUnits` from viem for on-chain values.
- **bigint serialization**: `superjson` is the tRPC transformer — `bigint` round-trips correctly end-to-end without manual conversion.
- **Address validation in zod schemas**: always use `addressSchema` from `src/env.ts`.
- **Chain**: `src/lib/chainToUse.ts` — currently `sepolia`; uncomment `megaethTestnet` to switch.
- **UI components**: Radix UI primitives in `src/components/ui/`. Extend, don't duplicate.
- **Token icons**: `src/assets/tokenIcons/` — import via `src/utils/tokenIcons.tsx`.
