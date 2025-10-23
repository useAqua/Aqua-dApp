import Link from "next/link";
import { useRouter } from "next/router";
import aquaLogo from "~/assets/aqua-logo.svg";
import Image from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { cn } from "~/lib/utils";
import { CustomConnectButton } from "~/components/common/CustomConnectButton";
import { RefreshCw } from "lucide-react";
import { useVaultRefresh } from "~/hooks/use-vault-refresh";

const Header = () => {
  const router = useRouter();
  const { refreshVaultData, isRefreshing } = useVaultRefresh();

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/", label: "Vaults" },
    { path: "https://docs.useaqua.xyz", label: "Docs" },
  ];

  return (
    <header className="py-4">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Image
              src={aquaLogo as StaticImport}
              alt="Aqua Protocol"
              className="h-8"
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <div key={item.path} className="py-1">
              <Link
                href={item.path}
                className={cn(
                  "text-foreground nav_link rounded-md px-0.5 py-1 transition-colors",

                  { active: router.pathname === item.path },
                )}
                target={item.label === "Docs" ? "_blank" : undefined}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            className={cn("cursor-pointer hover:scale-95 active:scale-105", {
              "animate-spin": isRefreshing,
            })}
            onClick={refreshVaultData}
          >
            <RefreshCw />
          </button>
          <CustomConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
