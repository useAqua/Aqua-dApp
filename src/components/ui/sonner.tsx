import { useTheme } from "next-themes";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";
import {
  CheckIcon,
  InfoIcon,
  CircleAlertIcon,
  CircleX,
  LoaderCircleIcon,
  XIcon,
} from "lucide-react";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "~/lib/utils";
import useIsMobile from "~/hooks/use-is-mobile";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const { isMobile } = useIsMobile();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position={isMobile ? "bottom-right" : "top-right"}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "w-full",
        },
      }}
      {...props}
    />
  );
};

type ToastVariant =
  | "default"
  | "success"
  | "error"
  | "info"
  | "warning"
  | "loading";

interface CustomToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  icon?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
  className?: string;
  children?: ReactNode;
}

const CustomToast = ({
  title,
  description,
  variant = "default",
  icon,
  action,
  onClose,
  className,
  children,
}: CustomToastProps) => {
  const defaultIcons = {
    default: null,
    success: <CheckIcon className="h-6 w-6 text-white" />,
    error: <CircleX className="h-6 w-6 text-white" />,
    info: <InfoIcon className="h-6 w-6 text-white" />,
    warning: <CircleAlertIcon className="h-6 w-6 text-white" />,
    loading: <LoaderCircleIcon className="text-primary h-8 w-8 animate-spin" />,
  };

  const variantStyles = {
    default:
      "bg-gradient-to-br from-white/95 via-background/90 to-white/95 border-primary/20",
    success:
      "bg-gradient-to-br from-emerald-50/95 via-emerald-100/90 to-emerald-50/95 border-emerald-600/50",
    error:
      "bg-gradient-to-br from-red-50/95 via-red-100/90 to-red-50/95 border-red-600/50",
    info: "bg-gradient-to-br from-blue-50/95 via-blue-100/90 to-blue-50/95 border-blue-600/50",
    warning:
      "bg-gradient-to-br from-amber-50/95 via-amber-100/90 to-amber-50/95 border-amber-600/50",
    loading:
      "bg-gradient-to-br from-white/95 via-background/90 to-white/95 border-primary/30",
  };

  const iconBgStyles = {
    default: "bg-gradient-to-br from-primary to-primary/80",
    success: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    error: "bg-gradient-to-br from-red-500 to-red-600",
    info: "bg-gradient-to-br from-blue-500 to-blue-600",
    warning: "bg-gradient-to-br from-amber-500 to-amber-600",
    loading: "bg-transparent p-0",
  };

  const textStyles = {
    default: "text-foreground",
    success: "text-emerald-900",
    error: "text-red-900",
    info: "text-blue-900",
    warning: "text-amber-900",
    loading: "text-foreground",
  };

  const displayIcon = icon !== undefined ? icon : defaultIcons[variant];

  return (
    <div
      className={cn(
        "flex w-full max-w-md items-center gap-2 rounded-2xl border p-4 shadow-2xl backdrop-blur-md",
        variantStyles[variant],
        className,
      )}
    >
      {displayIcon && (
        <div
          className={cn(
            "flex flex-shrink-0 items-center justify-center rounded-full p-2",
            iconBgStyles[variant],
          )}
        >
          {displayIcon}
        </div>
      )}

      <div className={cn("mr-4 min-w-0 flex-1", textStyles[variant])}>
        {children ?? (
          <>
            {title && (
              <div className="text-base leading-tight font-semibold">
                {title}
              </div>
            )}
            {description && (
              <div className="mt-1 text-sm opacity-90">{description}</div>
            )}
            {action && <div className="mt-3">{action}</div>}
          </>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 flex-shrink-0 opacity-70 transition-opacity hover:opacity-100",
            textStyles[variant],
          )}
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

interface ToastOptions extends Omit<CustomToastProps, "variant"> {
  duration?: number;
  id?: string | number;
}

const toast = {
  custom: (
    component: (id: string | number) => ReactElement,
    options?: { duration?: number; id?: string | number },
  ) => {
    return sonnerToast.custom(component, options);
  },

  success: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <CustomToast
          title={title}
          variant="success"
          onClose={() => sonnerToast.dismiss(id)}
          {...options}
        />
      ),
      { duration: options?.duration, id: options?.id },
    );
  },

  error: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <CustomToast
          title={title}
          variant="error"
          onClose={() => sonnerToast.dismiss(id)}
          {...options}
        />
      ),
      { duration: options?.duration, id: options?.id },
    );
  },

  info: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <CustomToast
          title={title}
          variant="info"
          onClose={() => sonnerToast.dismiss(id)}
          {...options}
        />
      ),
      { duration: options?.duration, id: options?.id },
    );
  },

  warning: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <CustomToast
          title={title}
          variant="warning"
          onClose={() => sonnerToast.dismiss(id)}
          {...options}
        />
      ),
      { duration: options?.duration, id: options?.id },
    );
  },

  loading: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <CustomToast
          title={title}
          variant="loading"
          onClose={() => sonnerToast.dismiss(id)}
          {...options}
        />
      ),
      { duration: options?.duration ?? Infinity, id: options?.id },
    );
  },

  message: (title: string, options?: ToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <CustomToast
          title={title}
          variant="default"
          onClose={() => sonnerToast.dismiss(id)}
          {...options}
        />
      ),
      { duration: options?.duration, id: options?.id },
    );
  },

  dismiss: sonnerToast.dismiss,
  promise: sonnerToast.promise,
};

export { Toaster, toast, CustomToast };
export type { ToastVariant, CustomToastProps, ToastOptions };
