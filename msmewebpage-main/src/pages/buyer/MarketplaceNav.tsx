import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import axios from "axios";

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

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Search className="w-5 h-5 mr-2 text-gray-400" />
        <Input
          placeholder="Search users or projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-lg"
        />
      </div>
      <div className="grid gap-8">
        <div>
          <h2 className="text-xl font-bold mb-2">Projects</h2>
          {filteredProjects.length === 0 && (
            <div className="text-gray-500 text-center">No projects found.</div>
          )}
          {filteredProjects.map(project => (
            <Card key={project.id} className="p-6 mb-4">
              <div className="font-bold text-lg">{project.name}</div>
              <div className="text-gray-500 text-sm mb-2">{project.description}</div>
              <div className="text-xs text-gray-400">Owner: {project.userId}</div>
            </Card>
          ))}
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
  );
};

export default MarketplaceNav;
