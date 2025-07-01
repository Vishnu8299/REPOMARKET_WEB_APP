import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GitBranch, Search, Filter,
  Plus, Star, Eye, Lock,
  Calendar, Users, ArrowRight
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

  // Enhanced loading animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <div className="text-2xl text-blue-700 font-semibold animate-pulse">
            {isRetrying ? 'Retrying...' : 'Loading your projects...'}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center gap-4">
        <div className="text-2xl text-red-600 font-semibold">{error}</div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2 drop-shadow">
              Your Projects
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and collaborate on your development projects
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="shadow-lg"
          >
            <Button
              onClick={() => navigate("/developer/projects/new")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-7 py-3 rounded-xl font-semibold text-lg shadow transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </Button>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-6 mb-12">
          <div className="relative flex-1">
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
            <SelectTrigger className="w-[200px] h-12 text-lg rounded-xl border-blue-200 bg-white shadow">
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <motion.div
                key={`${project.id}-${project.name}`}
                variants={cardVariants}
                whileHover="hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={twMerge(
                  "group relative overflow-hidden rounded-2xl bg-white p-7 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 cursor-pointer",
                  project.isActive ? "hover:border-green-400" : "hover:border-gray-300"
                )}
                onClick={() => handleProjectClick(project)}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-blue-700 truncate">{project.name}</h3>
                    <Eye className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-gray-600 text-base mb-4 line-clamp-3">
                    {project.description || 'No description provided'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{project.organization}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {project.isActive ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold">
                        <Star className="w-3 h-3 mr-1" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-xs font-semibold">
                        <Lock className="w-3 h-3 mr-1" /> Completed
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-300" />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
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

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-4">
            Recent Activity
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Days Active: {streakDays}
            </span>
            <select
              className="ml-4 border rounded px-2 py-1 text-sm"
              value={activityFilter}
              onChange={e => setActivityFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="CREATED_PROJECT">Created Project</option>
              <option value="EDITED_PROJECT">Edited Project</option>
              <option value="UPLOADED_FILE">Uploaded File</option>
              <option value="COMMENTED">Commented</option>
            </select>
          </h2>
          <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
            {filteredActivities.length === 0 ? (
              <div className="text-gray-400">No recent activity</div>
            ) : (
              <ul className="divide-y divide-blue-50">
                {filteredActivities.slice(0, 7).map((activity) => (
                  <li key={activity.id} className="py-2 flex items-center gap-4">
                    <span className="text-blue-700 font-semibold">{activity.action.replace(/_/g, " ")}</span>
                    <span className="text-gray-600">{activity.description}</span>
                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;