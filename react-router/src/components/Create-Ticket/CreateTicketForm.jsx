import React, { useState } from 'react';
import Card from '../Card/Card';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export const CreateTicketForm = ({ setActiveView }) => {
  const getUserInfo = () => {
    try {
      const userEmail = localStorage.getItem("userEmail") || "";
      const username = localStorage.getItem("username") || "";
      return { email: userEmail, username };
    } catch (error) {
      console.error("Error retrieving user info:", error);
      return { email: "", username: "" };
    }
  };

  const { email, username } = getUserInfo();

  // Ensuring initial state values to prevent uncontrolled input errors
  const [subject, setSubject] = useState("");
  const [issue, setIssue] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const API_CREATE_TICKET = import.meta.env.VITE_CREATE_TICKET;

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!subject || !issue || !category || !priority) {
      setError("All fields are required.");
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      setError("Unauthorized! Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        API_CREATE_TICKET,
        { subject, issue, category, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Ticket created successfully!");
      setTimeout(() => {
        setSuccess("");
      }, 5000);
      setSubject("");
      setIssue("");
      setCategory("");
      setPriority("");
    } catch (err) {
      console.error("Creation error:", err.response?.data || err);
      setError(err.response?.data?.message || "Error creating ticket.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
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
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const alertVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          className="text-2xl font-bold text-gray-800"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Create New Ticket
        </motion.h1>
        <motion.button
          onClick={() => setActiveView("dashboard")}
          className="border-2 border-[#432dd7] hover:bg-[#432da1] font-semibold text-gray-800 hover:text-white px-10 py-1.5 rounded-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Dashboard
        </motion.button>
      </div>
      <motion.h5 
        className="font-stretch-100% text-gray-800 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        A new ticket is being created by <b>{username}</b> having mail-id: <b>{email}</b>
      </motion.h5>
      
      <Card title="Ticket Details">
        <motion.form 
          onSubmit={handleCreateTicket} 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            Fields marked with (*) are mandatory
          </motion.div>
          
          <AnimatePresence>
            {success && (
              <motion.div 
                className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-md"
                variants={alertVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                ✅ {success}
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md"
                variants={alertVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                ❌ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title*
            </label>
            <motion.input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Brief description of the issue"
              whileFocus={{ boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.2)" }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category*
            </label>
            <motion.select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              whileFocus={{ boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.2)" }}
            >
              <option value="">Select a category</option>
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="network">Network</option>
              <option value="account access">Account Access</option>
              <option value="other">Other</option>
            </motion.select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority*
            </label>
            <motion.select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              whileFocus={{ boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.2)" }}
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </motion.select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <motion.textarea
              rows="4"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Please provide detailed information about the issue"
              whileFocus={{ boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.2)" }}
            ></motion.textarea>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments
            </label>
            <motion.div 
              className="border border-dashed border-gray-300 rounded-md p-6 text-center"
              whileHover={{ 
                borderColor: "#4F46E5", 
                backgroundColor: "rgba(79, 70, 229, 0.05)" 
              }}
            >
              <p className="text-sm text-gray-500">
                Drag and drop files here, or click to select files
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex justify-end space-x-4"
            variants={itemVariants}
          >
            <motion.button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-4 py-2 bg-indigo-700 rounded-md text-sm font-medium text-white hover:bg-indigo-800"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              Submit Ticket
            </motion.button>
          </motion.div>
        </motion.form>
      </Card>
    </motion.div>
  );
};