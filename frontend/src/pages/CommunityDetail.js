import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Users, ArrowLeft, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCommunity();
    if (token) {
      fetchUserData();
    }
  }, [id, token]);

  const fetchCommunity = async () => {
    try {
      const response = await axios.get(`${API}/communities/${id}`);
      setCommunity(response.data);
    } catch (error) {
      console.error('Error fetching community:', error);
      toast.error('Community not found');
      navigate('/communities');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJoinedCommunities(response.data.joined_communities || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleJoin = async () => {
    if (!token) {
      toast.error('Please login to join communities');
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      await axios.post(
        `${API}/communities/${id}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Successfully joined the community!');
      setJoinedCommunities([...joinedCommunities, id]);
      setCommunity({ ...community, member_count: community.member_count + 1 });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to join community');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    setActionLoading(true);
    try {
      await axios.post(
        `${API}/communities/${id}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Successfully left the community');
      setJoinedCommunities(joinedCommunities.filter((cid) => cid !== id));
      setCommunity({ ...community, member_count: community.member_count - 1 });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to leave community');
    } finally {
      setActionLoading(false);
    }
  };

  const isJoined = joinedCommunities.includes(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navigation />
        <div className="pt-32 flex items-center justify-center">
          <div className="animate-pulse text-zinc-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/communities')}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft size={20} />
            <span>Back to Communities</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {community.image_url && (
                <div className="rounded-3xl overflow-hidden mb-8 h-64 md:h-96">
                  <img
                    src={community.image_url}
                    alt={community.name}
                    className="w-full h-full object-cover"
                    data-testid="community-image"
                  />
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm px-4 py-2 rounded-full bg-white/5 text-zinc-400" data-testid="community-category">
                    {community.category}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="community-name">
                  {community.name}
                </h1>
                <p className="text-lg text-zinc-400 leading-relaxed" data-testid="community-description">
                  {community.description}
                </p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="text-blue-400" size={24} />
                    <div>
                      <p className="text-2xl font-bold" data-testid="member-count">{community.member_count}</p>
                      <p className="text-sm text-zinc-400">Members</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                    <UserIcon className="text-violet-400" size={24} />
                    <div>
                      <p className="text-sm text-zinc-400">Created by</p>
                      <p className="font-medium" data-testid="creator-name">{community.creator_name}</p>
                    </div>
                  </div>
                </div>

                {token && (
                  <Button
                    onClick={isJoined ? handleLeave : handleJoin}
                    disabled={actionLoading}
                    className={`w-full rounded-full h-12 transition-all ${
                      isJoined
                        ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                        : 'bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    }`}
                    data-testid={isJoined ? 'leave-button' : 'join-button'}
                  >
                    {actionLoading ? 'Processing...' : (isJoined ? 'Leave Community' : 'Join Community')}
                  </Button>
                )}

                {!token && (
                  <Button
                    onClick={() => navigate('/login')}
                    className="w-full bg-primary text-white rounded-full h-12 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    data-testid="login-to-join-button"
                  >
                    Login to Join
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
