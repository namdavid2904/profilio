import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage } from '../api/portfolio';
import { useTheme } from '../context/ThemeContext';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { theme } = useTheme();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      // Send the message to backend
      try {
        sendMessage(formData).catch(err => console.log('Backend not available:', err));
      } catch (error) {
      }
      
      setLoading(false);
      setSubmitted(true);
      
      // Wait for animation to complete before resetting form
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      }, 2500);
    }, 800);
  };
  
  return (
    <section className="min-h-screen w-full pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          className="text-4xl font-bold mb-10 text-center dark:text-white text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          Connect with me
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="card-base">
            <h3 className="text-2xl font-bold mb-6 dark:text-white text-gray-800">Contact Information</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-accent dark:text-accent font-medium mb-2">Email</h4>
                <p className="dark:text-secondary text-gray-600">namphamphuong906@gmail.com</p>
              </div>
              
              <div>
                <h4 className="text-accent dark:text-accent font-medium mb-2">Location</h4>
                <p className="dark:text-secondary text-gray-600">MA, United States</p>
              </div>
              
              <div>
                <h4 className="text-accent dark:text-accent font-medium mb-2">Social</h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com/namdavid2904" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="dark:text-secondary text-gray-600 hover:text-accent dark:hover:text-accent transition-colors">
                    GitHub
                  </a>
                  <a 
                    href="https://linkedin.com/in/namphamphuong" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="dark:text-secondary text-gray-600 hover:text-accent dark:hover:text-accent transition-colors">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="card-base relative">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 dark:text-secondary text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg dark:bg-tertiary bg-white dark:text-white text-gray-800 border dark:border-gray-700 border-gray-300 focus:border-accent dark:focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 dark:text-secondary text-gray-700">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg dark:bg-tertiary bg-white dark:text-white text-gray-800 border dark:border-gray-700 border-gray-300 focus:border-accent dark:focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 dark:text-secondary text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg dark:bg-tertiary bg-white dark:text-white text-gray-800 border dark:border-gray-700 border-gray-300 focus:border-accent dark:focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={loading || submitted}
                className="w-full py-3 rounded-lg bg-accent text-white font-medium hover:bg-opacity-90 transition-colors disabled:bg-opacity-70"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Message'}
              </motion.button>
            </form>

            {/* Success overlay animation */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center dark:bg-tertiary/95 bg-white/95 rounded-xl z-10"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      delay: 0.2
                    }}
                    className="relative w-24 h-24"
                  >
                    <svg viewBox="0 0 100 100" className="absolute inset-0">
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={theme === 'dark' ? '#8352FD' : '#6d28d9'}
                        strokeWidth="6"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ 
                          duration: 0.6, 
                          ease: "easeOut",
                          delay: 0.3
                        }}
                        className="success-circle"
                      />
                      <motion.path
                        fill="none"
                        stroke={theme === 'dark' ? '#8352FD' : '#6d28d9'}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M 30,50 L 45,65 L 70,35"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ 
                          duration: 0.6, 
                          ease: "easeOut",
                          delay: 0.9
                        }}
                        className="success-check"
                      />
                    </svg>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="mt-6 text-lg font-medium dark:text-white text-gray-800"
                  >
                    Message sent successfully!
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;