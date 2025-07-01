import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useState } from "react";

interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "RepoMarket has transformed how we manage our open-source projects. The collaboration features are simply outstanding!",
    author: "Sarah Johnson",
    role: "Lead Developer",
    company: "TechCorp",
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    content: "The platform's intuitive interface and powerful search capabilities have made finding and sharing code so much easier.",
    author: "Michael Chen",
    role: "Software Architect",
    company: "InnovateX",
    image: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    content: "As a startup, we love how RepoMarket helps us discover and collaborate with other developers. It's been invaluable!",
    author: "Emily Rodriguez",
    role: "CTO",
    company: "StartupHub",
    image: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    id: 4,
    content: "The code quality tools and security features give us confidence in the repositories we use. Absolutely recommended!",
    author: "David Kim",
    role: "Security Engineer",
    company: "SecureFlow",
    image: "https://randomuser.me/api/portraits/men/4.jpg"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

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
    <section className="relative py-20 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 backdrop-blur-md"
        style={{
          backgroundImage: "url('/lovable-uploads/davies-designs-studio-f5_lfi2S-d4-unsplash.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
          filter: 'blur(12px)',
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-7xl mx-auto bg-white/30 backdrop-blur-sm p-8 rounded-2xl"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of developers who trust RepoMarket for their project needs
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 relative"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.author}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <a
              href="#"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Read more testimonials
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
