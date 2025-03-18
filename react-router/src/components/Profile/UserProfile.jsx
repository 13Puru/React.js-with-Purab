import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Briefcase, Shield, Calendar, Edit2, Camera } from "lucide-react";
import Card from "../Card/Card";
import { motion } from "framer-motion";

const UserProfile = ({setActiveView}) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching profile data from API
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from your API
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        
        // Mock profile data
        const mockProfile = {
          id: "usr_12345",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+1 (555) 987-6543",
          role: "agent",
          department: "Customer Service",
          avatar: null, // Would be an image URL in production
          joinDate: "2023-06-15",
          lastActive: "2025-03-17T14:30:00Z",
          ticketsCreated: 24,
          ticketsResolved: 187
        };
        
        setProfileData(mockProfile);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Function to render the appropriate role badge
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <div className="flex items-center text-purple-700 bg-purple-50 px-3 py-1 rounded-full text-sm">
            <Shield size={16} className="mr-1" />
            Administrator
          </div>
        );
      case "agent":
        return (
          <div className="flex items-center text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-sm">
            <User size={16} className="mr-1" />
            Support Agent
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm">
            <User size={16} className="mr-1" />
            Standard User
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        </div>
        <Card>
          <div className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setActiveView("dashboard")} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Profile Summary Card */}
        <motion.div variants={itemVariants} className="md:col-span-1">
          <Card>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
                  {profileData.avatar ? (
                    <img 
                      src={profileData.avatar} 
                      alt={profileData.name} 
                      className="w-24 h-24 rounded-full object-cover" 
                    />
                  ) : (
                    <User size={40} className="text-indigo-400" />
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full shadow-lg"
                >
                  <Camera size={16} />
                </motion.button>
              </div>
              
              <h2 className="text-xl font-semibold mt-2">{profileData.name}</h2>
              <div className="mt-2">{getRoleBadge(profileData.role)}</div>
              
              <div className="mt-4 w-full">
                <div className="flex items-center py-2 border-b border-gray-100">
                  <Mail size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{profileData.email}</span>
                </div>
                <div className="flex items-center py-2 border-b border-gray-100">
                  <Phone size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{profileData.phone}</span>
                </div>
                <div className="flex items-center py-2 border-b border-gray-100">
                  <Briefcase size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{profileData.department}</span>
                </div>
                <div className="flex items-center py-2">
                  <Calendar size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Joined {new Date(profileData.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-6 w-full px-4 py-2 bg-indigo-700 rounded-md text-sm font-medium text-white hover:bg-indigo-800 flex items-center justify-center"
                onClick={() => navigate("/edit-profile")}
              >
                <Edit2 size={16} className="mr-2" />
                Edit Profile
              </motion.button>
            </div>
          </Card>
        </motion.div>

        {/* Activity and Stats */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
              
              <div className="space-y-6">
                {/* Last Active */}
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="p-3 bg-green-100 rounded-full">
                    <Calendar size={20} className="text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-800">Last Active</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(profileData.lastActive).toLocaleDateString()} at{" "}
                      {new Date(profileData.lastActive).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div
                    variants={itemVariants} 
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <h4 className="text-sm text-gray-500">Tickets Created</h4>
                    <div className="mt-2 flex items-end">
                      <span className="text-2xl font-bold text-gray-800">{profileData.ticketsCreated}</span>
                      <span className="ml-2 text-xs text-gray-500">All time</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    variants={itemVariants} 
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <h4 className="text-sm text-gray-500">Tickets Resolved</h4>
                    <div className="mt-2 flex items-end">
                      <span className="text-2xl font-bold text-green-600">{profileData.ticketsResolved}</span>
                      {profileData.role !== "user" && (
                        <span className="ml-2 text-xs text-gray-500">All time</span>
                      )}
                    </div>
                  </motion.div>
                </div>
                
                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {/* In a real app, you would map over real activity data */}
                    {[1, 2, 3].map((item) => (
                      <motion.div 
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: item * 0.1 }}
                        className="flex items-start p-3 border-b border-gray-100"
                      >
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                        <div>
                          <p className="text-sm text-gray-800">
                            {item === 1 ? "Replied to ticket #5432" : 
                             item === 2 ? "Created new ticket #5438" : 
                             "Updated personal information"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item === 1 ? "2 hours ago" : 
                             item === 2 ? "Yesterday at 3:45 PM" : 
                             "3 days ago"}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserProfile;