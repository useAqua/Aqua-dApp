import Link from "next/link";
import { useRouter } from "next/router";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";
import { CustomConnectButton } from "~/components/common/CustomConnectButton";
import { useEffect } from "react";
import Image from "next/image";
import aquaLogo from "~/assets/aqua-logo.svg";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { path: string; label: string }[];
}

const MobileNav = ({ isOpen, onClose, navItems }: MobileNavProps) => {
  const router = useRouter();

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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "bg-background fixed top-0 right-0 z-50 h-full w-64 transform shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-border flex items-center justify-between border-b p-4">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Image
                src={aquaLogo as StaticImport}
                alt="Aqua Protocol"
                className="h-6"
              />
            </Link>
            <button
              onClick={onClose}
              className="text-foreground hover:bg-accent rounded-md p-2 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "nav_link text-foreground hover:bg-accent rounded-md px-4 py-3 transition-colors",
                  { active: router.pathname === item.path },
                )}
                target={
                  item.label === "Docs" || item.label === "Faucet"
                    ? "_blank"
                    : undefined
                }
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-border border-t p-4">
            <div className="mx-auto w-max">
              <CustomConnectButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
