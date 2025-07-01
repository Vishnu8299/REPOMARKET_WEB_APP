import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  File, Download, Clock, GitBranch, Share2, Star, Users, Folder, Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import ReactMarkdown from "react-markdown";
// @ts-ignore
import JSZip from "jszip";

// Helper for base64 encoding Unicode (handles non-Latin1 chars)
function base64EncodeUnicode(str: string) {
  return btoa(unescape(encodeURIComponent(str)));
}

// Helper for base64 decoding Unicode
function base64DecodeUnicode(str: string) {
  return decodeURIComponent(escape(atob(str)));
}

interface ProjectFile {
  filename: string;
  contentType: string;
  data: string;
  size: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  organization: string;
  visibility: string;
  createdAt: string;
  files: ProjectFile[];
}

const API_BASE_URL = 'http://localhost:8081/api';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [editingMarkdown, setEditingMarkdown] = useState(false);
  const [markdownEditContent, setMarkdownEditContent] = useState<string>("");
  const [markdownError, setMarkdownError] = useState<string | null>(null);
  const [markdownTouched, setMarkdownTouched] = useState(false);
  const [addFileModalOpen, setAddFileModalOpen] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newFileError, setNewFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const markdownTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        navigate('/developer/projects');
        return;
      }
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch project');
        const responseData = await response.json();
        const projectData = responseData.data;
        if (!projectData || !projectData.id) throw new Error('Invalid project data received');
        setProject(projectData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setTimeout(() => navigate('/developer/projects'), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  useEffect(() => {
    if (selectedFile && selectedFile.contentType.startsWith("text/")) {
      try {
        setFileContent(base64DecodeUnicode(selectedFile.data));
        setIsEditing(true);
      } catch {
        setFileContent("");
        setIsEditing(false);
      }
    } else {
      setFileContent("");
      setIsEditing(false);
    }
  }, [selectedFile]);

  // Find the first .md file in the project
  const markdownFile = project?.files.find(
    (file) => file.filename.toLowerCase().endsWith(".md")
  );
  // Use the raw markdown content (decoded) for display, not rendered as HTML
  const markdownContent = markdownFile ? base64DecodeUnicode(markdownFile.data) : null;

  // Start editing the markdown file
  const handleEditMarkdown = () => {
    if (markdownFile) {
      setMarkdownEditContent(base64DecodeUnicode(markdownFile.data));
      setEditingMarkdown(true);
      setMarkdownError(null);
      setMarkdownTouched(false);
      setSelectedFile(null); // Deselect other files if any
      setTimeout(() => {
        markdownTextareaRef.current?.focus();
      }, 100);
    }
  };

  // Validate markdown content (example: non-empty, max length)
  const validateMarkdown = (content: string) => {
    if (!content.trim()) return "Markdown content cannot be empty.";
    if (content.length > 10000) return "Markdown content is too long.";
    return null;
  };

  // Save the markdown file
  const handleSaveMarkdown = async () => {
    setMarkdownTouched(true);
    const validationError = validateMarkdown(markdownEditContent);
    if (validationError) {
      setMarkdownError(validationError);
      return;
    }
    if (!project || !markdownFile) return;
    setSaveStatus("saving");
    setMarkdownError(null);
    try {
      const token = localStorage.getItem('token');
      const updatedFiles = project.files.map(f =>
        f.filename === markdownFile.filename
          ? { ...f, data: base64EncodeUnicode(markdownEditContent) }
          : f
      );
      const updatedProject = {
        ...project,
        files: updatedFiles,
        userId: (project as any).userId ?? "",
        status: (project as any).status ?? "PUBLISHED",
        addReadme: (project as any).addReadme ?? false,
        gitignoreTemplate: (project as any).gitignoreTemplate ?? "none",
        license: (project as any).license ?? "none",
        technologies: (project as any).technologies ?? null,
      };
      const response = await fetch(`${API_BASE_URL}/projects/${project.id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProject)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save file");
      }
      setSaveStatus("saved");
      setProject(updatedProject);
      setEditingMarkdown(false);
      setTimeout(() => setSaveStatus("idle"), 1500);
    } catch (err: any) {
      setSaveStatus("error");
      setMarkdownError(err?.message || "Failed to save file");
    }
  };

  const handleFileDownload = async (file: ProjectFile) => {
    try {
      setIsDownloading(file.filename);
      const binary = atob(file.data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: file.contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      // Optionally show a toast here
    } finally {
      setIsDownloading(null);
    }
  };

  // Bulk download all files as zip
  const handleDownloadAll = async () => {
    if (!project || !project.files.length) return;
    setIsBulkDownloading(true);
    try {
      const zip = new JSZip();
      project.files.forEach(file => {
        try {
          const binary = atob(file.data);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          zip.file(file.filename, bytes);
        } catch {
          // skip file if error
        }
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, "_")}_files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      // Optionally show a toast here
    } finally {
      setIsBulkDownloading(false);
    }
  };

  const handleSaveFile = async () => {
    if (!project || !selectedFile) return;
    setSaveStatus("saving");
    try {
      const token = localStorage.getItem('token');
      const updatedFiles = project.files.map(f =>
        f.filename === selectedFile.filename
          ? { ...f, data: base64EncodeUnicode(fileContent) }
          : f
      );
      const updatedProject = { ...project, files: updatedFiles };
      const response = await fetch(`${API_BASE_URL}/projects/${project.id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProject)
      });
      if (!response.ok) throw new Error("Failed to save file");
      setSaveStatus("saved");
      setProject(updatedProject);
      setTimeout(() => setSaveStatus("idle"), 1500);
    } catch {
      setSaveStatus("error");
    }
  };

  // Add new file to project
  const handleAddFile = async () => {
    if (!project || !newFile) {
      setNewFileError("Please select a file.");
      return;
    }
    setNewFileError(null);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = (e.target?.result as string).split(",")[1];
          const contentType = newFile.type || "application/octet-stream";
          const projectFile: ProjectFile = {
            filename: newFile.name,
            contentType,
            data: base64,
            size: newFile.size,
          };
          // Prevent duplicate filenames
          const filteredFiles = project.files.filter(f => f.filename !== newFile.name);
          const updatedFiles = [...filteredFiles, projectFile];

          // Only include fields that are defined in the backend Project model
          const updatedProject: any = {
            id: project.id,
            name: project.name,
            description: project.description,
            organization: project.organization,
            visibility: project.visibility,
            createdAt: project.createdAt,
            files: updatedFiles,
          };

          // If your backend expects these fields, add them if present:
          if ((project as any).userId) updatedProject.userId = (project as any).userId;
          if ((project as any).status) updatedProject.status = (project as any).status;
          if ((project as any).addReadme !== undefined) updatedProject.addReadme = (project as any).addReadme;
          if ((project as any).gitignoreTemplate) updatedProject.gitignoreTemplate = (project as any).gitignoreTemplate;
          if ((project as any).license) updatedProject.license = (project as any).license;
          if ((project as any).technologies) updatedProject.technologies = (project as any).technologies;
          if ((project as any).email) updatedProject.email = (project as any).email;
          if ((project as any).isActive !== undefined) updatedProject.isActive = (project as any).isActive;

          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/projects/${project.id}`, {
            method: "PUT",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProject)
          });
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to add file");
          }
          setProject(updatedProject);
          setAddFileModalOpen(false);
          setNewFile(null);
        } catch (err: any) {
          setNewFileError(err?.message || "Failed to add file");
        }
      };
      reader.onerror = () => setNewFileError("Failed to read file.");
      reader.readAsDataURL(newFile);
    } catch (err: any) {
      setNewFileError("Failed to read file.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate('/developer/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb
          items={[
            { label: 'Projects', href: '/developer/projects' },
            { label: project.name, href: '#' }
          ]}
        />
      </div>

      {/* Project Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 shadow mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-blue-100">
        <div>
          <h1 className="text-4xl font-extrabold flex items-center gap-3">
            <Folder className="w-8 h-8 text-blue-600" />
            <span className="text-gray-900">{project.name}</span>
            <span className="ml-3 px-3 py-1 rounded-full bg-blue-100 text-xs font-mono text-blue-700 border border-blue-200">
              {project.visibility}
            </span>
          </h1>
          <div className="flex flex-wrap gap-6 mt-4 text-base text-gray-600">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" /> {project.organization}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" /> {new Date(project.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" /> {project.files.length} files
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAll}
            disabled={isBulkDownloading || !project.files.length}
            title="Download all files as zip"
            className="flex items-center gap-2 border-blue-200"
          >
            {isBulkDownloading ? (
              <>
                <Archive className="w-4 h-4 animate-spin" />
                Zipping...
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                Download All
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 border-blue-200">
            <Star className="w-4 h-4" />
            Star
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 border-blue-200">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button
            onClick={() => navigate(`/developer/projects/${project.id}/edit`)}
            size="sm"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Edit Project
          </Button>
        </div>
      </div>

      {/* Add File Modal */}
      {addFileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New File</h3>
            <input
              ref={fileInputRef}
              type="file"
              className="mb-4"
              onChange={e => {
                setNewFile(e.target.files?.[0] || null);
                setNewFileError(null);
              }}
            />
            {newFile && (
              <div className="mb-2 text-sm text-gray-700">
                <span className="font-semibold">Selected:</span> {newFile.name} ({(newFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
            {newFileError && (
              <div className="text-red-500 text-sm mb-2">{newFileError}</div>
            )}
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddFile}
                disabled={!newFile}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Add File
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAddFileModalOpen(false);
                  setNewFile(null);
                  setNewFileError(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Files Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-12">
        <div className="flex flex-col md:flex-row">
          {/* File List Sidebar */}
          <div className="md:w-1/4 border-r border-gray-100 bg-gradient-to-b from-blue-50 to-white min-h-[300px]">
            <div className="flex items-center justify-between p-4 font-semibold text-blue-700 border-b border-blue-100 bg-blue-50">
              <span className="flex items-center gap-2">
                <Folder className="w-4 h-4" /> Files
              </span>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-200"
                onClick={() => setAddFileModalOpen(true)}
              >
                + Add
              </Button>
            </div>
            {project.files.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No files uploaded yet</div>
            ) : (
              <ul>
                {project.files.map((file, index) => (
                  <li
                    key={`${file.filename}-${index}`}
                    className={`flex items-center px-4 py-2 cursor-pointer hover:bg-blue-100 transition ${
                      selectedFile?.filename === file.filename ? "bg-blue-200 font-semibold" : ""
                    }`}
                    onClick={() => setSelectedFile(file)}
                  >
                    <File className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="truncate">{file.filename}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto"
                      onClick={e => {
                        e.stopPropagation();
                        handleFileDownload(file);
                      }}
                      disabled={isDownloading === file.filename}
                    >
                      {isDownloading === file.filename ? (
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* File Viewer/Editor */}
          <div className="md:w-3/4 p-8 bg-gradient-to-b from-white to-blue-50">
            {selectedFile ? (
              selectedFile.contentType.startsWith("text/") ? (
                <div>
                  <div className="mb-2 font-semibold flex items-center gap-2 text-blue-700">
                    <File className="w-4 h-4" />
                    {selectedFile.filename}
                  </div>
                  <textarea
                    className="w-full border rounded p-2 font-mono text-sm bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows={16}
                    value={fileContent}
                    onChange={e => setFileContent(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={handleSaveFile}
                      disabled={saveStatus === "saving"}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {saveStatus === "saving"
                        ? "Saving..."
                        : saveStatus === "saved"
                        ? "Saved!"
                        : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedFile(null)}
                      disabled={saveStatus === "saving"}
                    >
                      Cancel
                    </Button>
                    {saveStatus === "error" && (
                      <span className="text-red-500 ml-2">Save failed</span>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-2 font-semibold flex items-center gap-2 text-blue-700">
                    <File className="w-4 h-4" />
                    {selectedFile.filename}
                  </div>
                  <div className="text-gray-500">Binary file editing not supported.</div>
                </div>
              )
            ) : (
              <div className="text-gray-400">Select a file to view or edit.</div>
            )}
          </div>
        </div>
      </div>

      {/* Markdown file content at the bottom with improved edit support */}
      {markdownFile && (
        <div className="mt-12 bg-white rounded-xl border border-blue-200 p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-700">
            <File className="w-5 h-5" />
            {markdownFile.filename}
            {!editingMarkdown && (
              <Button
                size="sm"
                variant="outline"
                className="ml-4 border-blue-200"
                onClick={handleEditMarkdown}
              >
                Edit
              </Button>
            )}
          </h2>
          <div className="prose max-w-none">
            {editingMarkdown ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSaveMarkdown();
                }}
              >
                <textarea
                  ref={markdownTextareaRef}
                  className={`w-full border rounded p-2 font-mono text-sm bg-blue-50 focus:outline-none focus:ring-2 ${
                    markdownError ? "border-red-500 ring-red-200" : "focus:border-blue-500 ring-blue-200"
                  }`}
                  rows={16}
                  value={markdownEditContent}
                  onChange={e => {
                    setMarkdownEditContent(e.target.value);
                    setMarkdownTouched(true);
                    setMarkdownError(validateMarkdown(e.target.value));
                  }}
                  onBlur={() => setMarkdownTouched(true)}
                  maxLength={10000}
                  spellCheck={true}
                  aria-invalid={!!markdownError}
                  aria-describedby="markdown-error"
                />
                <div className="flex gap-2 mt-2 items-center">
                  <Button
                    type="submit"
                    disabled={saveStatus === "saving" || !!markdownError}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {saveStatus === "saving"
                      ? "Saving..."
                      : saveStatus === "saved"
                      ? "Saved!"
                      : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setEditingMarkdown(false)}
                    disabled={saveStatus === "saving"}
                  >
                    Cancel
                  </Button>
                  {saveStatus === "error" && (
                    <span className="text-red-500 ml-2">Save failed</span>
                  )}
                  {markdownError && markdownTouched && (
                    <span id="markdown-error" className="text-red-500 ml-2">{markdownError}</span>
                  )}
                  <span className="ml-auto text-xs text-gray-400">
                    {markdownEditContent.length}/10000
                  </span>
                </div>
              </form>
            ) : (
              <pre className="whitespace-pre-wrap break-words font-mono text-base bg-blue-50 p-4 rounded border border-blue-100 text-gray-800">
                {markdownContent || ""}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-12 flex justify-end gap-4">
        <Button
          variant="outline"
          className="border-blue-200"
          onClick={() => navigate('/developer/projects')}
        >
          Back to Projects
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetails;

