import { FileRouteTypes } from "@/routeTree.gen";
import { Blocks, House, LucideIcon, BookMarked, Star, Upload, BookOpenText, SearchIcon } from "lucide-react";

export type Submenu = {
  href: FileRouteTypes["fullPaths"];
  label: string;
  active: boolean;
};

type Menu = {
  href: FileRouteTypes["fullPaths"];
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
  disabled?: boolean;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: FileRouteTypes["fullPaths"] | string, beta: boolean): Group[] {
  return [
    {
      groupLabel: "General",
      menus: [
        {
          href: "/",
          label: "Search",
          active: pathname === "/",
          icon: SearchIcon,
          submenus: [],
        },
        {
          href: "/featured",
          label: "Featured",
          active: pathname === "/featured",
          icon: Star,
          submenus: [],
        },
        {
          href: "/upload",
          label: "Upload",
          active: pathname === "/upload",
          icon: Upload,
          submenus: [],
          disabled: import.meta.env.PROD,
        },
      ],
    },
    {
      groupLabel: "Account",
      menus: [
        {
          href: "/account",
          label: "Account",
          active: pathname === "/account",
          icon: House,
          submenus: [],
          disabled: import.meta.env.DEV ? false : !beta,
        },
        {
          href: "/library",
          label: "Library",
          active: pathname === "/library",
          icon: BookMarked,
          submenus: [],
        },
        {
          href: "/settings",
          label: "Settings",
          active: pathname === "/settings",
          icon: Blocks,
          submenus: [],
        },
      ],
    },
  ];
}
