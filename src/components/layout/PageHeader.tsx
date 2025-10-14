import { type LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  iconBeforeTitle?: boolean;
}

const PageHeader = ({
  icon: Icon,
  title,
  subtitle,
  actions,
  className = "",
  iconBeforeTitle,
}: PageHeaderProps) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <div
          className={cn("flex items-center gap-3", {
            "flex-row-reverse": iconBeforeTitle,
          })}
        >
          {Icon && <Icon className="text-primary h-6 w-6" />}
          <div>
            <h1 className="text-lg font-bold md:text-3xl">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
