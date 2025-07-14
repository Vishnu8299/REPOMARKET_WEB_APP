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

  const decodeContent = (content: string) => {
    if (!content) return '';
    
    // First decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = content;
    let decoded = textarea.value;
    
    // Common emoji and special character patterns
    const charMap: { [key: string]: string } = {
      // Emoji patterns
      'ðŸ“˜': '📘',  // Blue book
      'ðŸ§¾': '🧾',  // Receipt
      'ðŸŽ¯': '🎯',  // Target
      'ðŸ›\s*ï¸�': '📋',  // Clipboard
      'ðŸ“‚': '📂',  // Folder
      'ðŸ”�': '🔧',  // Wrench
      'ðŸ§\s*': '🧑',  // Person
      
      // Common special characters
      'â€¢': '•',    // Bullet point
      'â€"': '—',    // Em dash
      'â€˜': "'",     // Single quote left
      'â€™': "'",     // Single quote right
      'â€œ': '"',    // Double quote left
      'â€�': '"',    // Double quote right
      'â€”': '—',    // Em dash
      'â€“': '–',    // En dash
      'â€¦': '…'     // Ellipsis
    };
    
    // Replace all special characters and emojis
    Object.entries(charMap).forEach(([pattern, replacement]) => {
      decoded = decoded.replace(new RegExp(pattern, 'g'), () => replacement as string);
    });
    
    // Clean up any remaining HTML entities
    decoded = decoded.replace(/&[a-z0-9#]+;/gi, (match) => {
      const el = document.createElement('div');
      el.innerHTML = match;
      return el.textContent || match;
    });
    
    // Convert markdown to HTML
    const markdownToHtml = (md: string): string => {
      // Headers
      let html = md
        .replace(/^#\s+(.*?)(\n|$)/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>')
        .replace(/^##\s+(.*?)(\n|$)/gm, '<h2 class="text-xl font-semibold my-3">$1</h2>')
        .replace(/^###\s+(.*?)(\n|$)/gm, '<h3 class="text-lg font-medium my-2">$1</h3>');
      
      // Lists
      html = html
        .replace(/^\s*[-*+]\s+(.*$)/gm, '<li class="ml-4">$1</li>')  // Unordered lists
        .replace(/^\s*\d+\.\s+(.*$)/gm, '<li class="ml-4">$1</li>') // Ordered lists
        .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc pl-6 my-2">$1</ul>');
      
      // Code blocks and inline code
      html = html
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded my-2 overflow-x-auto"><code class="text-sm">$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>');
      
      // Text formatting
      html = html
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
        .replace(/~~(.*?)~~/g, '<s>$1</s>');
      
      // Links and images
      html = html
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-2 max-w-full rounded">')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
      
      // Paragraphs and line breaks
      html = html
        .replace(/\n\s*\n/g, '</p><p class="my-3">')
        .replace(/\n/g, '<br>');
      
      // Wrap in paragraph if needed
      if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<ol') && !html.startsWith('<pre') && !html.startsWith('<img')) {
        html = `<p class="my-3">${html}</p>`;
      }
      
      return html;
    };
    
    // Apply markdown to HTML conversion
    decoded = markdownToHtml(decoded);
    
    return decoded;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              
              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!projectDetails) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-gray-900">Project not found</h3>
      <p className="mt-1 text-sm text-gray-500">The project you're looking for doesn't exist or has been removed.</p>
      <div className="mt-6">
        <Button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go back to marketplace
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <Button
                variant="outline"
                className="w-full mb-6 flex items-center justify-center gap-2"
                onClick={() => navigate(-1)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Marketplace
              </Button>
              
              <nav className="space-y-1">
                <a
                  href="#overview"
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-blue-600"
                >
                  <span className="truncate">Overview</span>
                </a>
                <a
                  href="#readme"
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-blue-600"
                >
                  <span className="truncate">Documentation</span>
                </a>
                <a
                  href="#documents"
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-blue-600"
                >
                  <span className="truncate">Files ({projectDetails.files?.length || 0})</span>
                </a>
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Details</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start">
                    <Calendar className="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Created</p>
                      <p className="text-sm text-gray-500">{formatDate(projectDetails.createdAt)}</p>
                    </div>
                  </li>
                  {projectDetails.license && (
                    <li className="flex items-start">
                      <Shield className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">License</p>
                        <p className="text-sm text-gray-500">{projectDetails.license}</p>
                      </div>
                    </li>
                  )}
                  {projectDetails.visibility && (
                    <li className="flex items-start">
                      <Eye className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Visibility</p>
                        <p className="text-sm text-gray-500 capitalize">{projectDetails.visibility}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </aside>
          
          {/* Main content */}
          <main className="lg:col-span-9 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 id="overview" className="text-2xl font-bold text-gray-900">{projectDetails.name}</h1>
                    <p className="mt-1 text-gray-600">{projectDetails.description}</p>
                  </div>
                  {projectDetails.status && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {projectDetails.status}
                    </span>
                  )}
                </div>
                

              </div>



              {/* Developer Information */}
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Developer</h2>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    View Profile
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                      {projectDetails.developerName?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {projectDetails.developerName || 'Anonymous Developer'}
                    </h3>
                    <p className="text-sm text-gray-500">{projectDetails.developerEmail || 'No email provided'}</p>
                    {projectDetails.developerOrganization && (
                      <p className="text-sm text-gray-500 mt-1">{projectDetails.developerOrganization}</p>
                    )}
                  </div>
                </div>
                {projectDetails.developerDescription && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-700">{projectDetails.developerDescription}</p>
                  </div>
                )}
              </div>

              {/* Technologies */}
              {projectDetails.technologies && projectDetails.technologies.length > 0 && (
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {projectDetails.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* README Section */}
              {projectDetails.readmeContent && (
                <div className="px-6 py-5 border-b border-gray-200" id="readme">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Documentation</h2>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      View Full Documentation
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div 
                      className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm markdown-body"
                      style={{ whiteSpace: 'pre-wrap' }}
                      dangerouslySetInnerHTML={{ 
                        __html: decodeContent(projectDetails.readmeContent || '') 
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Files Section */}
              {projectDetails.files && projectDetails.files.length > 0 && (
                <div className="px-6 py-5" id="documents">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Files <span className="text-gray-500 font-normal">({projectDetails.files.length})</span>
                    </h2>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      Download All
                    </button>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</div>
                        <div className="col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</div>
                        <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Size</div>
                        <div className="col-span-1"></div>
                      </div>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {projectDetails.files.map((file, idx) => (
                        <li key={idx} className="hover:bg-gray-50">
                          <div className="px-4 py-3">
                            <div className="grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-6 flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  {getFileIcon(file.filename)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{file.filename}</p>
                                </div>
                              </div>
                              <div className="col-span-3">
                                <p className="text-sm text-gray-500">{file.contentType}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-sm text-gray-500 text-right">{formatFileSize(file.size)}</p>
                              </div>
                              <div className="col-span-1 text-right">
                                {file.downloadUrl && (
                                  <button
                                    onClick={() => downloadFile(file.downloadUrl!, file.filename)}
                                    className="text-gray-400 hover:text-blue-600"
                                    title="Download"
                                  >
                                    <Download className="h-5 w-5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 