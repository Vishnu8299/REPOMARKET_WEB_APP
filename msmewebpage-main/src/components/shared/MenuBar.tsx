import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserRole = "admin" | "developer" | "buyer";

const MenuBar = () => {
  const { user, logout } = useAuth();

  const getDashboardPath = () => {
    switch (user?.role) {
      case "admin":
        return "/admin";
      case "developer":
        return "/developer";
      case "buyer":
        return "/buyer";
      default:
        return "/home";
    }
  };

  const getMenuItems = () => {
    const commonItems = [
      { label: "Dashboard", path: getDashboardPath() },
      { label: "Analytics", path: "/analytics" },
    ];

    switch (user?.role) {
      case "admin":
        return [
          ...commonItems,
          { label: "Users", path: "/users" },
          { label: "Settings", path: "/settings" },
        ];
      case "developer":
        return [
          ...commonItems,
          { label: "My Repositories", path: "/repositories" },
          { label: "Hackathons", path: "/hackathons" },
        ];
      case "buyer":
        return [
          ...commonItems,
          { label: "Marketplace", path: "/marketplace" },
          { label: "Purchases", path: "/purchases" },
        ];
      default:
        return commonItems;
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={getDashboardPath()}>
              <img 
                src="/lovable-uploads/34eef80b-db30-4981-aa71-f838c66de8dd.png" 
                alt="RepoMarket Logo" 
                className="h-8" 
              />
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              {getMenuItems().map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span className="text-sm">Signed in as {user?.name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;