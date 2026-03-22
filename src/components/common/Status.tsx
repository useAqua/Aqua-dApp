import { cn } from "~/lib/utils";
import { Dot } from "lucide-react";

export function Status({
  text,
  state = "Inactive",
  className,
}: {
  text: string;
  state?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center gap-1 rounded-full border border-gray-400 bg-gray-200/20 text-gray-500",
        {
          "border-teal-500 bg-teal-200/20 text-teal-500": state === "Active",
          "border-red-400 bg-red-200/20 text-red-500": state === "Inactive",
        },
        className,
      )}
    >
      <Dot size={30} className={cn("absolute")} />
      <span className="py-1 pr-4 pl-6 text-sm font-medium">{text}</span>
    </div>
  );
}
