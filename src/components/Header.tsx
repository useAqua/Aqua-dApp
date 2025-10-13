import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { Wallet } from "lucide-react";
import aquaLogo from "~/assets/aqua-logo.svg";
import Image from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { cn } from "~/lib/utils";

const Header = () => {
  const router = useRouter();

  const navItems = [
    { path: "/", label: "Vaults" },
    { path: "/dashboard", label: "Dashboard" },
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

        <nav className="hidden items-center md:flex gap-5">
          {navItems.map((item) => (
            <div key={item.path} className="py-1">
              <Link

                href={item.path}
                className={cn(
                  "text-foreground nav_link rounded-md py-1 px-0.5 transition-colors",

                  { active: router.pathname === item.path },
                )}
                target={item.label === "Docs" ? "_blank": undefined}
              >
                {item.label}
              </Link>
            </div>

          ))}
        </nav>

        <Button>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    </header>
  );
};

export default Header;
