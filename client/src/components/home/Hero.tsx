import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { assets } from "../../assets/assets";

export default function Hero() {
    const navigate = useNavigate();

    // Search input states
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [guests, setGuests] = useState("2");

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (location) params.append("location", location);
        if (date) params.append("date", date);
        if (guests) params.append("guests", guests);

        navigate(`/search?${params.toString()}`);
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img alt="Elegant Dining Room" className="w-full h-full object-cover brightness-70" src={assets.hero_bg_img} />
                <div className="abg-black/40 backdrop-blur-md border border-[#c9a96e]/30 rounded-lg p-4 flex items-center gap-4"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl px-6 md:px-10 text-center">
                <span className="text-sm text-secondary-container tracking-[0.45em] uppercase block mb-4">
                    TABLES, RESERVED WITH TASTE  
                </span>
                <h1 className="font-display text-4xl md:text-6xl text-white mb-12 max-w-3xl mx-auto leading-[1.15] font-medium tracking-tight drop-shadow-md">
                    Unforgettable Meals Start Here
                </h1>

                {/* Search Bar Component */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="bg-blacl/80 backdrop-blur-md border border-[#c9a96e] p-3 md:p-2 ambient max-w-6xl mx-auto flex flex-col md:flex-row gap-2"
                >
                    {/* Search Term / Cuisine */}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <Search className="text-outline-variant mr-3 shrink-0" size={18} />
                        <input
                            className="w-full bg-transparent text-white placeholder:text-white/50 border=[#c9a96e]/20 border-b-0 md:border-r focus:outline-none text-sm"
                            placeholder="Search cuisines, restaurants..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Location */}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <MapPin className="text-outline-variant mr-3 shrink-0" size={18} />
                        <input
                            className="w-full bg-transparent text-white placeholder:text-white/50 border=[#c9a96e]/20 border-b-0 md:border-r focus:outline-none text-sm"
                            placeholder="Location (e.g. Manhattan)"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    {/* Date */}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <Calendar className="text-outline-variant mr-3 shrink-0" size={18} />
                        <input
                            className="w-full bg-transparent text-white placeholder:text-white/50 border=[#c9a96e]/20 border-b-0 md:border-r focus:outline-none text-sm"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    {/* Guests */}
                    <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-outline-variant/30 px-4 py-3">
                        <Users className="text-outline-variant mr-3 shrink-0" size={18} />
                        <select
                            className="w-full bg-transparent text-white placeholder:text-black/50 border=[#c9a96e]/20 border-b-0 md:border-r focus:outline-none text-sm [&>option]:text-black"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                        >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="4">4 Guests</option>
                            <option value="6">6 Guests</option>
                            <option value="8">8 Guests</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-[#c9a96e] text-black text-xs tracking-widest uppercase px-8 py-4 md:py-3 hover:bg-[#b8975a] hover:text-white transition-soft cursor-pointer"
                    >
                        FIND A TABLE
                    </button>
                </form>
            </div>
        </section>
    );
}
