import { Coffee, BarChart3, Users, Package, ShoppingCart, Settings, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand/BrandLogo";

const mainItems = [
  { title: "POS", url: "/", icon: Coffee },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Products", url: "/products", icon: Package },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

const adminItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) =>
    isActive(path)
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "hover:bg-sidebar-accent/50";

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        {isCollapsed ? (
          <div className="flex justify-center text-[#c4a574]" aria-label="The Kaye-ffeine Spot">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
              <ellipse cx="12" cy="12" rx="7" ry="10" />
            </svg>
          </div>
        ) : (
          <BrandMark size="sm" tone="light" className="w-full" />
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {profile?.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClass(item.url)}>
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="text-xs">
              <p className="font-medium">{profile?.full_name}</p>
              <p className="text-sidebar-foreground/70 capitalize">{profile?.role}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="w-full text-xs bg-white text-black hover:bg-neutral-100 hover:text-black border-white"
            >
              <LogOut className="h-3 w-3 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="w-full p-2 bg-white text-black hover:bg-neutral-100 hover:text-black border-white"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
