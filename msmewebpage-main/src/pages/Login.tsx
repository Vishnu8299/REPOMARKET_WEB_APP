import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowRight, User2, KeyRound, Sparkles, Lock } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types";
import { toast, Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'BUYER' as UserRole
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const controls = useAnimation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    controls.start("visible");
  }, [controls]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await controls.start({
        scale: [1, 0.98, 1],
        transition: { duration: 0.2 }
      });

      const result = await login(formData.email, formData.password, formData.role as UserRole);
      toast.success('Login successful! Redirecting...', {
        icon: '🚀',
        style: {
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          color: 'white',
        }
      });
      
      const userRole = result.user.role.toUpperCase();
      
      await controls.start({
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 }
      });

      switch (userRole) {
        case 'ADMIN':
          navigate('/admin/admin-dashboard');
          break;
        case 'BUYER':
          navigate('/buyer/marketplace');
          break;
        case 'DEVELOPER':
          navigate('/developer/DeveloperDashboard');
          break;
        default:
          navigate('/home');
      }
    } catch (err) {
      console.error('Login failed:', err);
      controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
      });
      toast.error(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const floatingParticles = [...Array(12)].map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 15 + 8,
    delay: Math.random() * 4,
    blur: Math.random() * 2 + 1
  }));

  return (
    <AnimatePresence mode="wait">
      {mounted && (
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden py-6 px-4">
          {/* Enhanced Layered Background */}
          <div className="fixed inset-0">
            <motion.div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              initial={{ scale: 1.1, rotate: -1 }}
              animate={{ 
                scale: [1.1, 1, 1.05],
                rotate: [1, -1, 1]
              }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                repeatType: "reverse", 
                ease: "easeInOut" 
              }}
              style={{ 
                backgroundImage: 'url("/lovable-uploads/clouds.jpg")',
                filter: 'brightness(1.1) contrast(1.15) saturate(1.1)',
                transformOrigin: 'center center'
              }}
            />
            
            {/* Enhanced Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/15 to-pink-500/10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-blue-500/10" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />
            
            {/* Enhanced Animated Particles */}
            {floatingParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  background: `rgba(255, 255, 255, ${0.2 + Math.random() * 0.3})`,
                  backdropFilter: `blur(${particle.blur}px)`,
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-30, 30],
                  x: [-20, 20],
                  scale: [1, 1.2, 1],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Enhanced Light Effects */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-100/10 to-transparent rotate-12 transform-gpu animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-100/5 to-transparent -rotate-12 transform-gpu animate-pulse delay-1000" />
            </div>
          </div>

          {/* Main Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md relative z-10"
          >
            <Card className="backdrop-blur-md bg-white/90 border border-white/20 shadow-2xl shadow-blue-500/10">
              <CardHeader className="relative space-y-6 p-6">
                <motion.div 
                  className="flex justify-center"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }}
                >
                  <div className="relative group">
                    {/* Glow Effects */}
                    <div className="absolute inset-0 scale-150">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-3xl opacity-60 animate-pulse group-hover:opacity-80 transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-2xl opacity-50 animate-pulse delay-100 scale-105" />
                    </div>

                    {/* Logo Container */}
                    <motion.div
                      className="relative bg-white rounded-full p-2"
                      animate={{
                        y: [-5, 5, -5],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -10, 10, 0],
                        transition: {
                          duration: 0.5,
                          ease: "easeInOut"
                        }
                      }}
                      whileTap={{ 
                        scale: 0.9,
                        rotate: 360,
                        transition: { duration: 0.5 }
                      }}
                    >
                      <div className="relative rounded-full overflow-hidden bg-white shadow-2xl">
                        <motion.img
                          src="/lovable-uploads/34eef80b-db30-4981-aa71-f838c66de8dd.png"
                          alt="RepoMarket Logo"
                          className="h-28 w-28 md:h-32 md:w-32 object-contain"
                          animate={{
                            scale: [1, 1.05, 1],
                            filter: [
                              'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))',
                              'drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))',
                              'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
                            ]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Enhanced Shine Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/90 to-white/0"
                          animate={{
                            x: ['-100%', '200%'],
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                          }}
                          style={{
                            transform: 'rotate(-45deg)',
                          }}
                        />
                      </div>

                      {/* Orbital Ring Effect */}
                      <motion.div
                        className="absolute -inset-4 border-2 border-blue-500/20 rounded-full"
                        animate={{
                          rotate: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      
                      {/* Pulsing Rings */}
                      <motion.div
                        className="absolute -inset-2 border-2 border-purple-500/20 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                      
                      {/* Sparkle Effects */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-blue-400 rounded-full"
                          style={{
                            top: `${20 + i * 30}%`,
                            left: `${20 + i * 30}%`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                            x: [0, 10, 0],
                            y: [0, -10, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Welcome Text */}
                <motion.div 
                  variants={itemVariants} 
                  className="space-y-3 text-center"
                >
                  <motion.div
                    className="relative inline-block"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <CardTitle className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                      Welcome Back
                    </CardTitle>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-30 blur-lg -z-10" />
                  </motion.div>
                  <CardDescription className="text-gray-600">
                    Enter your credentials to access your account
                  </CardDescription>
                </motion.div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full group hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300"
                    onClick={() => navigate("/signup")}
                  >
                    <User2 className="mr-2 h-4 w-4 text-blue-500" />
                    Create New Account
                    <ArrowRight className="ml-2 h-4 w-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Or continue with email
                    </span>
                  </div>
                </motion.div>

                <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      Email
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-4 border-gray-200 focus:border-blue-500 transition-colors"
                        required
                      />
                      <motion.div
                        className="absolute inset-0 border border-blue-500/20 rounded-lg pointer-events-none"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 flex items-center">
                      <Lock className="w-4 h-4 mr-2 text-blue-500" />
                      Password
                    </Label>
                    <div className="relative group">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-4 border-gray-200 focus:border-blue-500 transition-colors"
                        required
                      />
                      <motion.div
                        className="absolute inset-0 border border-blue-500/20 rounded-lg pointer-events-none"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-700 flex items-center">
                      <User2 className="w-4 h-4 mr-2 text-blue-500" />
                      Role
                    </Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
                    >
                      <SelectTrigger id="role" className="w-full border-gray-200 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BUYER">Buyer</SelectItem>
                        <SelectItem value="DEVELOPER">Developer</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <LoadingButton 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group transition-all duration-300 transform hover:scale-[1.02]"
                    isLoading={isLoading}
                  >
                    {!isLoading && (
                      <>
                        Sign In
                        <Sparkles className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                      </>
                    )}
                  </LoadingButton>
                </motion.form>
              </CardContent>

              <CardFooter className="p-6 flex flex-col space-y-4 text-center">
                <motion.div variants={itemVariants}>
                  <Button variant="link" className="text-sm text-gray-600 hover:text-blue-600">
                    Forgot your password?
                  </Button>
                </motion.div>
                <motion.p variants={itemVariants} className="text-xs text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </motion.p>
              </CardFooter>
            </Card>
          </motion.div>

          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'bg-white/90 backdrop-blur-sm shadow-lg border border-white/20',
              duration: 3000,
              style: {
                padding: '16px',
              },
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default Login;