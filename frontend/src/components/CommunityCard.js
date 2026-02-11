import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const CommunityCard = ({ community, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/communities/${community.id}`)}
      className="group relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer"
      data-testid={`community-card-${community.id}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-50 blur-3xl transition-opacity duration-500" />
      
      {community.image_url && (
        <div className="h-32 overflow-hidden">
          <img
            src={community.image_url}
            alt={community.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}
      
      <div className="p-6 relative z-10">
        <h3 className="text-xl font-medium mb-2" data-testid={`community-name-${community.id}`}>
          {community.name}
        </h3>
        <p className="text-sm text-zinc-400 mb-4 line-clamp-2" data-testid={`community-description-${community.id}`}>
          {community.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Users size={14} />
          <span data-testid={`community-members-${community.id}`}>{community.member_count} members</span>
        </div>
        <div className="mt-3">
          <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-zinc-400" data-testid={`community-category-${community.id}`}>
            {community.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};