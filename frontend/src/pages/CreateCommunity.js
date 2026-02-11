import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const API = BACKEND_URL;

export default function CreateCommunity() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image_url: ''
  });

  // Check if user is logged in
  const token = localStorage.getItem('token');
  
  // If not logged in, redirect to login
  if (!token) {
    toast.error('Please login to create a community');
    navigate('/login', { state: { from: '/create-community' } });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/communities`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        toast.success('Community created successfully!');
        navigate(`/communities/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error creating community:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login', { state: { from: '/create-community' } });
      } else if (error.response?.status === 403) {
        toast.error('Only creators can create communities');
      } else {
        toast.error('Failed to create community');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Create a Community
          </h1>
          <p className="text-zinc-400 mb-8">
            Start your own community and bring like-minded people together
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Community Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Tech Innovators"
                className="w-full bg-zinc-900/50 border-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Description *
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe what your community is about..."
                className="w-full bg-zinc-900/50 border-white/10 text-white min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Category *
              </label>
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., Technology, Health, Arts"
                className="w-full bg-zinc-900/50 border-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Cover Image URL (optional)
              </label>
              <Input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-zinc-900/50 border-white/10 text-white"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-white rounded-xl px-6 py-3 hover:bg-primary/90 transition-all flex-1"
              >
                {loading ? 'Creating...' : 'Create Community'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/communities')}
                className="border-white/20 text-white rounded-xl px-6 py-3 hover:bg-white/10 transition-all"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}