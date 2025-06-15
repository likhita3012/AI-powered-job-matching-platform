import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, Building2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search:', { searchQuery, location });
  };

  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      companyLogo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200&fit=crop&crop=center',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$120k - $150k',
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovation Labs',
      companyLogo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop&crop=center',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$100k - $130k',
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'Creative Studio',
      companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&crop=center',
      location: 'Remote',
      type: 'Contract',
      salary: '$80k - $100k',
    },
  ];

  const categories = [
    {
      id: 1,
      name: 'Technology',
      icon: Briefcase,
      count: 1234,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop&crop=center',
    },
    {
      id: 2,
      name: 'Marketing',
      icon: Building2,
      count: 567,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop&crop=center',
    },
    {
      id: 3,
      name: 'Design',
      icon: Briefcase,
      count: 890,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop&crop=center',
    },
    {
      id: 4,
      name: 'Sales',
      icon: Building2,
      count: 432,
      image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=300&h=200&fit=crop&crop=center',
    },
  ];

  const companies = [
    { id: 1, name: 'Google', logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=150&h=150&fit=crop&crop=center' },
    { id: 2, name: 'Apple', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=150&h=150&fit=crop&crop=center' },
    { id: 3, name: 'Microsoft', logo: 'https://images.unsplash.com/photo-1642132652075-2b0036464813?w=150&h=150&fit=crop&crop=center' },
    { id: 4, name: 'Amazon', logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=150&h=150&fit=crop&crop=center' },
    { id: 5, name: 'Facebook', logo: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=150&h=150&fit=crop&crop=center' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Layout>
        {/* Hero Section with Background Image */}
        <div 
          className="relative isolate overflow-hidden bg-cover bg-center bg-no-repeat h-[600px]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&h=600&fit=crop&crop=center")'
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Find Your Dream Job</span>
                <span className="block text-indigo-400">Start Your Journey Today</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Discover thousands of job opportunities with all the information you need. It’s your future.
              </p>
            </motion.div>

            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-10 max-w-xl mx-auto"
            >
              <form onSubmit={handleSearch} className="sm:flex shadow-xl rounded-lg overflow-hidden">
                <div className="flex-1 min-w-0 flex">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-4 border-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                      placeholder="Job title, keywords, or company"
                    />
                  </div>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="block w-full pl-10 pr-3 py-4 border-0 border-l border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                      placeholder="City, state, or remote"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex-shrink-0 w-full sm:w-auto px-6 py-4 bg-indigo-600 hover:bg-indigo-700 border-0 text-white text-base font-medium shadow-sm sm:text-sm"
                >
                  Search Jobs
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Featured Jobs Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <motion.div
                key={job.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center">
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {job.type}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{job.salary}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Job Categories Section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Categories</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  className="relative group"
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                      <p className="mt-1 text-sm text-gray-300">{category.count} jobs</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Companies Section */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Top Companies</h2>
            <div className="flex gap-8 items-center justify-center flex-wrap">
              {companies.map((company) => (
                <motion.div
                  key={company.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-16 w-16 object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to start your career journey?</span>
                <span className="block">Create your profile today.</span>
              </h2>
              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="ml-3 inline-flex">
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
