import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-left"
      toastOptions={{
        classNames: {
          toast:
            "bg-gradient-to-br from-white/95 via-background/90 to-white/95 text-foreground border-2 border-primary/20 shadow-2xl backdrop-blur-md rounded-2xl px-6 py-4 group-[.toaster]:[&_[data-icon]]:!flex group-[.toaster]:[&_[data-icon]]:!items-center group-[.toaster]:[&_[data-icon]]:!justify-center",
          title: "text-foreground font-semibold text-base",
          description: "text-muted-foreground text-sm mt-1",
          actionButton:
            "bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium",
          cancelButton:
            "bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80",
          success:
            "!bg-gradient-to-br !from-emerald-50/95 !via-emerald-100/90 !to-emerald-50/95 !border-emerald-600/50 [&_*]:!text-emerald-900 group-[.toaster]:[&_[data-icon]]:!bg-gradient-to-br group-[.toaster]:[&_[data-icon]]:!from-emerald-500 group-[.toaster]:[&_[data-icon]]:!to-emerald-600 group-[.toaster]:[&_[data-icon]]:!rounded-full group-[.toaster]:[&_[data-icon]]:!p-2",
          error:
            "!bg-gradient-to-br !from-red-50/95 !via-red-100/90 !to-red-50/95 !border-red-600/50 [&_*]:!text-red-900 group-[.toaster]:[&_[data-icon]]:!bg-gradient-to-br group-[.toaster]:[&_[data-icon]]:!from-red-500 group-[.toaster]:[&_[data-icon]]:!to-red-600 group-[.toaster]:[&_[data-icon]]:!rounded-full group-[.toaster]:[&_[data-icon]]:!p-2",
          info: "!bg-gradient-to-br !from-blue-50/95 !via-blue-100/90 !to-blue-50/95 !border-blue-600/50 [&_*]:!text-blue-900 group-[.toaster]:[&_[data-icon]]:!bg-gradient-to-br group-[.toaster]:[&_[data-icon]]:!from-blue-500 group-[.toaster]:[&_[data-icon]]:!to-blue-600 group-[.toaster]:[&_[data-icon]]:!rounded-full group-[.toaster]:[&_[data-icon]]:!p-2",
          loading:
            "!bg-gradient-to-br !from-white/95 !via-background/90 !to-white/95 !border-primary/30 [&_*]:!text-foreground group-[.toaster]:[&_[data-icon]]:!bg-gradient-to-br group-[.toaster]:[&_[data-icon]]:!from-primary group-[.toaster]:[&_[data-icon]]:!to-primary/80 group-[.toaster]:[&_[data-icon]]:!rounded-full group-[.toaster]:[&_[data-icon]]:!p-2",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
