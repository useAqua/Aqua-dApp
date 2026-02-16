import Link from "next/link";
import aquaLogo from "~/assets/aqua-logo.svg";
import Image from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { CustomConnectButton } from "~/components/common/CustomConnectButton";
import { Menu } from "lucide-react";
import { useState } from "react";
import MobileNav from "./MobileNav";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="relative pt-14 pb-4">
        <div className="flex items-center justify-between px-5">
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

          {/*<nav className="hidden items-center gap-5 md:flex">*/}
          {/*  {navItems.map((item) => (*/}
          {/*    <div key={item.path} className="py-1">*/}
          {/*      <Link*/}
          {/*        href={item.path}*/}
          {/*        className={cn(*/}
          {/*          "text-foreground nav_link rounded-md px-0.5 py-1 transition-colors",*/}

          {/*          { active: router.pathname === item.path },*/}
          {/*        )}*/}
          {/*        target={*/}
          {/*          item.label === "Docs" || item.label === "Faucet"*/}
          {/*            ? "_blank"*/}
          {/*            : undefined*/}
          {/*        }*/}
          {/*      >*/}
          {/*        {item.label}*/}
          {/*      </Link>*/}
          {/*    </div>*/}
          {/*  ))}*/}
          {/*</nav>*/}

          <div className="flex items-center gap-2 sm:gap-4">
            <CustomConnectButton />

            <button
              className="text-foreground bg-card border-border/30 hover:bg-accent/50 cursor-pointer rounded-lg border p-2 shadow-[var(--shadow-card)] transition-colors"
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
      />
    </>
  );
};

export default Header;
