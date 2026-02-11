import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Navigation } from '../components/Navigation';
import { toast } from 'sonner';
import { Sparkles, Mail, Lock, User, Users } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const API = BACKEND_URL;

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    is_creator: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${API}${endpoint}`, formData);
      
      const { token, ...userData } = response.data;
      
      // Save token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      
      // Redirect to original page or home
      navigate(from, { replace: true });
      
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      is_creator: false
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <div className="relative pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.15)_0%,_rgba(10,10,10,0)_70%)]" />
        
        <div className="max-w-md mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-sm text-zinc-300">
                  {isLogin ? 'Welcome Back' : 'Join Biddge'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h1>
              <p className="text-zinc-400">
                {isLogin 
                  ? 'Welcome back! Please enter your details' 
                  : 'Start your transformation journey today'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                      placeholder="Enter your name"
                      className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* CREATOR TOGGLE - ONLY FOR REGISTER */}
              {!isLogin && (
                <div className="bg-zinc-900/80 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="is_creator"
                            checked={formData.is_creator}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`block w-14 h-8 rounded-full transition-colors ${
                            formData.is_creator ? 'bg-primary' : 'bg-zinc-700'
                          }`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                            formData.is_creator ? 'translate-x-6' : ''
                          }`}></div>
                        </div>
                        <div className="ml-3">
                          <span className="text-sm font-medium text-white">
                            Register as Creator
                          </span>
                          <p className="text-xs text-zinc-400">
                            Creators can build and manage communities
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white rounded-xl py-6 text-base hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Toggle between Login/Register */}
            <div className="mt-6 text-center">
              <p className="text-zinc-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-2 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Creator Info - Only show on Login page */}
            {isLogin && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <Users size={16} className="text-primary" />
                  <p>
                    Want to create communities?{' '}
                    <button
                      onClick={() => {
                        setIsLogin(false);
                        setFormData({ ...formData, name: '', password: '', is_creator: true });
                      }}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Register as Creator
                    </button>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}