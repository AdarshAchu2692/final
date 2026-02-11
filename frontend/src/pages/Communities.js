import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { CommunityCard } from '../components/CommunityCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, PlusCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const API = BACKEND_URL;

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agentState, setAgentState] = useState('checking'); // 'checking', 'sleeping', 'waking', 'awake', 'empty', 'error'
  const [user, setUser] = useState(null);

  // Check if user is logged in and get user data
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
    checkBackendStatus();
  }, []);

  useEffect(() => {
    if (searchQuery && communities.length > 0) {
      const filtered = communities.filter(
        (community) =>
          community.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCommunities(filtered);
    } else {
      setFilteredCommunities(communities);
    }
  }, [searchQuery, communities]);

  const checkBackendStatus = async () => {
    try {
      setAgentState('checking');
      setLoading(true);
      
      console.log('🔍 Checking Emergent backend status...');
      
      await axios.get(`${API}/test`, { 
        timeout: 3000,
        validateStatus: (status) => status < 500
      });
      
      console.log('✅ Backend is awake!');
      setAgentState('awake');
      fetchCommunities();
      
    } catch (error) {
      console.log('⏰ Backend is sleeping:', error.message);
      setAgentState('sleeping');
      setLoading(false);
      setError(null);
    }
  };

  const wakeBackend = async () => {
    try {
      setAgentState('waking');
      setLoading(true);
      
      console.log('⏰ Waking up Emergent backend...');
      
      await axios.get(`${API}/test`, { 
        timeout: 15000
      });
      
      console.log('✅ Backend is now awake!');
      setAgentState('awake');
      fetchCommunities();
      
    } catch (error) {
      console.error('❌ Failed to wake backend:', error.message);
      setAgentState('sleeping');
      setLoading(false);
    }
  };

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${API}/communities`, {
        timeout: 10000
      });
      
      const communitiesData = response.data || [];
      
      if (communitiesData.length === 0) {
        setAgentState('empty');
        setCommunities([]);
        setFilteredCommunities([]);
      } else {
        setAgentState('awake');
        setCommunities(communitiesData);
        setFilteredCommunities(communitiesData);
      }
      
    } catch (error) {
      console.error('❌ Error fetching communities:', error);
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout') || error.response?.status === 503) {
        setAgentState('sleeping');
      } else {
        setAgentState('error');
        setError('Failed to load communities');
      }
    } finally {
      setLoading(false);
    }
  };

  // Render based on agent state
  const renderContent = () => {
    // Loading states
    if (loading && agentState !== 'sleeping') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-zinc-900/50 rounded-3xl animate-pulse" />
          ))}
        </div>
      );
    }

    // Agent is sleeping - SHOW WAKE BUTTON
    if (agentState === 'sleeping') {
      return (
        <div className="text-center py-24 max-w-3xl mx-auto">
          <div className="w-32 h-32 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-6xl">⏰</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Backend is Sleeping
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Your Emergent agent is hibernating to save resources.
          </p>
          <div className="bg-zinc-900/50 rounded-2xl p-8 mb-8 border border-white/5">
            <p className="text-zinc-300 mb-4">
              <span className="text-yellow-400 font-semibold">⚠️ This is normal for Emergent sandbox</span>
              <br />
              The agent automatically sleeps after ~15 minutes of inactivity.
            </p>
            <p className="text-zinc-400 text-sm mb-6">
              When you press "Wake Agent", the backend will start up (takes 5-10 seconds)
              and your communities will appear immediately.
            </p>
          </div>
          <button
            onClick={wakeBackend}
            disabled={loading}
            className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Waking up...
              </>
            ) : (
              <>
                <span>🔋</span>
                Wake Agent
              </>
            )}
          </button>
          <p className="text-zinc-600 text-sm mt-4">
            After waking, communities will load automatically
          </p>
        </div>
      );
    }

    // Agent is waking up
    if (agentState === 'waking') {
      return (
        <div className="text-center py-24">
          <div className="animate-pulse">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl">⏳</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Waking Up Backend...
            </h2>
            <p className="text-xl text-zinc-400 mb-4">
              This takes 5-10 seconds
            </p>
            <div className="max-w-md mx-auto">
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-3/4 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Database is empty
    if (agentState === 'empty' || (agentState === 'awake' && communities.length === 0)) {
      return (
        <div className="text-center py-24">
          <div className="w-32 h-32 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-6xl">🏝️</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            No Communities Yet
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Be the first to create a community!
          </p>
          {user?.is_creator ? (
            <Link to="/create-community">
              <Button className="bg-primary text-white rounded-xl px-8 py-4 text-lg hover:bg-primary/90 transition-all">
                <PlusCircle className="mr-2" size={20} />
                Create Community
              </Button>
            </Link>
          ) : (
            <Link to="/login" state={{ from: '/create-community' }}>
              <Button className="bg-primary text-white rounded-xl px-8 py-4 text-lg hover:bg-primary/90 transition-all">
                Login to Create
              </Button>
            </Link>
          )}
        </div>
      );
    }

    // Error state
    if (agentState === 'error') {
      return (
        <div className="text-center py-24">
          <div className="w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-6xl">❌</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Something Went Wrong
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            {error || 'Failed to load communities'}
          </p>
          <button
            onClick={checkBackendStatus}
            className="px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      );
    }

    // Communities loaded successfully - SHOW ALL COMMUNITIES
    if (communities.length > 0) {
      return (
        <>
          {/* Header with title and create button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white" data-testid="communities-title">
                All Communities
              </h1>
              <p className="text-lg text-zinc-400">
                Discover {communities.length} communities on Biddge
              </p>
            </div>
            
            {/* CREATE COMMUNITY BUTTON - Only shows when awake */}
            {agentState === 'awake' && (
              <div className="mt-4 md:mt-0">
                {user?.is_creator ? (
                  <Link to="/create-community">
                    <Button className="bg-primary text-white rounded-xl px-6 py-6 hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                      <PlusCircle size={20} />
                      <span>Create Community</span>
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login" state={{ from: '/create-community' }}>
                    <Button className="bg-zinc-800 text-white rounded-xl px-6 py-6 hover:bg-zinc-700 transition-all flex items-center gap-2 border border-white/10">
                      <PlusCircle size={20} />
                      <span>Login to Create</span>
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <Input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-zinc-900/50 border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl h-14 text-white placeholder:text-zinc-500"
              data-testid="search-input"
            />
          </div>

          {/* Results count */}
          <div className="mb-4 text-zinc-400">
            Showing {filteredCommunities.length} of {communities.length} communities
          </div>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="communities-list">
            {filteredCommunities.map((community, index) => (
              <CommunityCard 
                key={community.id || community._id || `community-${index}`} 
                community={community} 
                index={index} 
              />
            ))}
          </div>

          {/* Creator Info Banner - Only show for non-creators */}
          {agentState === 'awake' && user && !user.is_creator && communities.length > 0 && (
            <div className="mt-12 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl p-6 border border-primary/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <PlusCircle size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Want to create your own community?</h3>
                    <p className="text-zinc-400">Register as a creator to start building your tribe</p>
                  </div>
                </div>
                <Link to="/login" state={{ from: '/create-community' }}>
                  <Button className="bg-primary text-white rounded-xl px-6 py-3 hover:bg-primary/90 transition-all whitespace-nowrap">
                    Become a Creator
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}