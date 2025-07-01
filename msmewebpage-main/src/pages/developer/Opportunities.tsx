import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ArrowRight,
  Filter,
  Search,
  MapPin,
  DollarSign,
  Clock,
  Building,
  Award,
  Briefcase,
  GraduationCap,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// --- API Fetch Functions ---
const getBackendJobs = async (searchTerm = ""): Promise<Opportunity[]> => {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.append("what", searchTerm);
    // Get token from localStorage (or your auth provider)
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/jobs?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await response.json();
    // Map Adzuna API response to Opportunity[]
    if (Array.isArray(data.results)) {
      return data.results.map((job: any) => ({
        id: job.id || job._id || job.__id || job.title + job.company.display_name,
        type: "adzuna",
        title: job.title,
        company: job.company?.display_name || "",
        location: job.location?.display_name || "",
        deadline: job.created || "",
        description: job.description || "",
        tags: job.category ? [job.category.label] : [],
        logo: "", // Adzuna doesn't always provide logo
        url: job.redirect_url || "",
        salary: job.salary_min ? `₹${job.salary_min} - ₹${job.salary_max}` : "",
        jobType: job.contract_time || "",
        category: job.category?.label || "",
      }));
    }
    return [];
  } catch {
    return [];
  }
};

// --- Unified Opportunity Type ---
type Opportunity = {
  id: string;
  type: "adzuna";
  title: string;
  company: string;
  location: string;
  deadline: string;
  description: string;
  tags: string[];
  logo?: string;
  url: string;
  salary?: string;
  jobType?: string;
  category?: string;
};

