import Link from "next/link";
import { cn } from "~/lib/utils";

const Footer = () => {
  const links = [
    { label: "X", href: "https://x.com/useaqua_xyz" },
    { label: "Docs", href: "https://docs.useaqua.xyz" },
    { label: "Discord", href: "https://discord.gg/aqua" },
    { label: "GitHub", href: "https://github.com/useAqua" },
  ];

  return (
    <footer className="relative mt-16 overflow-x-clip">
      <div className="mx-auto mb-8 h-[150px] sm:h-[196px] md:h-[258px] lg:h-[300px]">
        <div className="absolute top-0 left-1/2 flex -translate-x-1/2 items-center justify-center">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "font-redaction text-[16.6666667vw] italic lg:text-[200px]",
                i === 2 ? "z-[1] -mx-[3%]" : "text-footer-muted",
              )}
            >
              Aqua
            </span>
          ))}
        </div>
      </div>
      <div className="border-border border-t px-4 py-8">
        <div
          className={
            "container mx-auto flex items-center justify-between gap-4 max-md:flex-col"
          }
        >
          <p className="max-md:hidden">© 2025 Aqua</p>

          <div className="flex flex-wrap justify-center gap-5 max-md:mb-4">
            {links.map((item) => (
              <div key={item.label} className="py-1">
                <Link
                  href={item.href}
                  className={cn(
                    "text-foreground nav_link rounded-md px-0.5 py-1 underline transition-colors",
                  )}
                  target={"_blank"}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>

          <p>Built with 💧 by Aqua Labs</p>
          <p className="md:hidden">© 2025 Aqua</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
