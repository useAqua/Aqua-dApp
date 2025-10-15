import { TabsList, TabsTrigger } from "~/components/ui/tabs";

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: readonly Tab[];
  className?: string;
}

const TabNavigation = ({ tabs, className = "" }: TabNavigationProps) => {
  return (
    <TabsList className="bg-secondary ring-border text-secondary-foreground w-max ring">
      <div className={`flex items-center gap-4 ${className}`}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </div>
    </TabsList>
  );
};

export default TabNavigation;
