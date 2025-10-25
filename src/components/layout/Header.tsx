import Link from "next/link";
import { useRouter } from "next/router";
import aquaLogo from "~/assets/aqua-logo.svg";
import Image from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { cn } from "~/lib/utils";
import { CustomConnectButton } from "~/components/common/CustomConnectButton";
import { Menu } from "lucide-react";
import { useState } from "react";
import MobileNav from "./MobileNav";

const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/", label: "Vaults" },
    { path: "https://docs.useaqua.xyz", label: "Docs" },
    { path: "https://testnet.megaeth.com", label: "Faucet" },
  ];

  return (
    <>
      <header className="relative py-4">
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
                  target={
                    item.label === "Docs" || item.label === "Faucet"
                      ? "_blank"
                      : undefined
                  }
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <CustomConnectButton hideDisplayOnMobile />

            <button
              className="text-foreground p-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
};

export default Header;
