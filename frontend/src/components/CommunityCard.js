import { Link } from 'react-router-dom';

export const CommunityCard = ({ community, index }) => {
  const communityId = community.id || community._id || `community-${index}`;
  
  // Handle missing fields with defaults
  const name = community.name || 'Unnamed Community';
  const description = community.description || 'No description available';
  const category = community.category || 'Uncategorized';
  const memberCount = community.member_count || community.members || 0;
  const imageUrl = community.image_url || community.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800';

  return (
    <Link to={`/communities/${communityId}`} className="block h-full">
      <div className="bg-zinc-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
        <img 
          src={imageUrl}
          alt={name}
          className="w-full h-24 sm:h-48 object-cover rounded-xl sm:rounded-2xl mb-3 sm:mb-4"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800';
          }}
        />
        <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2 line-clamp-1">
          {name}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 mb-3 sm:mb-4 line-clamp-2 flex-grow">
          {description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xs sm:text-sm text-zinc-500">
            👥 {memberCount.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full truncate max-w-[100px] sm:max-w-[150px]">
            {category}
          </span>
        </div>
      </div>
    </Link>
  );
};

