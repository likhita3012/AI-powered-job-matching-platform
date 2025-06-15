import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Globe, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout'; // Import the Layout component

export function About() {
  const stats = [
    { id: 1, name: 'Active Jobs', value: '10,000+' },
    { id: 2, name: 'Companies', value: '2,000+' },
    { id: 3, name: 'Job Seekers', value: '500,000+' },
    { id: 4, name: 'Successful Hires', value: '50,000+' },
  ];

  const values = [
    {
      id: 1,
      name: 'Innovation',
      description: 'We leverage cutting-edge technology to connect talent with opportunities.',
      icon: Globe,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 2,
      name: 'Excellence',
      description: 'We strive for excellence in every interaction and service we provide.',
      icon: Award,
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 3,
      name: 'Community',
      description: 'We build strong relationships between employers and job seekers.',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 4,
      name: 'Opportunity',
      description: 'We create pathways for career growth and professional development.',
      icon: Briefcase,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop&crop=center'
    },
  ];

  const team = [
    {
      id: 1,
      name: 'John Smith',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      quote: 'Building the future of job search and recruitment.'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      quote: 'Creating seamless experiences for our users.'
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Technical Director',
      image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      quote: 'Innovating the way people find their dream jobs.'
    },
  ];

  return (
    <Layout> {/* Wrap the entire content in the Layout component */}
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
          <div 
            className="absolute inset-0 -z-10 overflow-hidden"
            style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9)), url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&h=600&fit=crop&crop=center")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl"
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                About JobPortal
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                We're on a mission to transform the way people find jobs and companies hire talent.
                Through innovation and dedication, we're making the job search process more efficient,
                transparent, and successful for everyone involved.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 px-6 py-8 rounded-2xl text-center"
                >
                  <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                  <dd className="text-3xl font-semibold tracking-tight text-indigo-600 mt-2">
                    {stat.value}
                  </dd>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Our Values
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                These core values guide everything we do and help us create the best possible experience
                for our users.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
            >
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                {values.map((value) => (
                  <motion.div
                    key={value.id}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col"
                  >
                    <div className="relative h-40 w-full mb-6 overflow-hidden rounded-lg">
                      <img
                        src={value.image}
                        alt={value.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-indigo-600/20" />
                      <value.icon className="absolute top-4 right-4 h-8 w-8 text-white" />
                    </div>
                    <dt className="text-lg font-semibold leading-7 text-gray-900">
                      {value.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                      <p className="flex-auto">{value.description}</p>
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </motion.div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Our Leadership Team
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Meet the dedicated professionals working to revolutionize the job search experience.
              </p>
            </div>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
            >
              {team.map((person) => (
                <motion.li
                  key={person.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 rounded-2xl p-8"
                >
                  <img
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                    src={person.image}
                    alt={person.name}
                  />
                  <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900 text-center">
                    {person.name}
                  </h3>
                  <p className="text-sm leading-6 text-gray-600 text-center">{person.role}</p>
                  <p className="mt-4 text-sm italic text-gray-500 text-center">"{person.quote}"</p>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-600">
          <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to start your journey?
                <br />
                Join our community today.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
                Whether you're looking for your next career move or searching for top talent,
                we're here to help you succeed.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/signup"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
                >
                  Get started
                </Link>
                <Link
                  to="/contact"
                  className="text-sm font-semibold leading-6 text-white flex items-center"
                >
                  Contact us <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout> // Closing Layout component here
  );
}
