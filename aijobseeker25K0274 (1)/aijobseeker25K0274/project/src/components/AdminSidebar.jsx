import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  PieChart,
  MessageSquare,
  FileText,
  Calendar,
  HelpCircle,
  Menu,
  X,
  CheckCircle,
  Heart,
  User
} from 'lucide-react';

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: 'Job Listings',
      icon: Briefcase,
      href: '/job-seeker/job-listings'
    },
    {
      name: 'Applied Jobs',
      icon: CheckCircle,
      href: '/job-seeker/applied-jobs'
    },
    {
      name: 'Saved Jobs',
      icon: Heart,
      href: '/job-seeker/saved-jobs'
    },
    {
      name: 'Profile Settings',
      icon: User,
      href: '/job-seeker/profile-settings'
    },
    {
      name: 'Notifications',
      icon: Bell,
      href: '/job-seeker/notifications',
      badge: '3'
    }
  ];

  const secondaryNavigation = [
    {
      name: 'Help Center',
      icon: HelpCircle,
      href: '/admin/help'
    },
    {
      name: 'Settings',
      icon: Settings,
      href: '/admin/settings'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("firstName");
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-gradient-to-r from-teal-400 to-teal-600 border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="inline-flex items-center p-2 text-sm text-white rounded-lg sm:hidden hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                <span className="sr-only">Toggle Sidebar</span>
                {isCollapsed ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white ml-2">
                Job Seeker Dashboard
              </span>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-white hover:bg-teal-700 rounded-lg"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-medium border-2 border-teal-500">
                  3
                </span>
              </motion.button>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-teal-300"
                >
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="user"
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                        >
                          <LogOut className="w-5 h-5 mr-2" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isCollapsed ? '-translate-x-full' : 'translate-x-0'
        } bg-gradient-to-r from-teal-400 to-teal-600 sm:translate-x-0`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-teal-700 text-white'
                        : 'text-white hover:bg-teal-700'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="ml-3 flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            <li className="pt-4 mt-4 border-t border-teal-300">
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-2 text-white rounded-lg hover:bg-teal-700 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-4 sm:ml-64 pt-20">
        {/* Main content will be rendered here */}
      </main>
    </div>
  );
} 