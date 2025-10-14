interface VaultIconProps {
  icon: string;
  size?: "sm" | "md" | "lg";
}

const VaultIcon = ({ icon, size = "md" }: VaultIconProps) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-lg",
    lg: "h-12 w-12 text-xl",
  };

  return (
    <div
      className={`bg-primary/10 flex shrink-0 items-center justify-center rounded-full font-semibold ${sizeClasses[size]}`}
    >
      {icon}
    </div>
  );
};

export default VaultIcon;
