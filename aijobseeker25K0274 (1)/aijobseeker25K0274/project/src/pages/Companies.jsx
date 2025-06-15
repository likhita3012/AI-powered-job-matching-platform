import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Users, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export function Companies() {
  const companies = [
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200&fit=crop&crop=center',
      description: 'Leading software development and IT consulting company',
      location: 'San Francisco, CA',
      employees: '1000-5000',
      rating: 4.5,
      industry: 'Technology',
      openPositions: 25
    },
    {
      id: 2,
      name: 'Global Innovations',
      logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop&crop=center',
      description: 'Innovation-driven technology solutions provider',
      location: 'New York, NY',
      employees: '5000-10000',
      rating: 4.8,
      industry: 'Technology',
      openPositions: 42
    },
    {
      id: 3,
      name: 'Creative Studios',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop&crop=center',
      description: 'Digital creative agency specializing in design and marketing',
      location: 'Los Angeles, CA',
      employees: '100-500',
      rating: 4.6,
      industry: 'Creative',
      openPositions: 12
    },
    {
      id: 4,
      name: 'FinTech Solutions',
      logo: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=200&h=200&fit=crop&crop=center',
      description: 'Leading financial technology company',
      location: 'Boston, MA',
      employees: '500-1000',
      rating: 4.3,
      industry: 'Finance',
      openPositions: 18
    },
    {
      id: 5,
      name: 'Health Innovations',
      logo: 'https://images.unsplash.com/photo-1576267423048-15c0040fec78?w=200&h=200&fit=crop&crop=center',
      description: 'Healthcare technology and research company',
      location: 'Seattle, WA',
      employees: '1000-5000',
      rating: 4.7,
      industry: 'Healthcare',
      openPositions: 30
    },
    {
      id: 6,
      name: 'EcoSolutions',
      logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&h=200&fit=crop&crop=center',
      description: 'Sustainable technology and environmental solutions',
      location: 'Portland, OR',
      employees: '100-500',
      rating: 4.4,
      industry: 'Environmental',
      openPositions: 15
    }
  ];

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Top Companies Hiring Now
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Discover industry-leading companies that are looking for talent like you.
                Explore opportunities and find your perfect match.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-600">{company.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">{company.description}</p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {company.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {company.employees}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Building2 className="h-4 w-4 mr-1" />
                      {company.industry}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-600">
                      {company.openPositions} open positions
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-600 mt-16">
          <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to join these amazing companies?
                <br />
                Create your profile today.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
                Get noticed by top employers and take the next step in your career journey.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/signup"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
                >
                  Get started
                </Link>
                <Link
                  to="/jobs"
                  className="text-sm font-semibold leading-6 text-white flex items-center"
                >
                  Browse Jobs <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
