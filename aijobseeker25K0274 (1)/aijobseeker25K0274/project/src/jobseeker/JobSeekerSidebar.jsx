import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Menu, Briefcase, Heart, User, Bell, LogOut, Home, UserPlus, UserCircle, FileText } from "lucide-react";
import UserDetails from './UserDetails';
import Profile from "./Profile";
import JobSeekerDashboard from  './JobSeekerDashboard'

const JobSeekerSidebar = () => {
  const [activeLink, setActiveLink] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { id } = useParams();
  const handleLinkClick = (id) => {
    setActiveLink(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("firstName");
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigation = [
    // { name: "Dashboard", href: "/jobseeker/dashboard", icon: Home },
    { name: "Create Profile", href: "/jobseeker/user-details", icon: UserPlus },
    { name: "View Profile", href: "/jobseeker/profile", icon: UserCircle },
    { name: "Jobs", href: "/jobseeker/jobs", icon: Briefcase },
    // { name: "Applications", href: "/jobseeker/applications", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="w-6 h-6" />
              </button>
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-indigo-600 ml-2">
                Job Seeker Dashboard
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <img
                    className="w-8 h-8 rounded-full border-2 border-indigo-500"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="user"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-700">{localStorage.getItem("role")}</p>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{localStorage.getItem("role")}</p>
                      <p className="text-xs text-gray-500">{localStorage.getItem("email")}</p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                          Sign out
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
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0 bg-indigo-700 border-r border-indigo-800`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-1 font-medium">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) => `
                    flex items-center p-2 rounded-lg transition-all
                    ${isActive ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-600"}
                  `}
                  onClick={() => handleLinkClick(item.name.toLowerCase().replace(/\s+/g, '-'))}
                >
                  <item.icon className={`w-5 h-5 ${activeLink === item.name.toLowerCase().replace(/\s+/g, '-') ? "text-white" : "text-indigo-300"}`} />
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          Profile Status
          <div className="mt-8 p-4 bg-indigo-800 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="relative">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-indigo-800 rounded-full"></span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Profile Status</p>
                <p className="text-xs text-indigo-200">85% Complete</p>
              </div>
            </div>
            <div className="w-full bg-indigo-600 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: "85%" }}></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-4 sm:ml-64 pt-20">
      {id === "user-details" && <UserDetails />}
      {id === "profile" && <Profile />}
      {id === "jobs" && <JobSeekerDashboard />}
      </main>
    </div>
  );
};

export default JobSeekerSidebar;
