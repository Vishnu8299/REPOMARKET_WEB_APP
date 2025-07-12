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

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/lovable-uploads/davies-designs-studio-f5_lfi2S-d4-unsplash.jpg')"
      }}
    >
      {/* Optional overlay for readability */}
      <div className="absolute inset-0 bg-white bg-opacity-70 pointer-events-none z-0" />
      <div className="w-full px-0 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-y-8 lg:gap-y-0 lg:gap-x-12 items-start">
          {/* Sidebar filter card */}
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg p-6 flex flex-col">
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
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-white rounded-full shadow px-4 py-2 w-full max-w-lg">
                <Search className="w-5 h-5 mr-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <button
                className="flex items-center bg-white rounded-full shadow px-4 py-2 font-semibold text-sm text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                <Filter className="w-5 h-5 mr-2 text-gray-500" />
                Filters
              </button>
            </div>
            <div className="grid gap-8">
              <div>
                <h2 className="text-xl font-bold mb-2">Projects</h2>
                {filteredProjects.length === 0 && (
                  <div className="text-gray-500 text-center">No projects found.</div>
                )}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProjects.map((project, idx) => (
                    <Card
                      key={project.id}
                      className={`${cardColors[idx % cardColors.length]} mb-4 rounded-2xl shadow-md p-6 flex flex-col justify-between min-h-[220px] group transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
                    >
                      {/* Title at the top */}
                      <div className="text-lg font-bold text-gray-900 mb-2 text-left truncate">{project.name}</div>
                      {/* Description below title */}
                      <div className="text-gray-700 text-sm mb-6 text-left line-clamp-3 font-normal">{project.description}</div>
                      {/* Bottom row: author and button */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-xs text-gray-500">Owner: {project.userId}</div>
                        <Button
                          size="sm"
                          className="bg-black text-white rounded-full px-6 py-2 hover:bg-gray-900 transition-colors duration-200 hidden group-hover:inline-block"
                          onClick={e => { e.stopPropagation(); navigate(`/buyer/project/${project.id}`); }}
                        >
                          Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Users</h2>
                {filteredUsers.length === 0 && (
                  <div className="text-gray-500 text-center">No users found.</div>
                )}
                {filteredUsers.map(user => (
                  <Card key={user.id} className="p-6 mb-4">
                    <div className="font-bold text-lg">{user.name}</div>
                    <div className="text-gray-500 text-sm mb-2">{user.email}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceNav;
