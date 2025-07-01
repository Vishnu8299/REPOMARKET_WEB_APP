import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Code2,
  Users,
  Trophy,
  Settings,
  LogOut,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/admin-dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: Code2 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Hackathons', href: '/admin/hackathons', icon: Trophy },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          className="w-64 bg-gray-800 min-h-screen p-4"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">REPO MARKET</h2>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <button className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 w-full">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
