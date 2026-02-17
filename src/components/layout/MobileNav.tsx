import Link from "next/link";
import { useRouter } from "next/router";
import { Dot, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { CustomConnectButton } from "~/components/common/CustomConnectButton";
import { useEffect } from "react";
import Image from "next/image";
import aquaLogo from "~/assets/aqua-logo.svg";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { api } from "~/utils/api";
import { useChains } from "wagmi";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = {
  app: [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect
            x="2"
            y="2"
            width="5.5"
            height="5.5"
            rx="1.5"
            stroke="currentColor"
            stroke-width="1.5"
          ></rect>
          <rect
            x="10.5"
            y="2"
            width="5.5"
            height="5.5"
            rx="1.5"
            stroke="currentColor"
            stroke-width="1.5"
          ></rect>
          <rect
            x="2"
            y="10.5"
            width="5.5"
            height="5.5"
            rx="1.5"
            stroke="currentColor"
            stroke-width="1.5"
          ></rect>
          <rect
            x="10.5"
            y="10.5"
            width="5.5"
            height="5.5"
            rx="1.5"
            stroke="currentColor"
            stroke-width="1.5"
          ></rect>
        </svg>
      ),
    },
    {
      path: "/",
      label: "Vaults",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect
            x="2"
            y="4"
            width="14"
            height="10"
            rx="2"
            stroke="currentColor"
            stroke-width="1.5"
          ></rect>
          <path d="M2 7.5h14" stroke="currentColor" stroke-width="1.5"></path>
          <path
            d="M6 11h3"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          ></path>
        </svg>
      ),
    },
  ],
  resources: [
    {
      path: "https://docs.useaqua.xyz",
      label: "Docs",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M3 4.5C3 3.67 3.67 3 4.5 3h9c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-9c-.83 0-1.5-.67-1.5-1.5v-9z"
            stroke="currentColor"
            stroke-width="1.5"
          ></path>
          <path
            d="M6 6.5h6M6 9h6M6 11.5h4"
            stroke="currentColor"
            stroke-width="1.3"
            stroke-linecap="round"
          ></path>
        </svg>
      ),
    },
    {
      path: "https://testnet.megaeth.com",
      label: "Faucet",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 3v6M6 6l3 3 3-3"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M3 12v1.5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V12"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          ></path>
        </svg>
      ),
    },
  ],
} as const;

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const router = useRouter();
  const { data: totalVaults } = api.vaults.getTotalVaults.useQuery();
  const chains = useChains();

  useEffect(() => {
    const handleRouteChange = () => {
      onClose();
    };

    router.events?.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events?.off("routeChangeStart", handleRouteChange);
    };
  }, [router, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "bg-card fixed top-0 right-0 z-50 h-full w-72 transform shadow-xl transition-transform duration-300 ease-in-out sm:w-80 md:w-96",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-border flex items-center justify-between border-b p-5 pb-4">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Image
                src={aquaLogo as StaticImport}
                alt="Aqua Protocol"
                className="h-7 object-contain object-left"
              />
            </Link>
            <button
              onClick={onClose}
              className="text-foreground bg-background hover:bg-accent/50 cursor-pointer rounded-md p-2 transition-colors"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          <div className="relative mx-4 mt-4 flex items-center gap-1 rounded-full border border-green-200 bg-green-200/20">
            <Dot size={30} className="absolute text-green-500" />
            <span className="py-1.5 pl-6 text-xs font-medium">
              {chains[0]?.name}
            </span>
          </div>

          <nav className="flex flex-1 flex-col gap-2 p-4">
            {Object.entries(navItems).map(([section, items]) => (
              <div
                key={section}
                className="first:border-b-border pb-2 first:border-b"
              >
                <h3 className="text-muted-foreground px-4 pt-4 pb-2 text-xs font-semibold tracking-wide uppercase">
                  {section}
                </h3>
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        "nav_link text-muted-foreground hover:bg-secondary hover:text-secondary-foreground relative flex items-center gap-3 rounded-md px-4 py-2 text-sm transition-colors",
                        {
                          "bg-foreground text-background pointer-events-none":
                            router.pathname === item.path,
                        },
                      )}
                      target={
                        item.label === "Docs" || item.label === "Faucet"
                          ? "_blank"
                          : undefined
                      }
                      onClick={onClose}
                    >
                      <span className="py-1">{item.icon}</span>
                      {item.label}
                      {item.label === "Vaults" && totalVaults !== undefined && (
                        <span className="bg-secondary/15 ml-auto inline-flex items-center justify-center rounded-sm px-2 py-0.5 text-xs font-medium text-white">
                          {totalVaults} Live
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-border space-y-3 border-t p-4">
            <div className="w-full">
              <CustomConnectButton fullWidth />
            </div>
            <div className="flex items-center justify-center gap-3 py-1">
              {[
                { label: "Twitter", href: "https://x.com/useaqua_xyz" },
                { label: "Discord", href: "#" },
              ].map((item, index) => (
                <>
                  {index > 0 && (
                    <span className="text-muted-foreground/50 text-xs">•</span>
                  )}
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "text-muted-foreground hover:text-foreground text-xs transition-colors",
                    )}
                    target={"_blank"}
                  >
                    {item.label}
                  </Link>
                </>
              ))}
              <span className="text-muted-foreground/50 text-xs">•</span>
              <span className="text-muted-foreground hover:text-foreground text-xs">
                v0.1.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
