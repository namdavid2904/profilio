import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sendMessage } from '../api/portfolio';

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
          className="text-4xl font-bold mb-10 text-center"
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
            className="bg-tertiary p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-[#8352FD] font-medium mb-2">Email</h4>
                <p className="text-secondary">namphamphuong906@gmail.com</p>
              </div>
              
              <div>
                <h4 className="text-[#8352FD] font-medium mb-2">Location</h4>
                <p className="text-secondary">MA, United States</p>
              </div>
              
              <div>
                <h4 className="text-[#8352FD] font-medium mb-2">Social</h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com/namdavid2904" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-white transition-colors">
                    GitHub
                  </a>
                  <a 
                    href="https://linkedin.com/in/namphamphuong" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-white transition-colors">
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
            transition={{ delay: 0.4, duration: 0.5 }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-tertiary text-white border border-gray-700 focus:border-[#8352FD] focus:outline-none"/>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-tertiary text-white border border-gray-700 focus:border-[#8352FD] focus:outline-none"/>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-tertiary text-white border border-gray-700 focus:border-[#8352FD] focus:outline-none"/>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#8352FD] text-white font-medium hover:bg-opacity-90 transition-colors disabled:bg-opacity-70">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
              
              {status.message && (
                <div className={`mt-4 p-3 rounded-lg ${status.type === 'success' ? 'bg-green-900 bg-opacity-20 text-green-300' : 'bg-red-900 bg-opacity-20 text-red-300'}`}>
                  {status.message}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;