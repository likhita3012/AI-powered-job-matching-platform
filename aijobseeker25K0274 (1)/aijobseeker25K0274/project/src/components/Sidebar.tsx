import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const menuItems = {
    'job-seeker': [
      { icon: LayoutDashboard, label: 'Dashboard' },
      { icon: Briefcase, label: 'Jobs' },
      { icon: FileText, label: 'Applications' },
      { icon: MessageSquare, label: 'Messages' },
      { icon: Settings, label: 'Settings' },
    ],
    employer: [
      { icon: LayoutDashboard, label: 'Dashboard' },
      { icon: Briefcase, label: 'Job Postings' },
      { icon: Users, label: 'Candidates' },
      { icon: MessageSquare, label: 'Messages' },
      { icon: Settings, label: 'Settings' },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard' },
      { icon: Users, label: 'Users' },
      { icon: Briefcase, label: 'Jobs' },
      { icon: Settings, label: 'Settings' },
    ],
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">JobPortal</h1>
      </div>
      <nav className="flex-1 px-4">
        {menuItems[role].map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}