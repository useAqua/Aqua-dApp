import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#01387C] group-[.toaster]:text-[#FAF8E9] group-[.toaster]:border-[#F1C67C]",
          description: "group-[.toast]:text-[#FAF8E9]/90",
          actionButton:
            "group-[.toast]:bg-[#F1C67C] group-[.toast]:text-[#01387C]",
          cancelButton:
            "group-[.toast]:bg-[#FAF8E9] group-[.toast]:text-[#01387C]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };