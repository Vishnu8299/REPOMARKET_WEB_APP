import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      navigate("/home");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full fixed top-0 left-0" style={{ backgroundImage: "linear-gradient(-225deg, #7DE2FC 0%, #B9B6E5 100%)", height: "100vh", width: "100vw" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.img
          src="/lovable-uploads/34eef80b-db30-4981-aa71-f838c66de8dd.png"
          alt="Repo Market Logo"
          className="w-48 h-48 mx-auto mb-8"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-1 bg-blue-500 rounded-full w-48 mx-auto mt-4"
        />
      </motion.div>
    </div>
  );
};

export default SplashScreen;
