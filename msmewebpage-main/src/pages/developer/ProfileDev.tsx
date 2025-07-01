import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Building2, Phone, Calendar, Star, Edit2, LogOut, Home, LayoutDashboard, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileDev = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    organization: '',
    description: ''
  });

  // Fetch user details from API (including address)
  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!authUser?.id || !token) {
        setError("No user data available");
        setIsLoading(false);
        return;
      }
      const response = await fetch(
        `/api/users/${authUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch user profile");
      const data = await response.json();
      const userData = data?.data || data;
      if (userData) {
        setUser(userData);
        setError(null);
      } else {
        setError("No user data available");
      }
    } catch (error) {
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    if (!authLoading) {
      fetchUserProfile();
    }
  }, [authLoading, fetchUserProfile]);

  useEffect(() => {
    if (user && typeof user === "object") {
      setEditForm({
        name: user.name ?? '',
        phoneNumber: user.phoneNumber ?? '',
        address: user.address ?? '',
        organization: user.organization ?? '',
        description: user.description ?? ''
      });
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      // ignore
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
      organization: user?.organization || '',
      description: user?.description || ''
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const payload = { ...editForm };
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          id: user?.id,
        }),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      setUser({ ...user, ...editForm } as User);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Skeleton className="w-full h-[400px] rounded-xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#f6f8fa] py-12 px-4"
      >
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600">Please log in to view your profile</p>
            <Button onClick={() => navigate('/login')} className="mt-4">
              Go to Login
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* NavBar */}
      <nav className="w-full bg-white/95 border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <img
              src="/lovable-uploads/34eef80b-db30-4981-aa71-f838c66de8dd.png"
              alt="Logo"
              className="w-12 h-12 rounded-lg object-contain cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate("/developer/dashboard")}
              style={{ minWidth: "3rem" }}
            />
            <div className="flex items-center gap-6">
              <Link
                to="/developer/dashboard"
                className={cn(
                  "flex items-center gap-1 text-gray-700 hover:text-blue-700 px-2 py-1 rounded transition font-medium text-base",
                  window.location.pathname === "/developer/dashboard" && "font-bold text-blue-700"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/developer/projects"
                className={cn(
                  "flex items-center gap-1 text-gray-700 hover:text-blue-700 px-2 py-1 rounded transition font-medium text-base",
                  window.location.pathname.startsWith("/developer/projects") && "font-bold text-blue-700"
                )}
              >
                <Home className="w-4 h-4" />
                Projects
              </Link>
              <Link
                to="/developer/news"
                className={cn(
                  "flex items-center gap-1 text-gray-700 hover:text-blue-700 px-2 py-1 rounded transition font-medium text-base",
                  window.location.pathname === "/developer/news" && "font-bold text-blue-700"
                )}
              >
                <Newspaper className="w-4 h-4" />
                News
              </Link>
              <Link
                to="/developer/analytics"
                className={cn(
                  "flex items-center gap-1 text-gray-700 hover:text-blue-700 px-2 py-1 rounded transition font-medium text-base",
                  window.location.pathname === "/developer/analytics" && "font-bold text-blue-700"
                )}
              >
                <Star className="w-4 h-4" />
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Cover image */}
      <div className="w-full h-56 md:h-64 bg-gradient-to-r from-blue-100 to-purple-100 relative">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
          alt="cover"
          className="w-full h-full object-cover rounded-b-3xl"
        />
        {/* Profile avatar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 md:left-24 md:translate-x-0 -bottom-20 z-10">
          <div className="w-40 h-40 rounded-full border-8 border-white bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center shadow-xl overflow-hidden">
            <span className="text-6xl font-bold text-gray-500">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Two box layout, improved proportions and spacing */}
      <div className="max-w-7xl mx-auto mt-24 px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Box: Profile Summary */}
        <div
          className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-7 border border-blue-100 md:col-span-1"
          style={{ width: "350px", minWidth: "320px", maxWidth: "400px", alignSelf: "flex-start" }}
        >
          {/* Name */}
          <div className="mb-0">
            {isEditing ? (
              <Input
                className="text-xl md:text-2xl font-bold text-blue-900 h-10"
                value={editForm.name ?? user?.name ?? ""}
                onChange={e =>
                  setEditForm(prev => ({
                    ...prev,
                    name: e.target.value
                  }))
                }
                placeholder="Name"
              />
            ) : (
              <h1 className="text-xl md:text-2xl font-bold text-blue-900 break-words">{user?.name}</h1>
            )}
          </div>
          {/* Role - below name */}
          <div className="mb-2">
            <span className="inline-block px-3 py-1 rounded bg-blue-100 text-xs font-mono text-blue-700 border border-blue-200">
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : "Developer"}
            </span>
          </div>
          {/* Organization */}
          <div className="flex items-center gap-2 text-gray-600 text-base mb-1 md:mb-0">
            <Building2 size={18} />
            {isEditing ? (
              <Input
                className="w-auto h-8 text-base"
                value={editForm.organization ?? user?.organization ?? ""}
                onChange={e =>
                  setEditForm(prev => ({
                    ...prev,
                    organization: e.target.value
                  }))
                }
                placeholder="Organization"
              />
            ) : (
              <span>{user?.organization || "Independent"}</span>
            )}
          </div>
          {/* Joined Date */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 md:mb-0">
            <Calendar size={16} className="inline mr-1" />
            Joined{" "}
            {user?.createdAt
              ? new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }).format(new Date(user.createdAt))
              : 'N/A'}
          </div>
          {/* Contact Info */}
          <div className="flex flex-col gap-2 mt-4 text-center md:text-left">
            <div className="flex items-center gap-2 text-gray-600 justify-center md:justify-start">
              <Phone size={18} />
              {isEditing ? (
                <Input
                  className="w-auto h-8 text-base"
                  value={editForm.phoneNumber ?? user?.phoneNumber ?? ""}
                  onChange={e =>
                    setEditForm(prev => ({
                      ...prev,
                      phoneNumber: e.target.value
                    }))
                  }
                  placeholder="Phone Number"
                />
              ) : (
                <span>{user?.phoneNumber || "Not added"}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600 justify-center md:justify-start">
              <Mail size={18} /> <span>{user?.email || authUser?.email || ""}</span>
            </div>
          </div>
          {/* Reviews */}
          <div className="flex flex-col items-center md:items-start mt-6">
            <div className="flex items-center gap-1 text-yellow-500 text-xl font-bold">
              <Star className="w-5 h-5" />
              4.5
            </div>
            <div className="text-gray-500 text-sm">153 reviews</div>
          </div>
          {/* Profile Actions */}
          <div className="flex gap-2 mt-6 justify-end">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} className="flex-1 border-blue-200">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 border-blue-200">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
                <Button variant="outline" onClick={handleEdit} className="border-blue-200">
                  <Edit2 size={16} className="mr-2" />
                  Edit Profile
                </Button>
              </>
            )}
          </div>
        </div>
        {/* Right Box: Description, Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col gap-8 border border-blue-100 md:col-span-2 min-h-[320px]">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-10 min-h-[300px] flex flex-col">
            <div className="font-semibold text-blue-700 mb-4 text-lg">Description</div>
            <div className="flex-1">
              {isEditing ? (
                <textarea
                  className="w-full h-40 text-base border rounded p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-vertical"
                  value={editForm.description ?? user?.description ?? ""}
                  onChange={e =>
                    setEditForm(prev => ({
                      ...prev,
                      description: e.target.value
                    }))
                  }
                  placeholder="Enter description"
                  rows={8}
                  maxLength={2000}
                  style={{ whiteSpace: "pre-line" }}
                />
              ) : (
                <div
                  className="text-gray-700 text-base whitespace-pre-line break-words min-h-[120px]"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {user?.description || (
                    <span className="text-gray-400 italic">
                      No description provided. Click "Edit Profile" to add one.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDev;