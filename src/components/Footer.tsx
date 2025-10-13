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
    <footer className="border-border mt-16 border-t py-8">
      <div className="container mx-auto px-4">
        <div className={"flex items-center justify-between"}>
          <p>© 2025 Aqua</p>

          <div className="flex flex-wrap justify-center gap-5">
            {links.map((item) => (
              <div key={item.label} className="py-1">
                <Link
                  href={item.href}
                  className={cn(
                    "text-foreground nav_link rounded-md px-0.5 py-1 transition-colors",
                  )}
                  target={"_blank"}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>

          <p>Built with 💧 by Aqua Labs</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
