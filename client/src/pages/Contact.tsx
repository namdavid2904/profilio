import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sendMessage } from '../api/portfolio';
import { useTheme } from '../context/ThemeContext';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });
  
  const [loading, setLoading] = useState(false);
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
    
    try {
      await sendMessage(formData);
      
      setStatus({
        type: 'success',
        message: 'Thank you for your message! I will get back to you soon.',
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Sorry, something went wrong. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
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
            className="card-base gradient-border-card">
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
            className="card-base">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="form-label">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"/>
              </div>
              
              <div>
                <label htmlFor="email" className="form-label">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"/>
              </div>
              
              <div>
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="input-field"/>
              </div>
              
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg dark:bg-accent bg-accent text-white font-medium dark:hover:bg-opacity-90 hover:bg-opacity-90 transition-colors disabled:bg-opacity-70"
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
              
              {status.message && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-lg ${
                    status.type === 'success' 
                      ? 'dark:bg-green-900/20 bg-green-50 dark:text-green-300 text-green-800' 
                      : 'dark:bg-red-900/20 bg-red-50 dark:text-red-300 text-red-800'
                  }`}>
                  {status.message}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;