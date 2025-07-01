import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShoppingCart, Bell, Search, Menu, User, ChevronDown,
  Briefcase, GraduationCap, FileText, Settings, MessageSquare,
  Heart, Users, HelpCircle, LogOut, LayoutGrid, Package, Home, ShoppingBag, Zap, Newspaper,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FooterSection from "@/components/home/FooterSection";
import HeroSectionBUYER from "@/components/buyer/HeroSectionBUYER";
import NewRepo from "@/components/buyer/NewRepo";
import { useAuth } from "@/contexts/AuthContext";
import { Transition } from "@headlessui/react";
import { useInView } from "react-intersection-observer";
import { useScroll, useTransform } from "framer-motion";

const Marketplace = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showNextSection, setShowNextSection] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const { scrollYProgress, scrollY } = useScroll();

  const parallax = {
    content: {
      y: useTransform(scrollY, [0, 500], [200, -100]),
      opacity: useTransform(scrollY, [0, 200], [0.3, 1]),
      scale: useTransform(scrollY, [0, 500], [0.8, 1]),
      filter: useTransform(
        scrollY,
        [0, 300],
        ['blur(5px)', 'blur(0px)']
      )
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHeroVisible(false);
      setShowNextSection(true);
    }, 3000); // Adjust timing as needed
    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated && !isLoading) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      q: searchQuery,
      type: 'repository',
      sort: 'relevance'
    });
    navigate(`/buyer/search?${params.toString()}`);
  };

  const navItems = [
    { 
      label: "Home", 
      href: "/buyer/home", 
      icon: Home,
      description: "Return to dashboard"
    },
    { 
      label: "News",
      href: "/buyer/news",
      icon: Newspaper,
      description: "Latest updates and announcements",
      badge: "Updates",
      badgeColor: "bg-blue-500"
    },
    { 
      label: "Marketplace", 
      href: "/buyer/marketplace",
      icon: ShoppingBag,
      badge: "New",
      badgeColor: "bg-green-500",
      description: "Browse repositories" 
    },
    {
      label: "Engage Hub",
      icon: Zap,
      description: "Connect and collaborate",
      items: [
        { 
          label: "Post Job", 
          icon: Briefcase, 
          href: "/buyer/post-job",
          description: "Find talented developers" 
        },
        { 
          label: "Post Internship", 
          icon: GraduationCap, 
          href: "/buyer/post-internship",
          description: "Hire interns for your projects"
        },
        { 
          label: "Post Problem", 
          icon: FileText, 
          href: "/buyer/post-problem",
          description: "Get solutions from experts",
          badge: "Beta"
        },
        { 
          label: "Manage Posts", 
          icon: LayoutGrid, 
          href: "/buyer/manage-posts",
          count: 5 // Dynamic number of active posts
        }
      ]
    },
    { 
      label: "My Purchases", 
      href: "/buyer/purchases", 
      icon: Package,
      count: 3 // Dynamic number of recent purchases
    },
    { 
      label: "Favorites", 
      href: "/buyer/favorites", 
      icon: Heart,
      count: 12 // Dynamic number of favorites
    }
  ];

  // Enhanced profile menu with categories
  const profileMenu = [
    {
      category: "Account",
      items: [
        { 
          label: "Profile", 
          icon: User, 
          href: "/buyer/profile",
          description: "Manage your account" 
        },
        { 
          label: "Settings", 
          icon: Settings, 
          href: "/buyer/settings",
          description: "Preferences and security" 
        }
      ]
    },
    {
      category: "Help & Support",
      items: [
        { 
          label: "Support", 
          icon: HelpCircle, 
          href: "/buyer/support",
          description: "Get help and contact us" 
        },
        { 
          label: "Documentation", 
          icon: FileText, 
          href: "/buyer/docs",
          description: "Guides and resources" 
        }
      ]
    },
    {
      category: "Session",
      items: [
        { 
          label: "Logout", 
          icon: LogOut, 
          onClick: () => {
            // Add logout logic here
            navigate('/login');
          },
          description: "End your session"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 w-full backdrop-blur-md border-b z-50 bg-white/90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-4">
                <img 
                  src="/lovable-uploads/34eef80b-db30-4981-aa71-f838c66de8dd.png" 
                  alt="Logo" 
                  className="w-12 h-12"
                />
              </Link>

              {/* Main Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <div key={item.label} className="relative">
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                      onClick={() => item.items && setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                      {item.items && <ChevronDown className={cn(
                        "w-4 h-4 transition-transform",
                        activeDropdown === item.label && "rotate-180"
                      )} />}
                    </Button>

                    {/* Dropdown for Engage Hub */}
                    {item.items && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                      >
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                          >
                            <subItem.icon className="w-4 h-4" />
                            <span>{subItem.label}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search repositories..." 
                  className="pl-10 pr-12 py-2 w-72 rounded-full bg-gray-50/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white focus:w-96"
                />
              </form>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              {/* Profile Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                    {authUser?.name?.charAt(0) || "U"}
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    activeDropdown === 'profile' && "rotate-180"
                  )} />
                </Button>

                {/* Profile Dropdown */}
                {activeDropdown === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                  >
                    {profileMenu.map((category) => (
                      <div key={category.category}>
                        <div className="px-4 py-2 text-gray-500 text-sm">{category.category}</div>
                        {category.items.map((item) => (
                          <Button
                            key={item.label}
                            variant="ghost"
                            className="w-full justify-start px-4 py-2 hover:bg-gray-50"
                            onClick={item.onClick || (() => navigate(item.href))}
                          >
                            <item.icon className="w-4 h-4 mr-2" />
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <motion.main className="relative flex-1 bg-gradient-to-b from-slate-50 via-blue-50/30 to-white">
        <div className="relative z-10">
          <motion.div className="min-h-screen relative">
            <HeroSectionBUYER />
          </motion.div>

          <motion.div 
            className="min-h-screen relative flex items-center justify-center px-6"
            style={parallax.content}
          >
            <div className="w-full max-w-6xl">
              <motion.div
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-100/50"
                initial={false}
                animate={{ 
                  y: [50, 0],
                  opacity: [0, 1],
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                }}
              >
                <NewRepo />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <FooterSection />
      </motion.main>
    </div>
  );
};

export default Marketplace;