// --- Main Component ---
const Opportunities = () => {
  const [activeTab, setActiveTab] = useState<"all" | "jobs">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    location: "all",
    type: "all",
    category: "all",
    salaryMin: "",
    salaryMax: "",
    company: "",
    keyword: "",
  });
  const [sortBy, setSortBy] = useState("deadline");
  const [isLoading, setIsLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 18; // Show more jobs per page for better UX
  const [totalResults, setTotalResults] = useState(0);
  const [showInternships, setShowInternships] = useState(false);
  const navigate = useNavigate();

  // Debounce search input for optimization
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // --- Fetch jobs from backend with pagination and filters ---
  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    // For "all" tab: show both jobs and internships (no filter on keyword/category)
    // For "jobs" tab: filter out internships
    if (activeTab === "jobs") {
      if (filters.keyword && filters.keyword.toLowerCase().includes("intern")) {
        params.append("what", ""); // Remove internship keyword if present
      } else if (filters.keyword) {
        params.append("what", filters.keyword);
      }
      // Remove internship category if present
      if (filters.category && filters.category.toLowerCase() === "internships") {
        params.append("category", "");
      } else if (filters.category !== "all" && filters.category) {
        params.append("category", filters.category);
      }
    } else {
      // "all" tab: allow both jobs and internships
      if (filters.keyword) params.append("what", filters.keyword);
      if (filters.category !== "all" && filters.category) params.append("category", filters.category);
    }
    if (filters.location !== "all" && filters.location) params.append("where", filters.location);
    if (filters.type !== "all" && filters.type) params.append("contract_type", filters.type);
    if (filters.salaryMin) params.append("salary_min", filters.salaryMin);
    if (filters.salaryMax) params.append("salary_max", filters.salaryMax);
    if (filters.company) params.append("company", filters.company);
    params.append("results_per_page", jobsPerPage.toString());
    params.append("page", currentPage.toString());

    const token = localStorage.getItem("token");
    fetch(`/api/jobs?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => {
        setOpportunities(
          Array.isArray(data.results)
            ? data.results.map((job: any) => ({
                id: job.id || job._id || job.__id || job.title + job.company.display_name,
                type: "adzuna",
                title: job.title,
                company: job.company?.display_name || "",
                location: job.location?.display_name || "",
                deadline: job.created || "",
                description: job.description || "",
                tags: job.category ? [job.category.label] : [],
                logo: "", // Adzuna doesn't always provide logo
                url: job.redirect_url || "",
                salary: job.salary_min ? `₹${job.salary_min} - ₹${job.salary_max}` : "",
                jobType: job.contract_time || "",
                category: job.category?.label || "",
              }))
            : []
        );
        setTotalResults(data.count || 0);
        setIsLoading(false);
      });
  }, [filters, currentPage, jobsPerPage, activeTab]);

  // Reset page to 1 when filters, tab, or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, activeTab, sortBy]);

  // Memoize filtered and sorted jobs (client-side, but most filtering is now server-side)
  const filteredOpportunities = useMemo(() => {
    let filtered = opportunities;
    // For "all" tab, do NOT filter out internships; show both jobs and internships intermixed
    // For "jobs" tab, filter out internships
    if (activeTab === "jobs") {
      filtered = filtered.filter(
        (opp) =>
          !(opp.category && opp.category.toLowerCase().includes("intern")) &&
          !(opp.title && opp.title.toLowerCase().includes("intern"))
      );
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(q) ||
          opp.company.toLowerCase().includes(q)
      );
    }
    if (sortBy === "deadline") {
      filtered = filtered.slice().sort((a, b) => {
        return (new Date(a.deadline).getTime() || 0) - (new Date(b.deadline).getTime() || 0);
      });
    }
    // For "all" tab, jobs and internships are already intermixed as received from backend
    return filtered;
  }, [opportunities, activeTab, debouncedSearch, sortBy]);

  // Memoize suggestions for location, job type, and role
  const suggestions = useMemo(() => {
    const locations = new Set<string>();
    const jobTypes = new Set<string>();
    const roles = new Set<string>();
    opportunities.forEach((opp) => {
      if (opp.location) locations.add(opp.location);
      if (opp.jobType) jobTypes.add(opp.jobType);
      if (opp.category) roles.add(opp.category);
    });
    return {
      locations: Array.from(locations).filter(Boolean),
      jobTypes: Array.from(jobTypes).filter(Boolean),
      roles: Array.from(roles).filter(Boolean),
    };
  }, [opportunities]);

  // Pagination controls
  const totalPages = Math.max(
    Math.ceil((totalResults || filteredOpportunities.length) / jobsPerPage),
    1
  );

  const tabs = [
    { id: "all", label: "All", icon: Briefcase },
    { id: "jobs", label: "Jobs", icon: Award },
  ];

  const opportunityVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const cardVariants = {
    collapsed: { height: "auto" },
    expanded: { height: "auto" },
  };

  const pastelBgColors = [
    "bg-[#FFF6E5]",
    "bg-[#E6F6F3]",
    "bg-[#F2EAFE]",
    "bg-[#EAF6FF]",
    "bg-[#FFE9DD]",
    "bg-[#FDEDF4]",
    "bg-[#F5F7FA]",
  ];

  const tagColorMap: Record<string, string> = {
    "Full time": "bg-[#E6F6F3] text-[#1A7F6B]",
    "Part time": "bg-[#FFF6E5] text-[#B26B00]",
    "Internship": "bg-[#FDEDF4] text-[#B80060]",
    "Project work": "bg-[#EAF6FF] text-[#1A5FB4]",
    "Volunteering": "bg-[#F2EAFE] text-[#7C3AED]",
    "Senior level": "bg-[#FFE9DD] text-[#B26B00]",
    "Middle level": "bg-[#E6F6F3] text-[#1A7F6B]",
    "Junior level": "bg-[#EAF6FF] text-[#1A5FB4]",
    "Distant": "bg-[#F5F7FA] text-[#6B7280]",
    "Flexible schedule": "bg-[#E6F6F3] text-[#1A7F6B]",
    "Full Day": "bg-[#F2EAFE] text-[#7C3AED]",
    "Shift work": "bg-[#FFF6E5] text-[#B26B00]",
    "Shift method": "bg-[#FDEDF4] text-[#B80060]",
  };

  function getTagStyle(tag: string) {
    return tagColorMap[tag] || "bg-gray-100 text-gray-600";
  }

  // Utility: Map company display_name to domain (add more as needed)
  const companyDomainMap: Record<string, string> = {
    Infosys: "infosys.com",
    "Tata Consultancy Services": "tcs.com",
    Wipro: "wipro.com",
    Accenture: "accenture.com",
    Cognizant: "cognizant.com",
    IBM: "ibm.com",
    Google: "google.com",
    Microsoft: "microsoft.com",
    Amazon: "amazon.com",
    // ...add more mappings as needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#EAF6FF] flex flex-col md:flex-row transition-colors duration-500">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-80 bg-white rounded-2xl shadow-xl m-8 p-8 h-fit animate-fade-in">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl p-6 flex flex-col items-center text-white shadow-lg"
          >
            <span className="font-bold text-lg mb-2 text-center">Find Your Next Opportunity</span>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow" size="sm">
              Learn more
            </Button>
          </motion.div>
        </div>
        {/* --- Enhanced Filters --- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="font-semibold text-lg mb-4">Filter Jobs</h3>
          <div className="mb-4">
            <label className="font-medium text-sm mb-2 block">Keyword</label>
            <Input
              placeholder="e.g. Python Developer"
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
            />
          </div>
          <div className="mb-4">
            <label className="font-medium text-sm mb-2 block">Location</label>
            <Input
              placeholder="e.g. Bangalore, India"
              value={filters.location === "all" ? "" : filters.location}
              onChange={e => setFilters(prev => ({ ...prev, location: e.target.value || "all" }))}
            />
          </div>
          <div className="mb-4">
            <label className="font-medium text-sm mb-2 block">Category</label>
            <Select value={filters.category} onValueChange={val => setFilters(prev => ({ ...prev, category: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {["IT Jobs", "Engineering Jobs", "Healthcare & Nursing", "Education & Teaching", "Retail & Sales", "Finance & Accounting", "Legal", "Construction", "Manufacturing", "Hospitality & Catering", "Logistics & Warehouse", "Graduate Jobs", "Internships"].map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label className="font-medium text-sm mb-2 block">Job Type</label>
            <Select value={filters.type} onValueChange={val => setFilters(prev => ({ ...prev, type: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                { [
                  { label: "All", value: "all" },
                  { label: "Full-time", value: "full_time" },
                  { label: "Part-time", value: "part_time" },
                  { label: "Permanent", value: "permanent" },
                  { label: "Temporary", value: "temporary" },
                  { label: "Contract", value: "contract" },
                  { label: "Internship", value: "internship" },
                  { label: "Graduate", value: "graduate" },
                  { label: "Remote", value: "remote" },
                ].map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4 flex gap-2">
            <div className="flex-1">
              <label className="font-medium text-sm mb-2 block">Salary Min</label>
              <Input
                type="number"
                placeholder="Min"
                value={filters.salaryMin}
                onChange={e => setFilters(prev => ({ ...prev, salaryMin: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <label className="font-medium text-sm mb-2 block">Salary Max</label>
              <Input
                type="number"
                placeholder="Max"
                value={filters.salaryMax}
                onChange={e => setFilters(prev => ({ ...prev, salaryMax: e.target.value }))}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="font-medium text-sm mb-2 block">Company</label>
            <Input
              placeholder="e.g. Infosys"
              value={filters.company}
              onChange={e => setFilters(prev => ({ ...prev, company: e.target.value }))}
            />
          </div>
          <Button
            className="w-full mt-2"
            variant="outline"
            onClick={() =>
              setFilters({
                location: "all",
                type: "all",
                category: "all",
                salaryMin: "",
                salaryMax: "",
                company: "",
                keyword: "",
              })
            }
          >
            Clear All Filters
          </Button>
        </motion.div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 px-2 md:px-0 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Tabs and Internship Button */}
          <motion.div
            className="flex flex-wrap gap-4 mb-8 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {tabs.map((tab) => (
              <TooltipProvider key={tab.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeTab === tab.id ? "default" : "outline"}
                      onClick={() => {
                        setActiveTab(tab.id as typeof activeTab);
                        setShowInternships(false);
                        setCurrentPage(1);
                        // Reset filters for "all" and "jobs" tabs
                        if (tab.id === "all") {
                          setFilters((prev) => ({
                            ...prev,
                            keyword: "",
                            category: "all",
                          }));
                        }
                        if (tab.id === "jobs") {
                          setFilters((prev) => ({
                            ...prev,
                            keyword: "",
                            category: "all",
                          }));
                        }
                      }}
                      className="flex items-center rounded-full px-5 py-2 text-base font-semibold"
                    >
                      <tab.icon className="w-5 h-5 mr-2" />
                      {tab.label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View {tab.label} jobs</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            <Button
              variant={showInternships ? "default" : "outline"}
              className="flex items-center rounded-full px-5 py-2 text-base font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
              onClick={() => {
                setShowInternships(true);
                setActiveTab("all");
                setFilters((prev) => ({
                  ...prev,
                  keyword: "intern",
                  location: "India",
                  type: "all",
                  category: "Internships",
                }));
                setCurrentPage(1);
              }}
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Internships (India)
            </Button>
          </motion.div>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">
                Recommended jobs{" "}
                <span className="text-gray-400 text-lg font-normal align-middle">
                  {totalResults || filteredOpportunities.length}
                </span>
              </h1>
              <div className="text-gray-500 text-base">
                Sort by:{" "}
                <span className="font-semibold">
                  {sortBy === "deadline" ? "Last updated" : sortBy}
                </span>
              </div>
            </div>
            <div className="flex-1 flex gap-4 md:justify-end">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="search"
                  placeholder="Search opportunities..."
                  className="pl-10 w-full rounded-full bg-white border border-gray-200 shadow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="rounded-full border-gray-200 bg-white shadow">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Opportunities</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <Input
                        placeholder="Enter location"
                        value={filters.location === "all" ? "" : filters.location}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            location: e.target.value || "all",
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Sort By</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deadline">Deadline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          {/* Cards Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                layout
              >
                {filteredOpportunities.map((opp, index) => (
                  <motion.div
                    key={opp.id}
                    layoutId={opp.id}
                    variants={opportunityVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ delay: index * 0.07 }}
                    className={`relative rounded-3xl p-7 shadow-md border border-gray-200 flex flex-col justify-between min-h-[320px] ${pastelBgColors[index % pastelBgColors.length]} hover:scale-[1.03] hover:shadow-xl transition-transform duration-200`}
                    style={{ boxShadow: "0 4px 24px 0 rgba(31,38,135,0.07)" }}
                    whileHover={{ y: -8, boxShadow: "0 8px 32px 0 rgba(31,38,135,0.13)" }}
                  >
                    {/* Date and Save Icon */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500 font-semibold">
                        {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : ""}
                      </span>
                      <button className="rounded-full p-1 hover:bg-gray-100 transition">
                        <svg width="20" height="20" fill="none" stroke="currentColor" className="text-gray-400"><rect x="6" y="4" width="8" height="12" rx="2" /><circle cx="10" cy="16" r="1" /></svg>
                      </button>
                    </div>
                    {/* Logo */}
                    <img
                      src={
                        (() => {
                          const domain =
                            companyDomainMap[opp.company] ||
                            (opp.company && opp.company.replace(/\s+/g, "").toLowerCase() + ".com");
                          return `https://logo.clearbit.com/${domain}`;
                        })()
                      }
                      onError={e => {
                        // fallback to avatar if logo fails
                        (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(opp.company)}`;
                      }}
                      alt={opp.company}
                      className="absolute top-6 right-6 w-10 h-10 rounded-full object-cover border border-gray-200 shadow bg-white"
                    />
                    {/* Title & Company */}
                    <div className="mb-2 mt-2">
                      <div className="font-semibold text-lg text-gray-900">{opp.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500 font-medium">{opp.company}</span>
                        <span className="text-gray-400 text-sm ml-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {opp.location || "N/A"}
                        </span>
                      </div>
                    </div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {opp.tags && opp.tags.length > 0 && opp.tags[0] !== "IT Jobs"
                        ? opp.tags.slice(0, 5).map((tag) => (
                            <span
                              key={tag}
                              className={`rounded-full px-3 py-1 text-xs font-medium ${getTagStyle(tag)}`}
                            >
                              {tag}
                            </span>
                          ))
                        : null}
                    </div>
                    {/* Salary & Location */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg text-gray-900">
                        {opp.salary || ""}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {opp.location}
                      </span>
                    </div>
                    {/* Details Button */}
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        className="rounded-full px-6 py-2 font-semibold text-base bg-black text-white hover:bg-gray-900 transition"
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/developer/jobdetails/${opp.id}`, { state: { job: opp } });
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
          {/* Pagination Controls */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <span className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
          {/* No Opportunities Found */}
          {!isLoading && filteredOpportunities.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-600">No opportunities found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    location: "all",
                    type: "all",
                    category: "all",
                    salaryMin: "",
                    salaryMax: "",
                    company: "",
                    keyword: "",
                  });
                  setActiveTab("all");
                }}
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Opportunities;