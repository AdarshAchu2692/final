import { Navigation } from '../components/Navigation';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Events() {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Leaders Summit 2025',
      date: 'March 15, 2025',
      location: 'Virtual',
      attendees: 1200,
      category: 'Tech Community'
    },
    {
      id: 2,
      title: 'Startup Pitch Night',
      date: 'March 22, 2025',
      location: 'San Francisco, CA',
      attendees: 300,
      category: 'Startup Builders'
    },
    {
      id: 3,
      title: 'AI/ML Workshop Series',
      date: 'March 28, 2025',
      location: 'Virtual',
      attendees: 850,
      category: 'AI & ML Hub'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4" data-testid="events-title">
              Upcoming Events
            </h1>
            <p className="text-lg text-zinc-400">
              Connect, learn, and grow with community events (Coming Soon)
            </p>
          </div>

          <div className="space-y-6" data-testid="events-list">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-zinc-400">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">{event.title}</h3>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    disabled
                    className="bg-zinc-800 text-white rounded-full px-6 hover:bg-zinc-700 transition-all"
                  >
                    Register (Soon)
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-3xl p-12">
            <h2 className="text-3xl font-bold mb-4">Event System Coming Soon</h2>
            <p className="text-lg text-zinc-400 mb-6">
              We're building an amazing events platform for our communities. Stay tuned!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
