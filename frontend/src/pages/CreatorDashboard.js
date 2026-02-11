import { useState } from 'react';
import axios from 'axios';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const categories = [
  'Career Growth',
  'Startup Builders',
  'AI & ML Hub',
  'Tech Community',
  'Fitness & Health',
  'Design Circle',
  'Marketing',
  'Finance',
  'Lifestyle',
  'Education',
  'Other'
];

const categoryImages = {
  'Career Growth': 'https://images.unsplash.com/photo-1758873269320-372f7ad170f0?crop=entropy&cs=srgb&fm=jpg&q=85',
  'Startup Builders': 'https://images.unsplash.com/photo-1758873269317-51888e824b28?crop=entropy&cs=srgb&fm=jpg&q=85',
  'AI & ML Hub': 'https://images.unsplash.com/photo-1749006590324-d6b2e90ab1c0?crop=entropy&cs=srgb&fm=jpg&q=85',
  'Tech Community': 'https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=srgb&fm=jpg&q=85',
  'Fitness & Health': 'https://images.unsplash.com/photo-1666979290238-2d862b573345?crop=entropy&cs=srgb&fm=jpg&q=85',
  'Design Circle': 'https://images.unsplash.com/photo-1763259109035-214a66cbd4c7?crop=entropy&cs=srgb&fm=jpg&q=85'
};

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image_url: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const communityData = {
      ...formData,
      image_url: formData.image_url || categoryImages[formData.category] || ''
    };

    try {
      const response = await axios.post(`${API}/communities`, communityData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Community created successfully!');
      navigate(`/communities/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create community');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" data-testid="creator-dashboard-title">
              Creator Dashboard
            </h1>
            <p className="text-lg text-zinc-400">
              Create and manage your own community
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <PlusCircle className="text-blue-400" size={32} />
              <h2 className="text-2xl font-semibold">Create New Community</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" data-testid="create-community-form">
              <div className="space-y-2">
                <Label htmlFor="name">Community Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Web3 Innovators"
                  className="bg-zinc-900/50 border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl h-12"
                  data-testid="community-name-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what your community is about..."
                  className="bg-zinc-900/50 border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl min-h-32"
                  data-testid="community-description-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl h-12 px-4 text-white"
                  data-testid="community-category-select"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL (Optional)</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="bg-zinc-900/50 border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl h-12"
                  data-testid="community-image-input"
                />
                <p className="text-sm text-zinc-500">
                  Leave empty to use a default image based on category
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white rounded-full h-12 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                data-testid="create-community-button"
              >
                {loading ? 'Creating...' : 'Create Community'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
