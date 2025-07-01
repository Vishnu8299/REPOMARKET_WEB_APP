import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Search, 
  History, 
  Users, 
  Shield, 
  Zap, 
  Code2,
  MessageSquare,
  Star,
  Download,
  Share2,
  Boxes,
  Settings
} from "lucide-react";

interface FeatureStats {
  label: string;
  value: number;
  increment: number;
  suffix?: string;
}

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
  color: string;
  category: string;
  stats?: FeatureStats;
  badge?: string;
  highlight?: boolean;
  details?: string;
}

const features: Feature[] = [
  {
    icon: <Search className="w-7 h-7" />,
    title: "Smart Discovery",
    description: "Find the perfect projects with our advanced search and filtering system.",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    category: "Development",
    stats: { 
      label: "Active Searches", 
      value: 1000,
      increment: 5,
      suffix: "K+"
    },
    badge: "Popular",
    highlight: true,
    details: "Powerful AI-driven search capabilities"
  },
  {
    icon: <History className="w-6 h-6" />,
    title: "Version History",
    description: "Track changes and manage different versions of your projects seamlessly.",
    color: "bg-purple-500",
    category: "Development",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team Collaboration",
    description: "Work together efficiently with built-in collaboration tools and features.",
    color: "bg-green-500",
    category: "Collaboration",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Security First",
    description: "Enterprise-grade security with automated vulnerability scanning.",
    color: "bg-red-500",
    category: "Security",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Fast Performance",
    description: "Lightning-fast project operations and downloads.",
    color: "bg-yellow-500",
    category: "Development",
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Code Quality",
    description: "Built-in code quality tools and automated code reviews.",
    color: "bg-indigo-500",
    category: "Development",
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: "Easy Sharing",
    description: "Share your projects with the community or keep them private.",
    color: "bg-pink-500",
    category: "Collaboration",
  },
  {
    icon: <Boxes className="w-6 h-6" />,
    title: "Project Templates",
    description: "Start quickly with customizable project templates and boilerplates.",
    color: "bg-orange-500",
    category: "Development",
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "Custom Workflows",
    description: "Create and customize your development workflows easily.",
    color: "bg-teal-500",
    category: "Development",
  },
];

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
      delay: i * 0.2
    }
  })
};

const FeaturesSection = () => {
  const [selectedTab, setSelectedTab] = useState("All");

  return (
    <section className="relative py-20">
      <div 
        className="absolute inset-0 z-0 backdrop-blur-md"
        style={{
          backgroundImage: "url('/lovable-uploads/twilight-cloud.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.6,
          filter: 'blur(8px)',
        }}
      />
      <div className="relative z-10 bg-white/30 backdrop-blur-sm rounded-lg"> {/* Removed mx-4 */}
        {/* Title Section */}
        <div className="text-center py-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Our Powerful Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-gray-700 max-w-2xl mx-auto"
          >
            Everything you need to build and manage your projects effectively
          </motion.p>
        </div>

        {/* Category Buttons */}
        <div className="flex gap-4 justify-center mb-12">
          {["All", "Development", "Security", "Collaboration"].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === tab 
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {features
            .filter(f => selectedTab === "All" || f.category === selectedTab)
            .map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                initial="offscreen"
                whileInView="onscreen"
                custom={index}
                viewport={{ once: true, amount: 0.3 }}
                className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                
                {feature.stats && (
                  <div className="mt-4 text-blue-600 font-medium">
                    {feature.stats.label}: {feature.stats.value}{feature.stats.suffix}
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;