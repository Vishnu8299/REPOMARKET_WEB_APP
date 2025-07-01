import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { 
  Upload, X, FileCode, GitBranch, 
  Eye, Lock, File, AlertCircle,
  ChevronDown, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const licenses = [
  { value: "mit", label: "MIT License" },
  { value: "apache", label: "Apache License 2.0" },
  { value: "gpl", label: "GNU GPL v3" },
  { value: "bsd", label: "BSD 3-Clause" },
  { value: "none", label: "No License" },
];

const gitignoreTemplates = [
  { value: "node", label: "Node" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "react", label: "React" },
  { value: "none", label: "None" },
];

const NewProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "public",
    addReadme: false,
    gitignoreTemplate: "none",
    license: "none",
  });
  const [files, setFiles] = useState<File[]>([]);
  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB to be safe

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const oversizedFiles = acceptedFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Files too large",
        description: `Some files exceed 15MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`
      });
      return;
    }
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: (rejectedFiles) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Files must be smaller than 15MB. Rejected: ${rejectedFiles.map(f => f.file.name).join(', ')}`
      });
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      // Calculate total size
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      if (totalSize > MAX_FILE_SIZE) {
        throw new Error(`Total file size (${(totalSize / 1024 / 1024).toFixed(2)}MB) exceeds 15MB limit`);
      }

      files.forEach(file => {
        formDataToSend.append("files", file);
      });

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formDataToSend,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to create project");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
      navigate(`/developer/projects/${data.data.id}`);
    } catch (error) {
      console.error('Project creation error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div>
              <motion.h1 
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Create New Project
              </motion.h1>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Share your project with the community and collaborate with others
              </motion.p>
            </div>
            {isSubmitting && (
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Creating project...</span>
              </motion.div>
            )}
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center space-x-2 mb-4">
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FileCode className="w-5 h-5 text-blue-600" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter a unique name for your project"
                      required
                      className="transition-all focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Choose a memorable name that describes your project
                    </p>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What does your project do? What problem does it solve?"
                      required
                      className="min-h-[120px] transition-all focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      A good description helps others understand your project
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visibility
                    </label>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={formData.visibility === "public" ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({ ...prev, visibility: "public" }))}
                        className={cn(
                          "flex-1 transition-all",
                          formData.visibility === "public" 
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                            : "hover:border-blue-500 hover:text-blue-600"
                        )}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Public
                        <span className="ml-1 text-xs opacity-70">(Visible to everyone)</span>
                      </Button>
                      <Button
                        type="button"
                        variant={formData.visibility === "private" ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({ ...prev, visibility: "private" }))}
                        className={cn(
                          "flex-1 transition-all",
                          formData.visibility === "private"
                            ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                            : "hover:border-gray-500 hover:text-gray-600"
                        )}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Private
                        <span className="ml-1 text-xs opacity-70">(Only visible to you)</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Project Files */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ 
                        y: isDragActive ? [-2, 2] : 0 
                      }}
                      transition={{ 
                        repeat: isDragActive ? Infinity : 0,
                        duration: 0.5,
                        repeatType: "reverse" 
                      }}
                    >
                      <Upload className="w-5 h-5 text-blue-600" />
                    </motion.div>
                    <h2 className="text-xl font-semibold text-gray-900">Project Files</h2>
                  </div>
                  <motion.div 
                    className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full"
                    whileHover={{ scale: 1.05 }}
                  >
                    Max size: 15MB per file
                  </motion.div>
                </div>

                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all relative overflow-hidden",
                    isDragActive 
                      ? "border-blue-500 bg-blue-50 shadow-inner" 
                      : "border-gray-300 hover:border-blue-500 hover:bg-gray-50"
                  )}
                >
                  {isDragActive && (
                    <motion.div
                      className="absolute inset-0 bg-blue-100 opacity-20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <input {...(getInputProps() as any)} />
                  <motion.div
                    animate={{
                      y: isDragActive ? [-10, 0] : 0,
                      scale: isDragActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Upload className={cn(
                      "w-12 h-12 mx-auto mb-4 transition-all",
                      isDragActive ? "text-blue-500" : "text-gray-400"
                    )} />
                  </motion.div>
                  <motion.p 
                    className="text-gray-600 font-medium"
                    animate={{
                      scale: isDragActive ? 1.05 : 1,
                    }}
                  >
                    {isDragActive ? (
                      "Drop your files here..."
                    ) : (
                      <>
                        <span className="text-blue-600">Click to upload</span> or drag and drop
                      </>
                    )}
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload your project files, documentation, or resources
                  </p>
                </div>

                {files.length > 0 && (
                  <motion.div 
                    className="mt-4 space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between text-sm text-gray-500 px-3">
                      <span>Name</span>
                      <span>Size</span>
                    </div>
                    {files.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3 transition-all hover:bg-gray-100 group"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <FileCode className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          </motion.div>
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                    <motion.div 
                      className="flex justify-between items-center text-sm text-gray-500 px-3 pt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span>Total files: {files.length}</span>
                      <span>
                        Total size: {(files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)}MB
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Project Settings */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center space-x-2 mb-6">
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GitBranch className="w-5 h-5 text-blue-600" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-gray-900">Project Settings</h2>
                </div>

                <div className="space-y-6">
                  <motion.div 
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="addReadme"
                        checked={formData.addReadme}
                        onChange={e => setFormData(prev => ({ ...prev, addReadme: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                      />
                      <motion.div
                        className="absolute -right-1 -top-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: formData.addReadme ? 1 : 0 }}
                      >
                        <Check className="w-3 h-3 text-blue-600" />
                      </motion.div>
                    </div>
                    <div>
                      <label htmlFor="addReadme" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Initialize with README
                      </label>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Creates a README.md file to help others understand your project
                      </p>
                    </div>
                  </motion.div>

                  <motion.div className="space-y-2" whileHover={{ x: 5 }}>
                    <label className="block text-sm font-medium text-gray-700">
                      .gitignore Template
                    </label>
                    <Select
                      value={formData.gitignoreTemplate}
                      onValueChange={value => setFormData(prev => ({ ...prev, gitignoreTemplate: value }))}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors">
                        <SelectValue placeholder="Select a template">
                          <div className="flex items-center space-x-2">
                            <File className="w-4 h-4 text-gray-500" />
                            <span>{gitignoreTemplates.find(t => t.value === formData.gitignoreTemplate)?.label || "Select a template"}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {gitignoreTemplates.map(template => (
                          <SelectItem 
                            key={template.value} 
                            value={template.value}
                            className="hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <File className="w-4 h-4 text-gray-500" />
                              <span>{template.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      Choose which files to ignore in your repository
                    </p>
                  </motion.div>

                  <motion.div className="space-y-2" whileHover={{ x: 5 }}>
                    <label className="block text-sm font-medium text-gray-700">
                      License
                    </label>
                    <Select
                      value={formData.license}
                      onValueChange={value => setFormData(prev => ({ ...prev, license: value }))}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors">
                        <SelectValue placeholder="Choose a license">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-gray-500" />
                            <span>{licenses.find(l => l.value === formData.license)?.label || "Choose a license"}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {licenses.map(license => (
                          <SelectItem 
                            key={license.value} 
                            value={license.value}
                            className="hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="w-4 h-4 text-gray-500" />
                              <span>{license.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      {formData.license === "none" 
                        ? "Choose how others can use your code"
                        : `The ${licenses.find(l => l.value === formData.license)?.label} allows others to reuse your code with certain conditions`
                      }
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              className="flex justify-end space-x-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                  className="transition-all hover:border-gray-400"
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.description}
                  className={cn(
                    "min-w-[140px] transition-all",
                    isSubmitting
                      ? "bg-gray-400"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  )}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <>
                      <GitBranch className="w-4 h-4 mr-2" />
                      Create Project
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default NewProject; 