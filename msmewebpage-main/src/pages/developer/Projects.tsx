import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GitBranch, Search, Filter,
  Plus, Star, Eye, Lock,
  Calendar, Users, ArrowRight, AlertTriangle, Loader2, CheckCircle, Edit3, UploadCloud, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { twMerge } from "tailwind-merge";

interface Project {
  id: string;  // Changed from _id to id to match backend
  email: string;
  name: string;
  description: string;
  organization: string;
  isActive: boolean;
  createdAt: string;
}

interface ApiResponse<T> {
  timestamp: string;
  status: number;
  success: boolean;
  message: string;
  data: T;
}

interface UserActivity {
  id: string;
  userId: string;
  projectId: string;
  action: string;
  description: string;
  timestamp: string;
}

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [streakDays, setStreakDays] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const MAX_RETRIES = 3;

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setIsRetrying(true);
    fetchProjects();
  };

  const API_BASE_URL = 'http://localhost:8081/api/projects';

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching with token:', token);

      const response = await fetch(`${API_BASE_URL}/developer/${user.email}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${responseText}`);
      }

      const apiResponse: ApiResponse<Project[]> = JSON.parse(responseText);

      if (apiResponse.success && Array.isArray(apiResponse.data)) {
        setProjects(apiResponse.data);
      } else {
        setProjects([]);
        console.warn('Received invalid data format:', apiResponse);
      }

      setLoading(false);
      setIsRetrying(false);
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching projects:', error);
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          handleRetry();
        }, Math.min(1000 * Math.pow(2, retryCount), 10000));
      } else {
        setError(error.message || 'Failed to connect to the server.');
        setLoading(false);
        setIsRetrying(false);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Fetch recent activities for the user
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8081/api/activities/user/${user?.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return;
        const data = await response.json();
        if (data && data.data) {
          data.data.subscribe && typeof data.data.subscribe === "function"
            ? data.data.subscribe((activity: UserActivity) => setActivities(prev => [...prev, activity]))
            : setActivities(data.data);
        }
      } catch {}
    };
    if (user?.id) fetchActivities();
  }, [user?.id]);

  // Fetch streaks and filter activities
  useEffect(() => {
    const fetchStreaks = async () => {
      if (!user?.id) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8081/api/activities/user/${user.id}/streaks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return;
        const data = await response.json();
        if (data && data.data) {
          // Calculate unique days with activity
          const days = new Set(
            (data.data as UserActivity[]).map(a =>
              new Date(a.timestamp).toLocaleDateString()
            )
          );
          setStreakDays(days.size);
        }
      } catch {}
    };
    fetchStreaks();
  }, [user?.id, activities]);

  const cardVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 12
      }
    }
  };

  // Add search and filter functionality
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'active' && project.isActive) ||
                         (filter === 'completed' && !project.isActive);
    return matchesSearch && matchesFilter;
  });

  // Fix: Always ensure activities and filteredActivities are arrays
  const filteredActivities: UserActivity[] = Array.isArray(activities)
    ? (activityFilter === "all"
        ? activities
        : activities.filter(a => a.action === activityFilter))
    : [];

  const activityIcons: Record<string, JSX.Element> = {
    CREATED_PROJECT: <CheckCircle className="w-5 h-5 text-green-500" />, // Created
    EDITED_PROJECT: <Edit3 className="w-5 h-5 text-blue-500" />, // Edited
    UPLOADED_FILE: <UploadCloud className="w-5 h-5 text-purple-500" />, // Uploaded
    COMMENTED: <MessageCircle className="w-5 h-5 text-yellow-500" />, // Commented
  };

  // Custom style for bold select option
  const boldOptionStyle = { fontWeight: 600 };

  // Pastel color palette for cards
  const pastelColors = [
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-teal-100',
  ];

  // Enhanced loading animation
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="animate-spin text-blue-500 w-12 h-12 mb-2" />
          <div className="text-2xl text-blue-700 font-semibold animate-pulse">
            {isRetrying ? 'Retrying...' : 'Loading your projects...'}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 gap-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <AlertTriangle className="w-12 h-12 text-red-500 mb-2" />
          <div className="text-2xl text-red-600 font-semibold">{error}</div>
        </motion.div>
        <Button
          onClick={handleRetry}
          disabled={isRetrying}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium text-lg shadow"
        >
          {isRetrying ? 'Retrying...' : 'Retry'}
        </Button>
      </div>
    );
  }

  const handleProjectClick = (project: Project) => {
    if (!project.id) {
      console.error('Invalid project ID:', project);
      return;
    }
    navigate(`/developer/projects/${project.id}`, { state: { project } });
  };

  return (
    <div
      className="min-h-screen py-0 relative"
      style={{
        backgroundImage: `url('/lovable-uploads/twilight-cloud.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 via-white/80 to-purple-100/80 pointer-events-none z-0" />
      {/* Hero Header */}
      <div className="relative overflow-hidden pb-10 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-white/0 to-purple-200/40 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl pt-16 pb-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-600 mb-3 drop-shadow-lg">
              Your Projects
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-xl">
              Manage and collaborate on your development projects with ease and clarity.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="z-10"
          >
            <Button
              onClick={() => navigate("/developer/projects/new")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl transition-all duration-200 flex items-center gap-2"
              size="lg"
            >
              <Plus className="w-6 h-6" />
              New Project
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-50/80 via-white/80 to-purple-50/80 backdrop-blur-md py-4 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col sm:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
            <Input
              type="search"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-full h-12 text-lg rounded-xl border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px] h-12 text-lg rounded-xl border-blue-200 bg-white shadow flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 max-w-7xl mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, idx) => {
              const cardColor = pastelColors[idx % pastelColors.length];
              return (
                <motion.div
                  key={`${project.id}-${project.name}`}
                  variants={cardVariants}
                  whileHover="hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={twMerge(
                    `group relative overflow-hidden rounded-2xl ${cardColor} p-7 shadow-lg border border-blue-100 transition-all duration-300 cursor-pointer flex flex-col min-h-[220px]`,
                    project.isActive ? "hover:border-green-400" : "hover:border-gray-300"
                  )}
                  onClick={() => handleProjectClick(project)}
                  tabIndex={0}
                  aria-label={`View project ${project.name}`}
                  role="button"
                >
                  {/* Title */}
                  <div className="mb-2">
                    <h3 className="font-extrabold text-2xl text-blue-900 mb-1 truncate">{project.name}</h3>
                  </div>
                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-gray-700 text-base leading-snug line-clamp-3">{project.description || 'No description provided'}</p>
                  </div>
                  {/* Status and Date Row */}
                  <div className="flex items-center justify-between mt-auto">
                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {project.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-200 text-green-800 text-sm font-semibold">
                          <Star className="w-4 h-4 mr-1" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-sm font-semibold">
                          <Lock className="w-4 h-4 mr-1" /> Completed
                        </span>
                      )}
                    </div>
                    {/* Date and Arrow */}
                    <div className="flex flex-col items-end">
                      <span className="flex items-center text-gray-600 text-sm font-medium">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <span className="mt-2">
                        <ArrowRight className="w-7 h-7 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="text-gray-400 text-2xl mb-4 font-semibold">No projects found</div>
              <Button
                onClick={() => navigate("/developer/projects/new")}
                variant="outline"
                className="hover:text-blue-600 border-blue-200"
              >
                Create your first project
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="container mx-auto px-4 max-w-7xl mt-16 mb-10">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-blue-900 drop-shadow flex items-center gap-3">
              Recent Activity
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full ml-2 font-semibold">
                Days Active: {streakDays}
              </span>
            </h2>
            <select
              className="ml-4 border rounded px-3 py-2 text-base font-medium focus:ring-2 focus:ring-blue-200 bg-white shadow"
              value={activityFilter}
              onChange={e => setActivityFilter(e.target.value)}
            >
              <option value="all" style={boldOptionStyle}>All</option>
              <option value="CREATED_PROJECT">Created Project</option>
              <option value="EDITED_PROJECT">Edited Project</option>
              <option value="UPLOADED_FILE">Uploaded File</option>
              <option value="COMMENTED">Commented</option>
            </select>
          </div>
          <div className="rounded-3xl shadow-2xl border border-blue-200 bg-gradient-to-br from-white/95 via-blue-50/90 to-purple-50/90 p-10 min-h-[140px] flex flex-col justify-center">
            {filteredActivities.length === 0 ? (
              <div className="text-gray-400 text-center font-extrabold text-xl tracking-wide">No recent activity</div>
            ) : (
              <ol className="relative border-l-2 border-blue-100 ml-2">
                {filteredActivities.slice(0, 7).map((activity, idx) => (
                  <li key={activity.id} className="mb-8 ml-6 flex items-start gap-4 group">
                    <span className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-white border-2 border-blue-200 rounded-full shadow group-hover:border-blue-400 transition-all">
                      {activityIcons[activity.action] || <GitBranch className="w-5 h-5 text-gray-400" />}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-700 text-base">{activity.action.replace(/_/g, " ")}</span>
                        <span className="text-xs text-gray-400 font-semibold">{new Date(activity.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="text-gray-700 text-sm mt-1 font-medium">{activity.description}</div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;