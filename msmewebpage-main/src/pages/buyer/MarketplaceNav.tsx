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

const MarketplaceNav = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [tool, setTool] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const categories = ["All", "Web", "Mobile", "Data Science", "AI", "DevOps"];
  const tools = ["All", "React", "Angular", "Vue", "Node.js", "Python", "Java"];
  const years = ["All", "2024", "2023", "2022", "2021", "2020"];
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Start loading before API call
    // Fetch all projects
    axios.get(`/api/projects?page=${page}&size=${pageSize}`)
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
        setIsLoading(false); // Stop loading after data is fetched
      })
      .catch(() => {
        setProjects([]);
        setIsLoading(false); // Stop loading on error
      });
  }, [page]);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredProjects(
      projects.filter(
        p =>
          p.name.toLowerCase().includes(lower) ||
          (p.description && p.description.toLowerCase().includes(lower))
      )
    );
  }, [search, projects]);

  const cardColors = [
    'bg-blue-100',
    'bg-green-100',
    'bg-pink-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-gray-100',
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-0" />
      <div className="w-full px-4 sm:px-6 py-8 relative z-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Marketplace</h1>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <div className="text-gray-500 text-lg">Loading projects, please wait...</div>
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
                  placeholder="Search projects..."
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
                      <div className={`h-2 ${cardColors[idx % cardColors.length]}`}></div>
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
                {/* Pagination controls */}
                <div className="flex justify-center mt-6 gap-2">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">{page}</span>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                  </button>
                </div>
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