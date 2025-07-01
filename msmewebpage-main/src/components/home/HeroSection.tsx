import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Sparkles, Code2, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// Add this interface near the top of the file
interface MousePosition {
  x: number;
  y: number;
  rotation?: number;
}

const HeroSection = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(true);

  // Enhanced parallax effects with smoother transitions
  const rightBlobY = useTransform(scrollY, [0, 500], [0, 200]);
  const leftBlobY = useTransform(scrollY, [0, 500], [0, -200]);
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const bgScale = useTransform(scrollY, [0, 500], [1.2, 1]);
  const bgBlur = useTransform(scrollY, [0, 300], [0, 8]);
  
  // Dynamic gradient colors based on scroll
  const gradientOpacity = useTransform(scrollY, [0, 300], [0.8, 0.95]);
  const backgroundRef = useRef(null);
  const contentRef = useRef(null);
  const isInView = useInView(contentRef, { once: false });

  // Improved headline rotation with more engaging content
  const headlines = [
    { text: "Discover Amazing Projects", icon: null },
    { text: "Share Your Code", icon: null },
    { text: "Collaborate with Developers", icon: null },
    { text: "Build the Future", icon: null },
    { text: "Join Our Community", icon: null }
  ];
  const [currentHeadline, setCurrentHeadline] = useState(0);

  // Auto-updating stats
  const [stats, setStats] = useState({
    users: 10000,
    repos: 5000,
    downloads: 1000000
  });

  useEffect(() => {
    // Enhanced headline rotation with smoother transitions
    const headlineInterval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 4000);

    // Progressive stats loading
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        users: Math.min(prev.users + Math.floor(Math.random() * 15), 15000),
        repos: Math.min(prev.repos + Math.floor(Math.random() * 8), 8000),
        downloads: Math.min(prev.downloads + Math.floor(Math.random() * 2000), 1500000)
      }));
    }, 3000);

    // Cleanup
    return () => {
      clearInterval(headlineInterval);
      clearInterval(statsInterval);
    };
  }, []);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Smoother transitions for elements
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K+';
    return num + '+';
  };

  // Dynamic color transitions
  const [bgColor, setBgColor] = useState("from-blue-500/30");
  useEffect(() => {
    const colors = [
      "from-blue-500/30",
      "from-purple-500/30",
      "from-indigo-500/30"
    ];
    const interval = setInterval(() => {
      setBgColor(colors[Math.floor(Math.random() * colors.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mouse parallax effect
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0, rotation: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const moveX = clientX - window.innerWidth / 2;
    const moveY = clientY - window.innerHeight / 2;
    const offsetFactor = 0.02;

    setMousePosition({
      x: moveX * offsetFactor,
      y: moveY * offsetFactor,
      rotation: (moveX * offsetFactor) / 2,
    });
  };

  // Smooth spring animations
  const springConfig = { stiffness: 100, damping: 30 };
  const smoothY = useSpring(bgY, springConfig);
  const smoothScale = useSpring(bgScale, springConfig);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Add haptic feedback for touch devices
  const handleButtonClick = (route: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    navigate(route);
  };

  return (
    <section 
      className="relative overflow-hidden min-h-screen flex items-center pt-20 pb-16"
      onMouseMove={handleMouseMove}
      role="main"
      aria-label="Welcome to RepoMarket"
    >
      {/* Enhanced Background with Mouse Parallax */}
      <motion.div 
        style={{ 
          scale: smoothScale,
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        className="absolute inset-0 transition-all duration-700"
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: isLoading ? 0 : 1 
          }}
          transition={{ duration: 1.5 }}
          style={{ backgroundImage: "url('/lovable-uploads/clouds.jpg')" }}
        />
      </motion.div>

      {/* Dynamic Gradient */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${bgColor} via-white/40 to-purple-500/30 backdrop-blur-sm transition-colors duration-700`}
      />

      {/* Improved Content Container */}
      <motion.div 
        ref={contentRef}
        className="container relative z-10 mx-auto px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: isLoading ? 0 : 1,
          y: isLoading ? 50 : 0
        }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center backdrop-blur-sm bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
          whileHover={{ scale: 1.02 }}
        >
          {/* Animated Badge */}
          <motion.div 
            variants={itemVariants}
            className="mb-6 inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-medium shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <Zap className="w-4 h-4 mr-2 animate-pulse" />
              Welcome to RepoMarket
            </span>
          </motion.div>
          
          {/* Animated Headline */}
          <motion.div
            variants={itemVariants}
            className="relative h-24 md:h-32 mb-6"
          >
            <motion.h1
              key={currentHeadline}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {headlines[currentHeadline].text} {headlines[currentHeadline].icon}
            </motion.h1>
          </motion.div>
          
          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Join our thriving community of developers. Find high-quality repositories, 
            collaborate on exciting projects, and showcase your work to the world.
          </motion.p>
          
          {/* Enhanced CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              onClick={() => handleButtonClick("/signup")}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label="Get Started with RepoMarket"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 animate-bounce-x" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleButtonClick("/explore")}
              className="w-full sm:w-auto group hover:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Explore Projects on RepoMarket"
            >
              <Search className="mr-2 h-5 w-5 text-blue-500 group-hover:rotate-12 transition-transform" />
              Explore Projects
              <Sparkles className="ml-2 h-4 w-4 text-blue-500 group-hover:animate-ping" />
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { icon: Users, label: "Active Users", value: stats.users, color: "blue" },
              { icon: Code2, label: "Repositories", value: stats.repos, color: "purple" },
              { icon: ArrowRight, label: "Downloads", value: stats.downloads, color: "blue" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-500 mb-2`} />
                <motion.span 
                  className={`text-3xl font-bold text-${stat.color}-600`}
                  key={stat.value}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  {formatNumber(stat.value)}
                </motion.span>
                <span className="text-sm text-gray-600">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Loading Overlay */}
      <motion.div
        className="absolute inset-0 bg-white z-50 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={() => setIsLoading(false)}
        style={{ pointerEvents: isLoading ? 'auto' : 'none' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
