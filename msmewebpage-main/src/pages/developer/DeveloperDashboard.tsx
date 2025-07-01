import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence, useInView, useMotionValue, useMotionTemplate } from "framer-motion";
import type { RefObject } from "react";
import { 
  Code, GitBranch, User, FileCode, Bell,
  BarChart, Users, Package, Terminal, LogOut,
  Settings, FolderGit, Zap, Star, ChevronRight,
  CreditCard, ArrowRight, Clock, Calendar,
  Truck, Search, Activity, Shield, 
  Download, Eye, MessageSquare, Rocket,
  CheckCircle, AlertCircle, TrendingUp,
  Menu, X, ChevronDown, Cloud,
  Newspaper, Timer
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import FooterSection from "@/components/home/FooterSection";
import HeroSection from "@/components/home/HeroSection";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Define interfaces for our data types
interface DashboardData {
  overview: {
    activeProjects: number;
    pendingTasks: number;
    upcomingDeadlines: number;
    recentCommits: number;
  };
  repositories: {
    total: number;
    trending: number;
    stars: number;
    contributions: number;
    pullRequests: {
      open: number;
      merged: number;
      closed: number;
    };
    popularRepos: Array<{
      name: string;
      stars: number;
      forks: number;
      language: string;
      lastUpdated: string;
      description: string;
    }>;
  };
  activity: {
    today: Array<{
      id: number;
      type: string;
      repo: string;
      message: string;
      time: string;
      branch?: string;
      prNumber?: string;
      status?: string;
    }>;
    notifications: Array<{
      id: number;
      type: string;
      message: string;
      time: string;
      unread: boolean;
    }>;
  };
  performance: {
    commitFrequency: number[];
    codeQuality: number;
    buildSuccess: number;
    deployments: {
      successful: number;
      failed: number;
      total: number;
    };
  };
}

interface NavLink {
  label: string;
  href: string;
  icon: any;
  children?: { label: string; href: string; icon: any }[];
}

interface ProfileMenuItem {
  label: string;
  href?: string;
  icon: any;
  onClick?: () => void;
  divider?: boolean;
}

interface User {
  // ... other fields ...
  createdAt: string; // ISO date string
}

const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    overview: {
      activeProjects: 5,
      pendingTasks: 8,
      upcomingDeadlines: 3,
      recentCommits: 24
    },
    repositories: {
      total: 12,
      trending: 3,
      stars: 156,
      contributions: 342,
      pullRequests: {
        open: 8,
        merged: 45,
        closed: 12
      },
      popularRepos: [
        {
          name: "e-commerce-platform",
          stars: 89,
          forks: 23,
          language: "TypeScript",
          lastUpdated: "2 hours ago",
          description: "Modern e-commerce solution with React and Node.js"
        },
        {
          name: "cloud-deployment-tool",
          stars: 67,
          forks: 15,
          language: "Python",
          lastUpdated: "1 day ago",
          description: "Automated cloud deployment with CI/CD integration"
        },
        {
          name: "mobile-app-template",
          stars: 45,
          forks: 12,
          language: "React Native",
          lastUpdated: "3 days ago",
          description: "Production-ready mobile app starter template"
        }
      ]
    },
    activity: {
      today: [
        {
          id: 1,
          type: "commit",
          repo: "e-commerce-platform",
          message: "Updated payment integration",
          time: "2 hours ago",
          branch: "feature/payments"
        },
        {
          id: 2,
          type: "pr-merged",
          repo: "cloud-deployment-tool",
          message: "Add AWS integration",
          time: "4 hours ago",
          prNumber: "#123"
        },
        {
          id: 3,
          type: "issue",
          repo: "mobile-app-template",
          message: "Fix iOS build error",
          time: "5 hours ago",
          status: "in-progress"
        }
      ],
      notifications: [
        {
          id: 1,
          type: "mention",
          message: "@developer mentioned you in a comment",
          time: "1 hour ago",
          unread: true
        },
        {
          id: 2,
          type: "pr-review",
          message: "Your PR needs attention",
          time: "3 hours ago",
          unread: true
        }
      ]
    },
    performance: {
      commitFrequency: [12, 15, 8, 20, 16, 14, 18],
      codeQuality: 94,
      buildSuccess: 98,
      deployments: {
        successful: 45,
        failed: 2,
        total: 47
      }
    }
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again."
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/developer/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // Profile menu items
  const profileMenuItems: ProfileMenuItem[] = [
    { label: "My Profile", href: "/developer/ProfileDev", icon: User },
    { label: "Settings", href: "/developer/settings", icon: Settings },
    { label: "Earnings", href: "/developer/earnings", icon: CreditCard },
    { label: "Divider", divider: true, icon: null },
    { label: "Sign Out", icon: LogOut, onClick: handleLogout }
  ];

  // Components
  const WelcomeHero = () => {
    return <HeroSection />;
  };

  const QuickStats = () => {
    const stats = [
      { 
        label: "Total Projects", 
        value: "24", 
        change: "+3 this month",
        icon: Code,
        gradient: "from-blue-500/10 to-blue-500/5"
      },
      { 
        label: "Active Deployments", 
        value: "18", 
        change: "95% uptime",
        icon: Cloud,
        gradient: "from-purple-500/10 to-purple-500/5"
      },
      { 
        label: "Team Members", 
        value: "12", 
        change: "+2 pending invites",
        icon: Users,
        gradient: "from-green-500/10 to-green-500/5"
      },
      { 
        label: "API Calls", 
        value: "1.2M", 
        change: "Last 30 days",
        icon: Activity,
        gradient: "from-orange-500/10 to-orange-500/5"
      }
    ];

    const cardVariants = {
      hover: {
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 10
        }
      }
    };

    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover="hover"
                variants={cardVariants}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.gradient} backdrop-blur-sm p-6 shadow-lg`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-700 font-medium">{stat.label}</h3>
                    <stat.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.change}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const PopularRepositories = () => {
    const repoVariants = {
      hover: {
        y: -5,
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      }
    };

    const repos = [
      {
        name: "E-commerce API",
        description: "RESTful API for modern e-commerce platforms with advanced caching and security features.",
        status: { label: "Active", color: "green" },
        stats: { stars: 128, forks: 24 },
        lastUpdate: "2h ago",
        gradient: "from-blue-500/5 to-blue-500/10"
      },
      {
        name: "Analytics Dashboard",
        description: "Real-time analytics dashboard with customizable widgets and data visualization.",
        status: { label: "Featured", color: "purple" },
        stats: { stars: 256, forks: 42 },
        lastUpdate: "1d ago",
        gradient: "from-purple-500/5 to-purple-500/10"
      },
      {
        name: "ML Pipeline",
        description: "Automated machine learning pipeline for data preprocessing and model training.",
        status: { label: "Beta", color: "orange" },
        stats: { stars: 96, forks: 18 },
        lastUpdate: "3d ago",
        gradient: "from-orange-500/5 to-orange-500/10"
      }
    ];

    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Popular Repositories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, index) => (
              <motion.div
                key={repo.name}
                variants={repoVariants}
                whileHover="hover"
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${repo.gradient} backdrop-blur-sm p-6 shadow-lg border border-white/20`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{repo.name}</h3>
                    <span className={`px-2 py-1 text-xs bg-${repo.status.color}-100 text-${repo.status.color}-700 rounded-full`}>
                      {repo.status.label}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {repo.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="flex items-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        <span>{repo.stats.stars}</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <GitBranch className="w-4 h-4 mr-1" />
                        <span>{repo.stats.forks}</span>
                      </motion.div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      <span>Updated {repo.lastUpdate}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const RecentActivity = () => {
    const activityVariants = {
      hover: {
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      }
    };

    const activities = [
      {
        type: "merge",
        icon: GitBranch,
        iconBg: "green",
        title: "Merged pull request #123",
        description: "Add authentication middleware and JWT token validation",
        time: "2 hours ago"
      },
      {
        type: "star",
        icon: Star,
        iconBg: "purple",
        title: "New repository star Analytics Dashboard",
        description: "Your repository was starred by Sarah Chen",
        time: "4 hours ago"
      },
      {
        type: "commit",
        icon: Code,
        iconBg: "blue",
        title: "New commit to E-commerce API",
        description: "Update API documentation and add new endpoints",
        time: "6 hours ago"
      },
      {
        type: "comment",
        icon: MessageSquare,
        iconBg: "orange",
        title: "New comment on ML Pipeline",
        description: "Great work on the preprocessing pipeline! Can we add support for...",
        time: "8 hours ago"
      }
    ];

    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.type + index}
                variants={activityVariants}
                whileHover="hover"
                className="relative overflow-hidden rounded-xl bg-white p-4 shadow-lg border border-gray-100"
              >
                <div className="relative z-10 flex items-start space-x-4">
                  <motion.div 
                    className={`p-2 bg-${activity.iconBg}-100 rounded-lg`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <activity.icon className={`w-5 h-5 text-${activity.iconBg}-600`} />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "sticky top-0 w-full backdrop-blur-md border-b z-50 transition-all duration-200",
          isScrolled ? "bg-white/90 border-gray-200 shadow-sm" : "bg-transparent border-transparent"
        )}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation Links */}
            <div className="flex items-center space-x-8">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="focus:outline-none"
              >
                <img 
                  src="/lovable-uploads/34eef80b-db30-4981-aa71-f838c66de8dd.png" 
                  alt="RepoMarket Logo" 
                  className="w-16 h-16"
                />
              </motion.a>

              <div className="hidden lg:flex items-center space-x-6">
                {[
                  { path: "dashboard", href: "/developer/dashboard", label: "Overview", icon: Activity },
                  { path: "opportunities", href: "/developer/opportunities", label: "Opportunities", icon: Timer },
                  { path: "projects", href: "/developer/projects", label: "Projects", icon: Package },
                  { path: "analytics", href: "/developer/analytics", label: "Analytics", icon: TrendingUp },
                  { path: "news", href: "/developer/news", label: "News", icon: Newspaper }
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                      window.location.pathname === item.path && "text-blue-600"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search repositories..." 
                  className="pl-10 pr-4 py-2 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all duration-300 hover:bg-gray-100"
                />
              </form>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {dashboardData.activity.notifications.some(n => n.unread) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>

              <Button 
                onClick={() => navigate("/developer/projects/new")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <GitBranch className="w-4 h-4 mr-2" />
                New Project
              </Button>

              {/* Profile Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    showProfileMenu ? "rotate-180" : ""
                  )} />
                </Button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      {profileMenuItems.map((item, index) => (
                        item.divider ? (
                          <div key={index} className="my-2 border-b border-gray-100" />
                        ) : (
                          <button
                            key={index}
                            onClick={() => {
                              setShowProfileMenu(false);
                              if (item.onClick) {
                                item.onClick();
                              } else if (item.href) {
                                navigate(item.href);
                              }
                            }}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        )
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
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

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        <WelcomeHero />
        <QuickStats />
        <PopularRepositories />
        <RecentActivity />
      </motion.main>

      <FooterSection />
    </div>
  );
};

export default DeveloperDashboard;