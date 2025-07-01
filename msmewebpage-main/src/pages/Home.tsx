import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, Search, Bell, X, ChevronDown } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import FeaturedRepos from "@/components/home/FeaturedRepos";
import Testimonials from "@/components/home/Testimonials";
import Hackathons from "@/components/home/Hackathons";
import FooterSection from "@/components/home/FooterSection";
import { cn } from "@/lib/utils";
import { 
  Home as HomeIcon, Layout, ShoppingBag, Trophy, MessageCircle, Shield, Users, 
  BarChart, GitBranch, ShoppingCart, Rocket, Star, Clock, PenTool, MessageSquare, 
  Tags, Zap
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: { 
    label: string; 
    href: string;
    icon?: React.ReactNode;
    description?: string;
  }[];
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
  {
    label: "Features",
    href: "#features",
    icon: <Layout className="w-4 h-4" />,
    children: [
      { 
        label: "Repository Management", 
        href: "#features-repo",
        icon: <GitBranch className="w-4 h-4" />,
        description: "Manage your code repositories efficiently"
      },
      { 
        label: "Team Collaboration", 
        href: "#features-collab",
        icon: <Users className="w-4 h-4" />,
        description: "Work together seamlessly"
      },
      { 
        label: "Security & Access", 
        href: "#features-security",
        icon: <Shield className="w-4 h-4" />,
        description: "Keep your code secure"
      },
      { 
        label: "Analytics", 
        href: "#features-analytics",
        icon: <BarChart className="w-4 h-4" />,
        description: "Track your project metrics"
      },
    ],
  },
  { 
    label: "Marketplace",
    href: "#marketplace",
    icon: <ShoppingCart className="w-4 h-4" />,
    children: [
      { 
        label: "Popular Repos", 
        href: "#marketplace-popular",
        icon: <Star className="w-4 h-4" />,
        description: "Most downloaded repositories"
      },
      { 
        label: "New Releases", 
        href: "#marketplace-new",
        icon: <Zap className="w-4 h-4" />,
        description: "Latest repository updates"
      },
      { 
        label: "Categories", 
        href: "#marketplace-categories",
        icon: <Tags className="w-4 h-4" />,
        description: "Browse by category"
      },
    ],
  },
  { 
    label: "Hackathons",
    href: "#hackathons",
    icon: <Rocket className="w-4 h-4" />,
    children: [
      { 
        label: "Upcoming Events", 
        href: "#hackathons-upcoming",
        icon: <Clock className="w-4 h-4" />,
        description: "Join upcoming hackathons"
      },
      { 
        label: "Past Events", 
        href: "#hackathons-past",
        icon: <Trophy className="w-4 h-4" />,
        description: "View previous competitions"
      },
      { 
        label: "Submit Project", 
        href: "#hackathons-submit",
        icon: <PenTool className="w-4 h-4" />,
        description: "Register your hackathon project"
      },
    ],
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.nav-dropdown')) {
        setActiveDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Add meta tags dynamically
    document.title = "RepoMarket - Your Repository Marketplace";
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Find and share code repositories, join hackathons, and collaborate with developers.';
    document.head.appendChild(metaDescription);
    
    return () => {
      document.head.removeChild(metaDescription);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const scrollToSection = (href: string) => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Error fallback component
  const ErrorFallback = ({ error, resetErrorBoundary }) => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
      <pre className="text-sm bg-gray-100 p-4 rounded mb-4">{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Navigation */}
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "sticky top-0 w-full z-50 transition-all duration-500",
            isScrolled 
              ? "bg-white/80 border-b border-gray-200/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] backdrop-blur-md backdrop-saturate-150" 
              : "bg-transparent backdrop-blur-sm"
          )}
        >
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 origin-left"
            style={{ scaleX }}
          />
          <div className="w-full relative">
            <div className="flex items-center justify-between h-20 px-6 mx-auto max-w-7xl">
              <div className="flex items-center space-x-8">
                <div className="relative flex items-center py-2">
                  <a
                    href="#"
                    className="relative flex items-center justify-center h-[52px] focus:outline-none"
                  >
                    <img 
                      src="/lovable-uploads/34eef80b-db30-4981-aa71-f838c66de8dd.png" 
                      alt="RepoMarket Logo" 
                      className="w-auto h-full object-contain px-1"
                      style={{ maxWidth: '180px' }}
                    />
                  </a>
                </div>
                <div className="hidden lg:flex items-center space-x-6">
                  {navLinks.map((link) => (
                    <div key={link.label} className="relative nav-dropdown group">
                      <button
                        onClick={() => {
                          if (link.children) {
                            setActiveDropdown(activeDropdown === link.label ? null : link.label);
                          } else {
                            scrollToSection(link.href);
                          }
                        }}
                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 group"
                      >
                        {link.icon}
                        <span>{link.label}</span>
                        {link.children && (
                          <ChevronDown className={cn(
                            "w-4 h-4 transition-transform duration-200 group-hover:rotate-180",
                            activeDropdown === link.label ? "rotate-180" : ""
                          )} />
                        )}
                      </button>

                      {link.children && (
                        <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          {link.children.map((child) => (
                            <button
                              key={child.label}
                              onClick={() => scrollToSection(child.href)}
                              className="w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                {child.icon}
                                <div className="flex flex-col">
                                  <span className="font-medium">{child.label}</span>
                                  {child.description && (
                                    <span className="text-sm text-gray-500">{child.description}</span>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="hidden lg:flex items-center space-x-6">
                <form onSubmit={handleSearch} className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-blue-500 transition-colors" />
                  <input 
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search repositories..." 
                    className="pl-10 pr-4 py-2 rounded-full bg-gray-50/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all duration-300 hover:bg-white focus:w-80"
                  />
                </form>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/login")}
                  className="hover:bg-gray-100"
                >
                  Sign In
                </Button>

                <Button 
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Sign Up
                </Button>
              </div>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </motion.nav>
        
        {/* Mobile Menu with improved animation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm"
            >
              <div className="container mx-auto px-4 py-4 bg-white">
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      <button
                        onClick={() => {
                          if (link.children) {
                            setActiveDropdown(activeDropdown === link.label ? null : link.label);
                          } else {
                            scrollToSection(link.href);
                          }
                        }}
                        className="flex items-center justify-between w-full px-2 py-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg"
                      >
                        <span>{link.label}</span>
                        {link.children && (
                          <ChevronDown className={cn(
                            "w-4 h-4 transition-transform",
                            activeDropdown === link.label ? "rotate-180" : ""
                          )} />
                        )}
                      </button>

                      {link.children && activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="pl-4 mt-2 space-y-2"
                        >
                          {link.children.map((child) => (
                            <button
                              key={child.label}
                              onClick={() => scrollToSection(child.href)}
                              className="block w-full text-left px-2 py-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg"
                            >
                              {child.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}

                  <div className="pt-4 border-t border-gray-100">
                    <form onSubmit={handleSearch} className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search repositories..." 
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </form>

                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate("/login")}
                        className="w-full"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => navigate("/signup")}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }>
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <HeroSection />
            <FeaturesSection />
            <FeaturedRepos />
            <Hackathons />
            <Testimonials />
            <FooterSection />
          </motion.main>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default Home;
