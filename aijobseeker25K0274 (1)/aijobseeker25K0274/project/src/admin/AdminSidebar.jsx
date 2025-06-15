import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Menu, X, Briefcase, CheckCircle, Heart, User, Bell, LogOut, Search } from "lucide-react";
import AdminDashboard from "./AdminDashboard";
const AdminSidebar = () => {
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
                Admin Portal
              </span>
            </div>

            {/* Search Bar */}
            {/* <div className="hidden md:flex flex-1 max-w-lg mx-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                  placeholder="Search jobs..."
                />
              </div>
            </div> */}

            <div className="flex items-center gap-4">
              {/* <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button> */}
              
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
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 bg-indigo-700 border-r border-indigo-800`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-1 font-medium">
            {[
              { id: 1, name: "Dahboard", icon: Briefcase, path: "/admin/dashboard" },
              // { id: 2, name: "Applied Jobs", icon: CheckCircle, path: "/admin/applied-jobs" },
              // { id: 3, name: "Saved Jobs", icon: Heart, path: "/admin/saved-jobs" },
              // { id: 4, name: "Profile Settings", icon: User, path: "/admin/profile-settings" },
              // { id: 5, name: "Notifications", icon: Bell, path: "/admin/notifications" },
            ].map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center p-2 rounded-lg transition-all
                    ${isActive 
                      ? "bg-indigo-800 text-white" 
                      : "text-indigo-100 hover:bg-indigo-600"}
                  `}
                  onClick={() => handleLinkClick(item.id)}
                >
                  <item.icon className={`w-5 h-5 ${activeLink === item.id ? "text-white" : "text-indigo-300"}`} />
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
      {id === "dashboard" && <AdminDashboard />}
      </main>
    </div>
  );
};

export default AdminSidebar