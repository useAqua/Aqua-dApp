import Link from "next/link";

const links = [
  // { label: "X", href: "https://x.com/useaqua_xyz" },
  {
    label: "Docs",
    href: "https://docs.useaqua.xyz",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M3 4.5C3 3.67 3.67 3 4.5 3h9c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-9c-.83 0-1.5-.67-1.5-1.5v-9z"
          stroke="currentColor"
          strokeWidth="1.5"
        ></path>
        <path
          d="M6 6.5h6M6 9h6M6 11.5h4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        ></path>
      </svg>
    ),
  },
  {
    href: "https://testnet.megaeth.com",
    label: "Faucet",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 3v6M6 6l3 3 3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M3 12v1.5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        ></path>
      </svg>
    ),
  },
  {
    href: "https://docs.megaeth.com",
    label: "Support",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle
          cx="9"
          cy="9"
          r="6"
          stroke="currentColor"
          strokeWidth="1.4"
        ></circle>
        <path
          d="M9 6.5v5M6.5 9h5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        ></path>
      </svg>
    ),
  },
  // { label: "Discord", href: "#" },
  // { label: "GitHub", href: "https://github.com/useAqua" },
];
const Footer = () => {
  return (
    <footer className="/*mt-8*/ relative overflow-x-clip pb-4">
      <div className={"flex items-center gap-4 p-5"}>
        {links.map((item) => (
          <Link
            href={item.href}
            target={"_blank"}
            key={item.label}
            className="bg-card border-border/30 hover:bg-accent/50 text-foreground flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md border p-2 text-sm shadow-(--shadow-card) transition-colors active:scale-95"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      {/*<div className="mx-auto mb-8">*/}
      {/*  <div className="flex items-center justify-center">*/}
      {/*    {[1, 2, 3].map((i) => (*/}
      {/*      <span*/}
      {/*        key={i}*/}
      {/*        className={cn(*/}
      {/*          "font-redaction text-[16.6666667vw] italic lg:text-[200px]",*/}
      {/*          i === 2*/}
      {/*            ? "z-[1] -mx-[3%]"*/}
      {/*            : "text-footer-muted animate-glow animation-duration-[2500ms]",*/}
      {/*        )}*/}
      {/*      >*/}
      {/*        Aqua*/}
      {/*      </span>*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<div className="border-border border-t px-4 py-8">*/}
      {/*  <div*/}
      {/*    className={*/}
      {/*      "container mx-auto flex items-center justify-between gap-4 max-md:flex-col"*/}
      {/*    }*/}
      {/*  >*/}
      {/*    <p className="max-md:hidden">© 2025 Aqua</p>*/}

      {/*    <div className="flex flex-wrap justify-center gap-5 max-md:mb-4">*/}
      {/*      {links.map((item) => (*/}
      {/*        <div key={item.label} className="py-1">*/}
      {/*          <Link*/}
      {/*            href={item.href}*/}
      {/*            className={cn(*/}
      {/*              "text-foreground nav_link rounded-md px-0.5 py-1 underline transition-colors",*/}
      {/*            )}*/}
      {/*            target={"_blank"}*/}
      {/*          >*/}
      {/*            {item.label}*/}
      {/*          </Link>*/}
      {/*        </div>*/}
      {/*      ))}*/}
      {/*    </div>*/}

      {/*    <p>Built with 💧 by Aqua Labs</p>*/}
      {/*    <p className="md:hidden">© 2025 Aqua</p>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </footer>
  );
};

export default Footer;
