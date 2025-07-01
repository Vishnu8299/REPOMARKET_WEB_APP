import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Download, Users, Award, TrendingUp, MessageSquare, Shield, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopRepo {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
    specialization: string[];
  };
  stats: {
    stars: number;
    downloads: number;
    views: number;
    comments: number;
  };
  price: {
    amount: number;
    currency: string;
    discounted?: number;
  };
  language: string;
  technologies: string[];
  lastUpdated: string;
  category: string;
  badges: string[];
  status: 'live' | 'maintenance' | 'deprecated';
  thumbnail?: string;
  demo_url?: string;
  features: string[];
  rating: {
    average: number;
    count: number;
    distribution: number[];
  };
  support: {
    type: 'basic' | 'premium' | 'enterprise';
    includes: string[];
  };
  lastUpdate: {
    date: string;
    changes: string[];
  };
}

interface TopDeveloper {
  id: string;
  name: string;
  avatar: string;
  role: string[];
  stats: {
    rating: number;
    completedProjects: number;
    responseRate: number;
    satisfactionRate: number;
  };
  badges: {
    name: string;
    icon: string;
    color: string;
  }[];
  availability: 'available' | 'busy' | 'away';
  location: string;
  languages: string[];
  hourlyRate: number;
}

const NewRepo = () => {
  const { scrollYProgress } = useScroll();
  
  const fadeUpVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const topRepos: TopRepo[] = [
    {
      id: "1",
      title: "E-Commerce Platform Pro",
      description: "Complete e-commerce solution with advanced features",
      author: {
        name: "Alex Johnson",
        avatar: "/avatars/alex.png",
        rating: 4.9,
        verified: true,
        specialization: ["Full Stack", "E-commerce"]
      },
      stats: {
        stars: 1200,
        downloads: 5000,
        views: 15000,
        comments: 230
      },
      price: {
        amount: 299,
        currency: "USD",
        discounted: 249
      },
      language: "JavaScript",
      technologies: ["React", "Node.js", "MongoDB"],
      lastUpdated: "2024-02-15",
      category: "E-commerce",
      badges: ["Trending", "Top Rated", "Best Seller"],
      status: "live",
      thumbnail: "/thumbnails/ecommerce-platform.jpg",
      demo_url: "https://demo.ecommerce-platform.com",
      features: ["Responsive Design", "Admin Dashboard", "Product Management"],
      rating: {
        average: 4.8,
        count: 350,
        distribution: [150, 100, 50, 30, 20]
      },
      support: {
        type: "premium",
        includes: ["24/7 Support", "Priority Response", "Dedicated Account Manager"]
      },
      lastUpdate: {
        date: "2024-02-15",
        changes: ["Added new payment methods", "Improved performance", "Fixed bugs"]
      }
    },
    // Add more repos...
  ];

  const topDevelopers: TopDeveloper[] = [
    {
      id: "1",
      name: "Sarah Smith",
      avatar: "/avatars/sarah.png",
      role: ["Full Stack Developer", "UI/UX Designer"],
      stats: {
        rating: 4.9,
        completedProjects: 85,
        responseRate: 98,
        satisfactionRate: 95
      },
      badges: [
        { name: "Top Developer", icon: "star", color: "gold" },
        { name: "React Expert", icon: "react", color: "blue" }
      ],
      availability: "available",
      location: "San Francisco, CA",
      languages: ["English", "Spanish"],
      hourlyRate: 75
    },
    // Add more developers...
  ];

  return (
    <div className="relative">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/lovable-uploads/clouds-sky.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) brightness(1.1)",
          transform: "scale(1.1)"
        }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto p-6 space-y-12">
          {/* Top Repositories Section */}
          <section>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Featured Repositories
                  </span>
                </h2>
                <p className="text-gray-600 mt-2">Discover top-rated solutions from verified developers</p>
              </div>
              <Button variant="outline" className="hover:bg-blue-50 transition-colors">
                Browse All
              </Button>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topRepos.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  {repo.thumbnail && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={repo.thumbnail} 
                        alt={repo.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                        <span className="text-sm font-medium">{repo.category}</span>
                        {repo.status === 'live' && (
                          <span className="flex items-center gap-1 text-xs bg-green-500/80 px-2 py-1 rounded-full">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                          {repo.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{repo.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {repo.technologies.map(tech => (
                        <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {repo.stats.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {repo.stats.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {repo.stats.comments}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <img src={repo.author.avatar} alt="" className="w-8 h-8 rounded-full" />
                          {repo.author.verified && (
                            <Shield className="w-4 h-4 text-blue-500 absolute -bottom-1 -right-1" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{repo.author.name}</p>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3 text-yellow-400" />
                            {repo.author.rating}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {repo.price.discounted ? (
                          <>
                            <p className="text-sm text-gray-500 line-through">${repo.price.amount}</p>
                            <p className="font-bold text-green-600">${repo.price.discounted}</p>
                          </>
                        ) : (
                          <p className="font-bold">${repo.price.amount}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Top Developers Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Award className="w-6 h-6 text-purple-600" />
                Top Developers
              </h2>
              <Button variant="outline">View All</Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topDevelopers.map(dev => (
                <motion.div
                  key={dev.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 text-center"
                >
                  <img 
                    src={dev.avatar} 
                    alt={dev.name} 
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-semibold">{dev.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{dev.role.join(", ")}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {dev.stats.rating}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Projects</span>
                      <span className="font-medium">{dev.stats.completedProjects}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Response</span>
                      <span className="font-medium">{dev.stats.responseRate}%</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Contact</Button>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default NewRepo;
