import { useState } from "react";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { Search, Filter, X, Calendar } from "lucide-react";

const Events = () => {
  const { events } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);

  const baseCategories = ["All", "Hackathon", "Workshop", "Competition", "Cultural", "Sports"];
  const dynamicCategories = [...new Set(events.map(event => event.category))];
  const categories = [...new Set([...baseCategories, ...dynamicCategories])];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.club.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesOpen = !showOnlyOpen || event.registrationOpen;
    return matchesSearch && matchesCategory && matchesOpen;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10">
      
      <PageHeader 
        title="Events Calendar" 
        description="Stay updated with the latest events, workshops, competitions, and performances happening across campus."
        icon={Calendar}
        variant="violet"
      />

      {/* Filters */}
      <section className="sticky top-16 md:top-20 z-40 py-6 md:py-8 bg-background/95 backdrop-blur-lg border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search events, clubs, or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-10 py-2.5 text-base"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <Button
                variant={showOnlyOpen ? "default" : "outline"}
                onClick={() => setShowOnlyOpen(!showOnlyOpen)}
                className="font-medium"
              >
                <Filter className="w-4 h-4 mr-1.5" />
                {showOnlyOpen ? "All Events" : "Open Only"}
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className="font-medium"
                >
                  <Filter className="w-4 h-4 mr-1.5" />
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 md:py-24 flex-1 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4">
          {filteredEvents.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-muted-foreground text-lg font-medium">
                  Showing <span className="text-accent font-bold">{filteredEvents.length}</span> {filteredEvents.length === 1 ? 'event' : 'events'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredEvents.map((event, index) => (
                  <div key={event.id} className={`smooth-in-delay-${Math.min(index + 1, 3)}`}>
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">No events found</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find the events you're looking for.
              </p>
              <Button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setShowOnlyOpen(false); }} size="lg">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
