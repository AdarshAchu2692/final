import { Navigation } from '../components/Navigation';
import { Target, Users, Zap, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6" data-testid="about-title">
              About Biddge
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              We're building the world's most powerful life transformation platform, connecting
              people with communities that help them become the best version of themselves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <Target className="text-blue-400 mb-4" size={32} />
              <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
              <p className="text-zinc-400 leading-relaxed">
                To empower individuals through meaningful connections and transformative
                communities that drive real personal growth.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <Zap className="text-violet-400 mb-4" size={32} />
              <h3 className="text-2xl font-semibold mb-3">Our Vision</h3>
              <p className="text-zinc-400 leading-relaxed">
                A world where everyone has access to the communities and resources they need
                to achieve their full potential.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-3xl p-12 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Biddge?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Users className="text-blue-400 mb-3" size={28} />
                <h4 className="text-xl font-semibold mb-2">Diverse Communities</h4>
                <p className="text-zinc-400">
                  From career growth to fitness, find communities that match your interests
                  and goals.
                </p>
              </div>
              <div>
                <Heart className="text-violet-400 mb-3" size={28} />
                <h4 className="text-xl font-semibold mb-2">Real Connections</h4>
                <p className="text-zinc-400">
                  Build meaningful relationships with like-minded individuals who support
                  your journey.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Join Us Today</h2>
            <p className="text-lg text-zinc-400">
              Be part of a growing community of over 100,000+ members transforming their lives
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
