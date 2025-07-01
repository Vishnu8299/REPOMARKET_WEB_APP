import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';

const fetchProjects = async () => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch('/api/projects', { credentials: 'include', headers });
  if (!res.ok) throw new Error('Failed to fetch projects');
  const apiResponse = await res.json();
  return apiResponse.data || [];
};

const ProjectList = () => {
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    refetchInterval: 10000,
  });

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-white mb-6">Projects</h1>
      {isLoading && <p className="text-gray-400">Loading...</p>}
      {isError && <p className="text-red-400">Failed to load projects.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(projects ?? []).map((project: any) => (
          <Card key={project.id || project._id} className="p-4 bg-gray-800 border-gray-700">
            <h2 className="text-lg font-semibold text-white">{project.name}</h2>
            <p className="text-gray-400">{project.description}</p>
            <p className="text-sm text-gray-500 mt-2">Status: {project.status}</p>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ProjectList;
