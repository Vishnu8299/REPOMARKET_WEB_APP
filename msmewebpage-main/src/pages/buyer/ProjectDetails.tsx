import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, Download, Code, Eye, Shield, Star, BarChart3 } from "lucide-react";

interface ProjectFile {
  filename: string;
  contentType: string;
  size: number;
  downloadUrl?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  organization?: string;
  description?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status?: string;
  userId: string;
  files?: ProjectFile[];
  addReadme?: boolean;
  technologies?: string[];
  license?: string;
  visibility?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface ProjectStats {
  projectId: string;
  viewCount: number;
  downloadCount: number;
  rating: number;
  reviewCount: number;
}

interface ProjectDetailsData {
  id: string;
  name: string;
  description: string;
  status?: string;
  visibility?: string;
  addReadme?: boolean;
  gitignoreTemplate?: string;
  license?: string;
  technologies?: string[];
  createdAt?: string;
  updatedAt?: string;
  developerName?: string;
  developerEmail?: string;
  developerOrganization?: string;
  developerDescription?: string;
  files?: ProjectFile[];
  stats?: ProjectStats;
  readmeContent?: string;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projectDetails, setProjectDetails] = useState<ProjectDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    // Track view first
    axios.post(`/api/projects/public/${id}/view`)
      .catch(err => console.log("View tracking failed:", err)); // Don't fail if tracking fails
    
    // Fetch comprehensive project details using the new endpoint
    axios.get(`/api/projects/public/${id}/details`)
      .then(res => {
        const detailsData = res.data?.data || null;
        setProjectDetails(detailsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load project details:", err);
        setError("Failed to load project details.");
        setLoading(false);
      });
  }, [id]);

  const getFileIcon = (filename: string) => {
    const ext = filename.toLowerCase().split('.').pop();
    switch (ext) {
      case 'md':
      case 'txt':
        return <FileText className="w-4 h-4" />;
      case 'pptx':
      case 'ppt':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
        return <Code className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const downloadFile = (downloadUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.click();
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg">Loading project details...</div>
    </div>
  );
  
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!projectDetails) return <div className="text-center mt-8">Project not found.</div>;

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/lovable-uploads/davies-designs-studio-f5_lfi2S-d4-unsplash.jpg')"
      }}
    >
      {/* Optional overlay for readability */}
      <div className="absolute inset-0 bg-white bg-opacity-70 pointer-events-none z-0" />
      <div className="relative z-10 max-w-6xl mx-auto py-10 px-4 flex pl-80">
        {/* Sidebar Navigation */}
        <nav
          className="
            flex flex-col
            w-60 h-64
            fixed left-8 top-24
            bg-white/90 rounded-2xl shadow-2xl p-6
            z-20
          "
        >
          <a href="#overview" className="text-gray-700 hover:text-sky-500 font-medium text-lg transition">Overview</a>
          <div className="flex-1 flex items-center">
            <a href="#readme" className="text-gray-700 hover:text-sky-500 font-medium text-lg transition">README</a>
          </div>
          <a href="#documents" className="text-gray-700 hover:text-sky-500 font-medium text-lg transition">Documents</a>
        </nav>
        {/* Main Content */}
        <div className="flex-1">
          <Button
            className="mb-6 bg-sky-400 hover:bg-sky-500 text-white font-semibold transition duration-300 transform hover:scale-110 shadow-lg"
            onClick={() => navigate(-1)}
          >
            ← Back to Marketplace
          </Button>
          {/* Project Header */}
          <Card className="p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 id="overview" className="text-3xl font-bold mb-2">{projectDetails.name}</h1>
                <p className="text-gray-700 text-lg mb-4">{projectDetails.description}</p>
                
                {/* Project Metadata */}
                <div className="flex flex-wrap gap-4 mb-4">
                  {projectDetails.status && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {projectDetails.status}
                    </Badge>
                  )}
                  {projectDetails.visibility && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {projectDetails.visibility}
                    </Badge>
                  )}
                  {projectDetails.license && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {projectDetails.license}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Project Statistics */}
            {projectDetails.stats && (
              <div className="border-t pt-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Project Statistics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{projectDetails.stats.viewCount}</div>
                    <div className="text-sm text-gray-500">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{projectDetails.stats.downloadCount}</div>
                    <div className="text-sm text-gray-500">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{projectDetails.stats.rating.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{projectDetails.stats.reviewCount}</div>
                    <div className="text-sm text-gray-500">Reviews</div>
                  </div>
                </div>
              </div>
            )}

            {/* Developer Information */}
            <div className="border-t pt-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Developer Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Developer Name</p>
                  <p className="font-medium">{projectDetails.developerName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{projectDetails.developerEmail || 'N/A'}</p>
                </div>
                {projectDetails.developerOrganization && (
                  <div>
                    <p className="text-sm text-gray-500">Organization</p>
                    <p className="font-medium">{projectDetails.developerOrganization}</p>
                  </div>
                )}
                {projectDetails.developerDescription && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">About Developer</p>
                    <p className="font-medium">{projectDetails.developerDescription}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(projectDetails.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Technologies */}
            {projectDetails.technologies && projectDetails.technologies.length > 0 && (
              <div className="border-t pt-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Technologies Used
                </h2>
                <div className="flex flex-wrap gap-2">
                  {projectDetails.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* README Section */}
            {projectDetails.readmeContent && (
              <div className="border-t pt-6 mb-6">
                <h2 id="readme" className="text-xl font-semibold mb-4">README</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                    {projectDetails.readmeContent}
                  </pre>
                </div>
              </div>
            )}

            {/* Files Section */}
            {projectDetails.files && projectDetails.files.length > 0 && (
              <div className="border-t pt-6" id="documents">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Project Files ({projectDetails.files.length})
                </h2>
                <div className="grid gap-3">
                  {projectDetails.files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.filename)}
                        <div>
                          <p className="font-medium">{file.filename}</p>
                          <p className="text-sm text-gray-500">
                            {file.contentType} • {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      {file.downloadUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadFile(file.downloadUrl!, file.filename)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 