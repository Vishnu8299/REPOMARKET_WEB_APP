import { motion } from "framer-motion";
import { Calendar, Users, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Hackathon {
  id: number;
  title: string;
  description: string;
  date: string;
  participants: number;
  prizePool: string;
  image: string;
  status: "upcoming" | "ongoing" | "completed";
}

const hackathons: Hackathon[] = [
  {
    id: 1,
    title: "AI Innovation Challenge",
    description: "Build the next generation of AI-powered applications",
    date: "March 15-17, 2024",
    participants: 500,
    prizePool: "$10,000",
    image: "https://www.dell.com/wp-uploads/2024/05/AI-factory-innovation-advancements-1280x800-1.jpg",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Web3 DeFi Hackathon",
    description: "Create innovative decentralized finance solutions",
    date: "April 1-3, 2024",
    participants: 300,
    prizePool: "$15,000",
    image: "https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/002/012/945/datas/original.png",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Sustainable Tech Challenge",
    description: "Develop solutions for environmental sustainability",
    date: "May 5-7, 2024",
    participants: 400,
    prizePool: "$12,000",
    image: "https://media.licdn.com/dms/image/v2/D4E12AQE4OfXEicARiQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1699381120737?e=2147483647&v=beta&t=fs_qnul5lIvJrhr2JAEd4upcyHxqdZNUge3ipnqEPxM",
    status: "upcoming"
  }
];

const Hackathons = () => {
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

  const getStatusColor = (status: Hackathon["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-600";
      case "ongoing":
        return "bg-green-100 text-green-600";
      case "completed":
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <section id="hackathons" className="relative py-20 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 backdrop-blur-md"
        style={{
          backgroundImage: "url('/lovable-uploads/clouds-sky.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
          filter: 'blur(12px)',
        }}
      />
      <div className="w-full px-4 relative z-10"> {/* Removed container mx-auto */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-7xl mx-auto bg-white/30 backdrop-blur-sm p-8 rounded-2xl"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
              Competitions
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
              Join Exciting Hackathons
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Participate in our hackathons to showcase your skills, win prizes, and connect with other developers
            </p>
          </motion.div>

          {/* Hackathons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hackathons.map((hackathon) => (
              <motion.div
                key={hackathon.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Card Image */}
                <div className="relative h-48 rounded-t-xl overflow-hidden">
                  <img
                    src={hackathon.image}
                    alt={hackathon.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(hackathon.status)}`}>
                      {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {hackathon.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {hackathon.description}
                  </p>

                  {/* Hackathon Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>{hackathon.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-2" />
                      <span>{hackathon.participants} participants</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Trophy className="w-5 h-5 mr-2" />
                      <span>Prize Pool: {hackathon.prizePool}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full" variant="outline">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <Button size="lg" variant="default">
              View All Hackathons
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hackathons;
