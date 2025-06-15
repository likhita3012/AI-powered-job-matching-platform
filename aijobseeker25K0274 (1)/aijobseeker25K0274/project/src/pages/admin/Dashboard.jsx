import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      name: 'Total Users',
      value: '24,580',
      change: '+12%',
      icon: Users,
      trend: 'up'
    },
    {
      name: 'Active Jobs',
      value: '1,429',
      change: '+8%',
      icon: Briefcase,
      trend: 'up'
    },
    {
      name: 'Companies',
      value: '847',
      change: '+5%',
      icon: Building2,
      trend: 'up'
    },
    {
      name: 'Applications',
      value: '12,875',
      change: '+15%',
      icon: TrendingUp,
      trend: 'up'
    }
  ];

  const recentApplications = [
    {
      id: 1,
      candidate: 'Sarah Johnson',
      position: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      status: 'Pending',
      date: '2h ago',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 2,
      candidate: 'Michael Chen',
      position: 'Product Manager',
      company: 'Innovation Labs',
      status: 'Approved',
      date: '4h ago',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 3,
      candidate: 'Emily Wilson',
      position: 'UX Designer',
      company: 'Creative Studio',
      status: 'Rejected',
      date: '6h ago',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return CheckCircle;
      case 'Rejected':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's what's happening with your job portal today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.name}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${
                stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="ml-2 text-sm text-gray-600">from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          <p className="mt-1 text-sm text-gray-600">
            Latest job applications and their current status.
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {recentApplications.map((application) => {
            const StatusIcon = getStatusIcon(application.status);
            return (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={application.avatar}
                      alt={application.candidate}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {application.candidate}
                      </h3>
                      <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                        <span>{application.position}</span>
                        <span>•</span>
                        <span>{application.company}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span>{application.status}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {application.date}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 