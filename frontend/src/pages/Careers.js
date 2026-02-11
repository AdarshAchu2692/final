import { Navigation } from '../components/Navigation';
import { Briefcase, Code, Palette, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Careers() {
  const positions = [
    {
      id: 1,
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      icon: Code
    },
    {
      id: 2,
      title: 'Product Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      type: 'Full-time',
      icon: Palette
    },
    {
      id: 3,
      title: 'Community Growth Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4" data-testid="careers-title">
              Join Our Team
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Help us build the future of community-driven personal transformation
            </p>
          </div>

          <div className="space-y-6 mb-16" data-testid="careers-list">
            {positions.map((position) => {
              const Icon = position.icon;
              return (
                <div
                  key={position.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <Icon className="text-blue-400" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-2">{position.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
                          <span>{position.department}</span>
                          <span>•</span>
                          <span>{position.location}</span>
                          <span>•</span>
                          <span>{position.type}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      disabled
                      className="bg-zinc-800 text-white rounded-full px-6 hover:bg-zinc-700 transition-all whitespace-nowrap"
                    >
                      Apply (Soon)
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-3xl p-12">
            <div className="text-center">
              <Briefcase className="text-blue-400 mx-auto mb-6" size={48} />
              <h2 className="text-3xl font-bold mb-4">More Opportunities Coming</h2>
              <p className="text-lg text-zinc-400 mb-6 max-w-2xl mx-auto">
                We're rapidly growing! Check back soon for more exciting career opportunities
                or reach out to careers@biddge.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
