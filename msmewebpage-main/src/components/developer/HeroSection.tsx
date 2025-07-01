import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Sparkles, Code2, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(true);

  // Parallax effect for background shapes
  const rightBlobY = useTransform(scrollY, [0, 500], [0, 200]);
  const leftBlobY = useTransform(scrollY, [0, 500], [0, -200]);
  
  // Animated text options
  const headlines = [
    "Discover Amazing Projects",
    "Share Your Code",
    "Collaborate with Developers",
    "Build the Future"
  ];
  const [currentHeadline, setCurrentHeadline] = useState(0);

  // Auto-updating stats
  const [stats, setStats] = useState({
    users: 10000,
    repos: 5000,
    downloads: 1000000
  });

  useEffect(() => {
    // Headline rotation
    const headlineInterval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 3000);

    // Simulated real-time stats updates
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        users: prev.users + Math.floor(Math.random() * 10),
        repos: prev.repos + Math.floor(Math.random() * 5),
        downloads: prev.downloads + Math.floor(Math.random() * 1000)
      }));
    }, 5000);

    // Cleanup
    return () => {
      clearInterval(headlineInterval);
      clearInterval(statsInterval);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K+';
    return num + '+';
  };

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center pt-20 pb-16">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>
      
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: rightBlobY }}
          className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px]"
        >
          <div className="w-full h-full bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        </motion.div>
        <motion.div
          style={{ y: leftBlobY }}
          className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px]"
        >
          <div className="w-full h-full bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </motion.div>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px]">
          <div className="w-full h-full bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
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
              {headlines[currentHeadline]}
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
          
          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 animate-bounce-x" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/explore")}
              className="w-full sm:w-auto group hover:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative w-full h-24 text-white/50"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-current"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
