import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLayoutStore } from "@/stores/layout";
import { Link } from "@tanstack/react-router";
import { Menu } from "./menu";
import { useSettingsStore } from "@/stores/settings";

import Logo from "@/assets/logo.svg";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="invisible absolute -right-[16px] top-[12px] z-20 lg:visible">
      <Button onClick={() => setIsOpen?.()} className="h-8 w-8 rounded-md" variant="outline" size="icon">
        <ChevronLeft className={cn("h-4 w-4 transition-transform duration-700 ease-in-out", isOpen === false ? "rotate-180" : "rotate-0")} />
      </Button>
    </div>
  );
}

export function Sidebar() {
  const theme = useSettingsStore((state) => state.theme);
  const sidebar = useLayoutStore((state) => state.sidebar);

  return (
    <aside className={cn("fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0", sidebar?.isOpen === false ? "w-[90px]" : "w-72")}>
      <SidebarToggle isOpen={sidebar.isOpen} setIsOpen={sidebar.setIsOpen} />
      <div className="relative flex h-[calc(100vh_-_56px)] flex-col overflow-y-auto px-3 pt-3">
        <div className={cn("flex justify-center transition-transform duration-300 ease-in-out", sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0")}>
          <Link to="/" className="m-1 flex items-center gap-2" search={{ q: "" }}>
            {theme === "dark" ? (
              <div className="flex items-center">
                <img src={Logo} className={sidebar.isOpen ? "h-11" : "h-8"} />
                {sidebar.isOpen && (
                  <div className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    <h3 className="text-3xl text-secondary-foreground">Bookracy</h3>
                    <div className="text-xs text-muted-foreground">Why pay for knowledge?</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <img src={Logo} className={sidebar.isOpen ? "h-11" : "h-8"} />
                {sidebar.isOpen && (
                  <div className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    <h3 className="text-3xl text-secondary-foreground">Bookracy</h3>
                    <div className="text-xs text-muted-foreground">Why pay for knowledge?</div>
                  </div>
                )}
              </div>
            )}
          </Link>
        </div>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
      <div className="flex flex-col items-center justify-center px-3 pt-2">
        <Button variant="outline" className="h-auto w-full overflow-hidden p-0" onClick={() => window.open("https://snowcore.io/ref?bookracy", "_blank")}>
          <img src="https://raw.githubusercontent.com/bookracy/static/main/ads/snowcore-purple.gif?raw=true" className="h-full w-full object-cover" />
        </Button>
      </div>
    </aside>
  );
}
