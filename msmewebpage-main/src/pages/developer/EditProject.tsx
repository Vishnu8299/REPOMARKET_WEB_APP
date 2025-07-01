import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API_BASE_URL = 'http://localhost:8081/api';

interface Project {
  id: string;
  name: string;
  description: string;
  organization: string;
  // ...add other fields as needed
}

const EditProject = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/developer/projects');
      return;
    }
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (!response.ok || !data.data) throw new Error("Failed to load project");
        setProject(data.data);
      } catch (err: any) {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!project) return;
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      });
      if (!response.ok) throw new Error("Update failed");
      navigate(`/developer/projects/${id}`);
    } catch (err: any) {
      setError("Failed to update project");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error || !project) return <div>{error || "Project not found"}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium" htmlFor="name">Name</label>
          <Input
            id="name"
            name="name"
            value={project.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="description">Description</label>
          <Textarea
            id="description"
            name="description"
            value={project.description || ""}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="organization">Organization</label>
          <Input
            id="organization"
            name="organization"
            value={project.organization || ""}
            onChange={handleChange}
          />
        </div>
        {/* Add more fields as needed */}
        <div className="flex gap-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
