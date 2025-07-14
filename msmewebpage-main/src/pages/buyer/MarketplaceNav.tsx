import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProjectDetails from "@/pages/buyer/ProjectDetails";

interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  // ...other project fields...
}

interface User {
  id: string;
  name: string;
  email: string;
  // ...other user fields...
}

const MarketplaceNav = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [tool, setTool] = useState("");
  const [year, setYear] = useState("");
  const categories = ["All", "Web", "Mobile", "Data Science", "AI", "DevOps"];
  const tools = ["All", "React", "Angular", "Vue", "Node.js", "Python", "Java"];
  const years = ["All", "2024", "2023", "2022", "2021", "2020"];
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all projects
    axios.get("/api/projects")
      .then(res => {
        // If using ApiResponse wrapper, extract .data.data
        const data = res.data?.data;
        if (Array.isArray(data)) {
          setProjects(data);
        } else if (data && data.content) {
          setProjects(data.content);
        } else {
          setProjects([]);
        }
      })
      .catch(() => setProjects([]));

    // Fetch all users
    axios.get("/api/users")
      .then(res => {
        // If using ApiResponse wrapper, extract .data.data
        const data = res.data?.data;
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && data.content) {
          setUsers(data.content);
        } else {
          setUsers([]);
        }
      })
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredProjects(
      projects.filter(
        p =>
          p.name.toLowerCase().includes(lower) ||
          (p.description && p.description.toLowerCase().includes(lower))
      )
    );
    setFilteredUsers(
      users.filter(
        u =>
          u.name.toLowerCase().includes(lower) ||
          (u.email && u.email.toLowerCase().includes(lower))
      )
    );
  }, [search, projects, users]);

  const cardColors = [
    'bg-blue-100',
    'bg-green-100',
    'bg-pink-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-gray-100',
  ];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-0" />
      <div className="w-full px-4 sm:px-6 py-8 relative z-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Marketplace</h1>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm h-64 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar filter card */}
          <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-shrink-0 sticky top-8">
            {/* Top blue gradient section */}
            <div className="rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 p-6 flex flex-col items-center mb-6">
              <div className="text-white font-bold text-lg mb-4 text-center">Find the projects</div>
              <button className="bg-white text-blue-700 font-semibold rounded-full px-6 py-2 shadow hover:bg-blue-100 transition-colors duration-200">Learn more</button>
            </div>
            {/* Filter form */}
            <form className="flex flex-col gap-4 flex-1">
              <div>
                <label className="block text-sm font-semibold mb-1">Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. React Dashboard"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Tool</label>
                <select
                  value={tool}
                  onChange={e => setTool(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {tools.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Year</label>
                <select
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <button
                type="button"
                className="w-full mt-2 bg-gray-100 text-gray-700 font-semibold rounded-md py-2 hover:bg-gray-200 transition-colors duration-200"
                onClick={() => { setKeyword(""); setCategory(""); setTool(""); setYear(""); }}
              >
                Clear All Filters
              </button>
            </form>
          </div>
          {/* Main content (search/filter bar and cards) */}
          <div className="flex-1 min-w-0">
            <div className="w-full mb-8">
              <div className="relative max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects or users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="grid gap-8">
              <div>
                <h2 className="text-xl font-bold mb-2">Projects</h2>
                {filteredProjects.length === 0 && (
                  <div className="text-gray-500 text-center">No projects found.</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.map((project, idx) => (
                    <Card
                      key={project.id}
                      className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                    >
                      <div className="h-2 ${cardColors[idx % cardColors.length]}"></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{project.name}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {project.description || 'No description available'}
                        </p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                              {project.userId?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">
                              {project.userId ? project.userId.substring(0, 15) + (project.userId.length > 15 ? '...' : '') : 'Unknown'}
                            </span>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); navigate(`/buyer/project/${project.id}`); }}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Sellers</h2>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">No users found</div>
                    <p className="text-sm text-gray-500">Try adjusting your search or check back later</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUsers.map((user, idx) => (
                      <Card key={user.id} className="p-5 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{user.name || 'Anonymous User'}</h3>
                            <p className="text-sm text-gray-500 truncate max-w-[200px]">{user.email}</p>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="text-xs text-gray-500 ml-1">(24)</span>
                            </div>
                          </div>
                        </div>
                        <button className="mt-4 w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          View Profile
                        </button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceNav;
