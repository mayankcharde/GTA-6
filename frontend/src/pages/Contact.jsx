import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Subject: '',
    Message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[80rem] h-[50rem] 
          bg-yellow-500/10 rounded-full filter blur-[10rem] animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] 
          bg-yellow-600/10 rounded-full filter blur-[10rem] animate-float-slow-reverse"></div>
      </div>

      {/* Back Button */}
      <Link to="/" className="fixed top-8 left-8 z-50 p-4 rounded-full 
        bg-white/10 backdrop-blur-lg border border-white/20
        hover:bg-white/20 transition-all duration-300
        group">
        <i className="ri-arrow-left-line text-2xl group-hover:-translate-x-1 transition-transform"></i>
      </Link>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6
            bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 
            bg-clip-text text-transparent animate-gradient-x">
            Let's Connect
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions about GTA VI? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl p-8 rounded-2xl
            border border-white/10 hover:border-yellow-500/30
            transition-all duration-500">
            // ...existing form code with enhanced styling...
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Quick Links */}
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl
              border border-white/10 hover:border-yellow-500/30
              transition-all duration-500">
              <h3 className="text-2xl font-bold mb-6">Quick Links</h3>
              <div className="space-y-4">
                {[
                  { text: 'Support Center', icon: 'customer-service' },
                  { text: 'FAQs', icon: 'question' },
                  { text: 'Community', icon: 'team' },
                  { text: 'News', icon: 'newspaper' }
                ].map((item) => (
                  <a key={item.text} href="#" className="flex items-center gap-4 
                    text-gray-400 hover:text-white group transition-colors">
                    <span className="p-3 rounded-xl bg-white/5 
                      group-hover:bg-yellow-500/20 transition-colors">
                      <i className={`ri-${item.icon}-line`}></i>
                    </span>
                    {item.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-4">
              {['twitter', 'facebook', 'instagram', 'discord'].map((platform) => (
                <a key={platform} href="#" 
                  className="p-4 rounded-xl bg-white/5 backdrop-blur-xl
                    border border-white/10 hover:border-yellow-500/30
                    flex items-center gap-3 group
                    transition-all duration-300 hover:-translate-y-1">
                  <i className={`ri-${platform}-line text-2xl 
                    text-gray-400 group-hover:text-yellow-500
                    transition-colors`}></i>
                  <span className="capitalize text-gray-400 
                    group-hover:text-white transition-colors">
                    {platform}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
