import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Navigation } from '../components/Navigation';
import { CommunityCard } from '../components/CommunityCard';
import { Button } from '../components/ui/button';
import { ArrowRight, Sparkles, PlusCircle, Smartphone } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const API = BACKEND_URL;

export default function Home() {
  const [featuredCommunities, setFeaturedCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // App store links - UPDATE THESE WITH YOUR ACTUAL LINKS
  const APP_STORE_LINK = "https://apps.apple.com/your-app-id";
  const PLAY_STORE_LINK = "https://play.google.com/store/apps/details?id=your.app.id";

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  useEffect(() => {
    fetchFeaturedCommunities();
  }, []);

  const fetchFeaturedCommunities = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching featured communities from:', `${API}/communities/featured`);
      
      const response = await axios.get(`${API}/communities/featured`, {
        timeout: 8000
      });
      
      console.log('✅ Featured communities:', response.data?.length || 0);
      setFeaturedCommunities(response.data || []);
      setError(null);
    } catch (error) {
      console.error('❌ Error fetching featured communities:', error);
      setError('Failed to load communities');
      
      // Fallback to regular communities if featured endpoint fails
      try {
        console.log('⚠️ Falling back to regular communities');
        const fallbackResponse = await axios.get(`${API}/communities`, {
          timeout: 8000
        });
        setFeaturedCommunities((fallbackResponse.data || []).slice(0, 6));
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.15)_0%,_rgba(10,10,10,0)_70%)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-sm text-zinc-300">Transform Your Life Today</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white" data-testid="hero-title">
              A better you
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                every day
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed" data-testid="hero-subtitle">
              Be part of the world's most powerful life transformation platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/membership">
                <Button
                  size="lg"
                  className="bg-primary text-white rounded-full px-8 py-6 text-base hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                  data-testid="become-member-button"
                >
                  Become a Member
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
              <Link to="/communities">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white rounded-full px-8 py-6 text-base hover:bg-white/10 transition-all"
                  data-testid="explore-communities-button"
                >
                  Explore Communities
                </Button>
              </Link>
              
              {/* Create Community Button - Shows differently based on auth status */}
              {user?.is_creator ? (
                <Link to="/create-community">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/50 text-primary rounded-full px-8 py-6 text-base hover:bg-primary/10 transition-all"
                  >
                    <PlusCircle className="mr-2" size={18} />
                    Create Community
                  </Button>
                </Link>
              ) : (
                <Link to="/login" state={{ from: '/create-community' }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/50 text-primary rounded-full px-8 py-6 text-base hover:bg-primary/10 transition-all"
                  >
                    <PlusCircle className="mr-2" size={18} />
                    Create Community
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Communities Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-transparent to-zinc-950/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-white" data-testid="popular-communities-title">
                Popular Communities
              </h2>
              <p className="text-lg text-zinc-400">
                Join thousands of like-minded individuals
              </p>
            </div>
            
            <Link to="/communities" className="mt-4 md:mt-0">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 hover:bg-primary/10 transition-all"
              >
                View all communities
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-zinc-900/50 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-zinc-400">{error}</p>
              <button 
                onClick={fetchFeaturedCommunities}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          ) : featuredCommunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400">No communities found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="communities-grid">
              {featuredCommunities.map((community, index) => (
                <CommunityCard 
                  key={community.id || community._id || `featured-${index}`} 
                  community={community} 
                  index={index} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

     {/* Creator Call-to-Action Section - REDUCED SIZE */}
<section className="py-16 md:py-20 px-6 md:px-12 lg:px-24">
  <div className="max-w-4xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-primary/20 via-purple-600/20 to-pink-600/20 rounded-2xl p-8 md:p-10 border border-white/10 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_0%,_transparent_70%)]" />
      
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <PlusCircle size={32} className="text-primary" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Want to start your own community?
        </h2>
        
        <p className="text-base md:text-lg text-zinc-300 mb-6 max-w-xl mx-auto">
          Become a creator and build your tribe. Share your passion, knowledge, and connect with like-minded people.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {user?.is_creator ? (
            <Link to="/create-community">
              <Button
                className="bg-primary text-white rounded-full px-6 py-5 text-sm hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                Create a Community
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login" state={{ from: '/create-community' }}>
                <Button
                  className="bg-primary text-white rounded-full px-6 py-5 text-sm hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                >
                  Register as Creator
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
              <Link to="/communities">
                <Button
                  variant="outline"
                  className="border-white/20 text-white rounded-full px-6 py-5 text-sm hover:bg-white/10 transition-all"
                >
                  Explore Communities
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {!user?.is_creator && (
          <p className="text-zinc-400 text-xs mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </motion.div>
  </div>
</section>

      {/* App Download Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-transparent to-zinc-950/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* App Poster Image - Load from local assets folder */}
            <div className="relative w-full max-w-2xl mx-auto mb-8 rounded-3xl overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-r from-primary/30 to-purple-600/30 border border-white/10 rounded-3xl flex items-center justify-center">
                <img 
                  src={require('./assets/app-poster.jpg')} 
                  alt="App Poster" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&auto=format&fit=crop"; // Fallback image
                  }}
                />
              </div>
            </div>
            
            {/* Download Text */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <Smartphone className="text-primary" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Download the app now
              </h2>
            </div>
            
            {/* App Store Buttons with Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={APP_STORE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="bg-white text-black rounded-xl px-8 py-6 text-base hover:bg-white/90 transition-all flex items-center gap-3 w-full sm:w-auto"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="flex flex-col items-start">
                    <span className="text-xs">Download on the</span>
                    <span className="text-lg font-semibold">App Store</span>
                  </span>
                </Button>
              </a>
              
              <a 
                href={PLAY_STORE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="bg-white text-black rounded-xl px-8 py-6 text-base hover:bg-white/90 transition-all flex items-center gap-3 w-full sm:w-auto"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.61 2.71C3.24 2.87 3 3.24 3 3.65v16.7c0 .41.24.78.61.94l.07.03L13 12 3.61 2.71zm13.78 6.69l-3.73-2.16L7.7 15.34l10.69-5.94c.44-.24.69-.68.69-1.16 0-.48-.25-.92-.69-1.16zm.28 5.2l-3.73-2.16-2.64 2.87 2.64 2.87 3.73-2.16c.44-.24.69-.68.69-1.16 0-.48-.25-.92-.69-1.16z"/>
                  </svg>
                  <span className="flex flex-col items-start">
                    <span className="text-xs">Get it on</span>
                    <span className="text-lg font-semibold">Google Play</span>
                  </span>
                </Button>
              </a>
            </div>
            
            {/* Small text */}
            <p className="text-zinc-500 text-sm mt-6">
              Available on iOS and Android devices
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}