import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import DeveloperDashboard from "@/pages/developer/DeveloperDashboard";
import ProfileDev from "@/pages/developer/ProfileDev";
import NewProject from "@/pages/developer/NewProject";
import Projects from "@/pages/developer/Projects";
import Analytics from "@/pages/developer/Analytics";
import Marketplace from "@/pages/buyer/Marketplace";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import SplashScreen from '@/components/SplashScreen';
import BuyerProfile from "./pages/buyer/Profile";
import News from "@/pages/buyer/News";
import NewsDev from "@/pages/developer/News";
import Opportunities from "./pages/developer/Opportunities";
import Earnings from "./pages/developer/Earnings";
import ProjectDetails from "@/pages/developer/ProjectDetails";
import EditProject from "@/pages/developer/EditProject";
import JobDetails from "@/pages/developer/JobDetails";
import UserList from "@/pages/admin/userlist";


const queryClient = new QueryClient();

interface PrivateRouteProps {
  children: React.ReactNode;
  role: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  console.log('PrivateRoute Check:', {
    isAuthenticated,
    userRole: user?.role,
    requiredRole: role,
    user,
    isLoading
  });

  // Show loading state while checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  if (!user || user.role.toUpperCase() !== role.toUpperCase()) {
    console.log('Invalid role, redirecting to home');
    return <Navigate to="/home" />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path='/home' element={<Home />} />
                {/* Admin Routes */}
                <Route 
                  path="/admin/*" 
                  element={
                    <PrivateRoute role="ADMIN">
                      <AdminDashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="admin/admin-dashboard" 
                  element={
                    <PrivateRoute role="ADMIN">
                      <AdminDashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/userlist"
                  element={
                    <PrivateRoute role="ADMIN">
                      <UserList />
                    </PrivateRoute>
                  }
                />
                {/* Developer Routes */}
                <Route 
                  path="/developer/*" 
                  element={
                    <PrivateRoute role="DEVELOPER">
                      <DeveloperDashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/developer/news" 
                  element={
                    <PrivateRoute role="DEVELOPER">
                      <NewsDev/>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/developer/profileDev" 
                  element={
                    <PrivateRoute role="DEVELOPER">
                      <ProfileDev />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/developer/projects" 
                  element={
                    <PrivateRoute role="DEVELOPER">
                      <Projects />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/developer/projects/new" 
                  element={
                    <PrivateRoute role="DEVELOPER">
                      <NewProject />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/developer/projects/:id" 
                  element={
                    <PrivateRoute role="DEVELOPER">
                      <ProjectDetails />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/developer/projects/:id/edit" 
                  element={
                    <PrivateRoute role="DEVELOPER">
                      <EditProject />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/developer/opportunities" 
                  element={
                    <PrivateRoute role="DEVELOPER">
                      <Opportunities />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/developer/jobdetails/:id"
                  element={
                    <PrivateRoute role="DEVELOPER">
                      <JobDetails />
                    </PrivateRoute>
                  }
                />
                <Route 
                  path="/developer/analytics" 
                  element={
                    <PrivateRoute role="DEVELOPER">
                      <Analytics />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/developer/earnings" 
                  element={
                    <PrivateRoute role="DEVELOPER">
                      <Earnings />
                    </PrivateRoute>
                  } 
                />
                
                {/* Buyer Routes */}
                <Route 
                  path="/buyer/marketplace" 
                  element={
                    <PrivateRoute role="BUYER">
                      <Marketplace />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/buyer/*" 
                  element={
                    <PrivateRoute role="BUYER">
                      <Marketplace />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/buyer/profile" 
                  element={
                    <PrivateRoute role="BUYER">
                      <BuyerProfile />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/buyer/news" 
                  element={
                    <PrivateRoute role="BUYER">
                      <News />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;