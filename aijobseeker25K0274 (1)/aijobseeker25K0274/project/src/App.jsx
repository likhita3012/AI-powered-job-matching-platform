import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Companies } from './pages/Companies'; // Corrected import here
import AdminSidebar from './admin/AdminSidebar';
import EmployeeSidebar from './employeer/EmployeeSidebar';
import { Import } from 'lucide-react';
import JobSeekerSidebar from './jobseeker/JobSeekerSidebar';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in by looking at localStorage
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    setIsLoggedIn(!!(token && userRole));
  };

  // Run the login check on component mount and whenever localStorage changes
  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <Router>
      {/* Conditionally render Navbar only when the user is logged in */}
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/companies" element={<Companies />} />
        
        {/* Admin Sidebar with dynamic route */}
        <Route path="/admin/:id" element={<AdminSidebar />} />
        <Route path="/employeer/:id" element={<EmployeeSidebar />} />
        <Route path="/jobseeker/:id" element={<JobSeekerSidebar />}/>
        
      </Routes>
    </Router>
  );
}

export default App;
