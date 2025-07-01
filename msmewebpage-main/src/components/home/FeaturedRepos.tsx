import { motion } from "framer-motion";
import { Star, Share2, Eye, ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  id: number;
  title: string;
  description: string;
  author: string;
  authorImage: string;
  language: string;
  languageColor: string;
  stars: number;
  shares: number;
  views: number;
  tags: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "AI-Powered Analytics",
    description: "A powerful analytics platform using machine learning to provide insights from your data.",
    author: "TechLabs",
    authorImage: "https://randomuser.me/api/portraits/men/1.jpg",
    language: "Python",
    languageColor: "bg-yellow-400",
    stars: 1200,
    shares: 300,
    views: 150,
    tags: ["machine-learning", "analytics", "python"]
  },
  {
    id: 2,
    title: "React Component Library",
    description: "A modern, accessible React component library with beautiful designs.",
    author: "UIMasters",
    authorImage: "https://randomuser.me/api/portraits/women/2.jpg",
    language: "TypeScript",
    languageColor: "bg-blue-400",
    stars: 850,
    shares: 200,
    views: 90,
    tags: ["react", "ui", "components"]
  },
  {
    id: 3,
    title: "Blockchain Explorer",
    description: "An open-source blockchain explorer with support for multiple networks.",
    author: "CryptoDevs",
    authorImage: "https://randomuser.me/api/portraits/men/3.jpg",
    language: "Rust",
    languageColor: "bg-orange-400",
    stars: 2000,
    shares: 400,
    views: 180,
    tags: ["blockchain", "explorer", "rust"]
  },
  {
    id: 4,
    title: "Cloud Infrastructure Tools",
    description: "A collection of tools for managing cloud infrastructure and deployments.",
    author: "CloudOps",
    authorImage: "https://randomuser.me/api/portraits/women/4.jpg",
    language: "Go",
    languageColor: "bg-cyan-400",
    stars: 1500,
    shares: 250,
    views: 120,
    tags: ["cloud", "infrastructure", "devops"]
  }
];

const FeaturedRepos = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      },
    },
  };

  return (
    <section id="FeaturedRepos" className="relative py-20 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 backdrop-blur-md"
        style={{
          backgroundImage: "url('/lovable-uploads/image.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
          filter: 'blur(12px)',
        }}
      />
      <div className="w-full px-4 relative z-10">  {/* Removed container mx-auto */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-7xl mx-auto bg-white/30 backdrop-blur-sm p-8 rounded-2xl"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.div
              variants={itemVariants}
              className="inline-block px-4 py-1.5 mb-6 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600"
            >
              Featured Projects
            </motion.div>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Trending Projects
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Discover popular and innovative projects from our community
            </p>
          </motion.div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ 
                  y: -4,
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)"
                }}
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-300 p-6 group"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={project.authorImage}
                      alt={project.author}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by {project.author}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                    <Star className="w-4 h-4 mr-1 text-blue-500" />
                    Star
                  </Button>
                </div>

                {/* Project Description */}
                <p className="text-gray-600 mb-4">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Project Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${project.languageColor} mr-2`} />
                      <span className="text-sm text-gray-600">{project.language}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      <span className="text-sm">{project.stars}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Share2 className="w-4 h-4 mr-1 text-blue-400" />
                      <span className="text-sm">{project.shares}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Eye className="w-4 h-4 mr-1 text-green-400" />
                      <span className="text-sm">{project.views}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View More Button */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group">
              Explore More Projects
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedRepos;
