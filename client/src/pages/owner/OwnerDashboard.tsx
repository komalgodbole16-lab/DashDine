// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import { useAppContext } from "../../context/AppContext.tsx";
// import Navbar from "../../components/Navbar.tsx";
// import Footer from "../../components/Footer.tsx";
// import Loader from "../../components/Loader.tsx";
// import { CalendarIcon, SettingsIcon } from "lucide-react";
// import RestaurantWizard from "../../components/owner/RestaurantWizard.tsx";
// import PendingApproval from "../../components/owner/PendingApproval.tsx";
// import RequestRejected from "../../components/owner/RequestRejected.tsx";
// import OwnerBookings from "../../components/owner/OwnerBookings.tsx";
// import OwnerProfileDetails from "../../components/owner/OwnerProfileDetails.tsx";
// import api from "../../lib/api.ts";
// import toast from "react-hot-toast";

// export default function OwnerDashboard() {
//     const { logout } = useAppContext();
//     const [restaurant, setRestaurant] = useState<any>(null);
//     const [bookings, setBookings] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState<"bookings" | "details">("bookings");

//     const fetchOwnerData = async () => {
//         try {
//             setLoading(true);
//             const res = await api.get("/owner/restaurant")
//             setRestaurant(res.data)

//             if(res.data){
//                 if(res.data.status === "approved"){
//                     //Fetch bookings
//                     const bookingRes = await api.get("/owner/bookings")
//                     setBookings(bookingRes.data)
//                 }
//             }
//         } catch (error: any) {
//             toast.error(error?.response?.data?.message || "Failed to load dashboard data");
//         }finally{
//             setLoading(false)
//         }
//     };

//     useEffect(() => {
//         (async () => await fetchOwnerData())();
//     }, []);

//     if (loading) {
//         return <Loader text="Loading Owner Dashboard..." />;
//     }

//     return (
//         <div className="min-h-screen bg-surface flex flex-col pt-20">
//             <Navbar />

//             <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
//                 {/* Heading */}
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/10 pb-8 mb-8">
//                     <div>
//                         <h1 className="font-display text-2xl md:text-3xl text-primary">Restaurant Portal</h1>
//                         <p className="text-xs text-black/55 mt-1.5">Review capacity limits and process live reservations.</p>
//                     </div>
//                     <button
//                         onClick={logout}
//                         className="bg-error-container hover:bg-error-container/85 text-error px-4 py-2 text-[10px] font-medium tracking-widest uppercase transition-colors"
//                     >
//                         Sign Out
//                     </button>
//                 </div>

//                 {/* Case 1: No Restaurant Setup Profile */}
//                 {!restaurant ? (
//                     <RestaurantWizard setRestaurant={setRestaurant} />
//                 ) : restaurant.status === "pending" ? (
//                     /* Case 2: Profile Pending Approval */
//                     <PendingApproval restaurant={restaurant} />
//                 ) : restaurant.status === "rejected" ? (
//                     /* Case 3: Rejected */
//                     <RequestRejected restaurantName={restaurant.name} />
//                 ) : (
//                     /* Case 4: Approved - Full Dashboard Panel */
//                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//                         {/* Left Tab selector sidebar */}
//                         <aside className="lg:col-span-3 space-y-6 bg-white border border-outline-variant/20 p-6 rounded-md shadow-sm h-fit">
//                             <div className="flex items-center gap-3.5 border-b border-outline-variant/10 pb-5">
//                                 <span className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-base">
//                                     {restaurant.name.charAt(0)}
//                                 </span>
//                                 <div>
//                                     <h4 className="font-display font-medium text-primary text-base line-clamp-1">{restaurant.name}</h4>
//                                     <span className="text-[9px] text-secondary tracking-widest uppercase bg-secondary-container/20 px-2 py-0.5 rounded-sm inline-block mt-0.5">
//                                         APPROVED
//                                     </span>
//                                 </div>
//                             </div>

//                             <nav className="flex flex-col gap-1.5">
//                                 <button
//                                     onClick={() => setActiveTab("bookings")}
//                                     className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer transition-colors ${
//                                         activeTab === "bookings" ? "bg-primary text-white" : "text-black/55 hover:bg-surface"
//                                     }`}
//                                 >
//                                     <CalendarIcon size={14} />
//                                     Bookings ({bookings.length})
//                                 </button>

//                                 <button
//                                     onClick={() => setActiveTab("details")}
//                                     className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer transition-colors ${
//                                         activeTab === "details" ? "bg-primary text-white" : "text-black/55 hover:bg-surface"
//                                     }`}
//                                 >
//                                     <SettingsIcon size={14} />
//                                     Profile Details
//                                 </button>
//                             </nav>
//                         </aside>

//                         {/* Content Area */}
//                         <div className="lg:col-span-9 space-y-8">
//                             {/* Tab 1: Bookings List */}
//                             {activeTab === "bookings" && (
//                                 <OwnerBookings bookings={bookings} setBookings={setBookings} totalSeats={restaurant.totalSeats} />
//                             )}

//                             {/* Tab 3: Update details & slots capacity */}
//                             {activeTab === "details" && <OwnerProfileDetails restaurant={restaurant} setRestaurant={setRestaurant} />}
//                         </div>
//                     </div>
//                 )}
//             </main>

//             <Footer />
//         </div>
//     );
// }





/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext.tsx";
import Navbar from "../../components/Navbar.tsx";
import Footer from "../../components/Footer.tsx";
import Loader from "../../components/Loader.tsx";
import { CalendarIcon, SettingsIcon, PlusIcon } from "lucide-react";
import RestaurantWizard from "../../components/owner/RestaurantWizard.tsx";
import PendingApproval from "../../components/owner/PendingApproval.tsx";
import RequestRejected from "../../components/owner/RequestRejected.tsx";
import OwnerBookings from "../../components/owner/OwnerBookings.tsx";
import OwnerProfileDetails from "../../components/owner/OwnerProfileDetails.tsx";
import api from "../../lib/api.ts";
import toast from "react-hot-toast";

export default function OwnerDashboard() {
    const { logout } = useAppContext();
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"bookings" | "details">("bookings");
    const [showAddNew, setShowAddNew] = useState(false);

    const fetchOwnerData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/owner/restaurant")
            const list = Array.isArray(res.data) ? res.data : [];
            setRestaurants(list);

            if (list.length > 0) {
                // agar pehle se koi selected nahi hai, to pehla restaurant select karo
                setSelectedId((prev) => prev && list.some((r: any) => r._id === prev) ? prev : list[0]._id);
            }

            const bookingRes = await api.get("/owner/bookings")
            setBookings(bookingRes.data || [])
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load dashboard data");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        (async () => await fetchOwnerData())();
    }, []);

    if (loading) {
        return <Loader text="Loading Owner Dashboard..." />;
    }

    const selectedRestaurant = restaurants.find((r) => r._id === selectedId) || null;

    // Naya restaurant successfully create hote hi list mein add karo aur select karo
    const handleNewRestaurantCreated = (newRestaurant: any) => {
        setRestaurants((prev) => [...prev, newRestaurant]);
        setSelectedId(newRestaurant._id);
        setShowAddNew(false);
    };

    // Update hone par list mein us restaurant ko refresh karo
    const handleRestaurantUpdated = (updated: any) => {
        setRestaurants((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
    };

    const restaurantBookings = selectedRestaurant
        ? bookings.filter((b: any) => (b.restaurant?._id || b.restaurant) === selectedRestaurant._id)
        : [];

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />

            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/10 pb-8 mb-8">
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl text-primary">Restaurant Portal</h1>
                        <p className="text-xs text-black/55 mt-1.5">Review capacity limits and process live reservations.</p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-error-container hover:bg-error-container/85 text-error px-4 py-2 text-[10px] font-medium tracking-widest uppercase transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Case 1: koi restaurant hi nahi hai — pehla wizard */}
                {restaurants.length === 0 && !showAddNew ? (
                    <RestaurantWizard setRestaurant={handleNewRestaurantCreated} />
                ) : showAddNew ? (
                    <RestaurantWizard setRestaurant={handleNewRestaurantCreated} />
                ) : selectedRestaurant?.status === "pending" ? (
                    <PendingApproval restaurant={selectedRestaurant} />
                ) : selectedRestaurant?.status === "rejected" ? (
                    <RequestRejected restaurantName={selectedRestaurant.name} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <aside className="lg:col-span-3 space-y-6 bg-white border border-outline-variant/20 p-6 rounded-md shadow-sm h-fit">

                            {/* Restaurant switcher list */}
                            <div className="space-y-2 border-b border-outline-variant/10 pb-5">
                                {restaurants.map((r) => (
                                    <button
                                        key={r._id}
                                        onClick={() => setSelectedId(r._id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-colors ${
                                            r._id === selectedId ? "bg-primary/10" : "hover:bg-surface"
                                        }`}
                                    >
                                        <span className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-sm shrink-0">
                                            {r.name.charAt(0)}
                                        </span>
                                        <div className="min-w-0">
                                            <h4 className="font-display font-medium text-primary text-sm line-clamp-1">{r.name}</h4>
                                            <span className="text-[8px] text-secondary tracking-widest uppercase">{r.status}</span>
                                        </div>
                                    </button>
                                ))}

                                <button
                                    onClick={() => setShowAddNew(true)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] font-medium tracking-widest uppercase text-primary border border-dashed border-primary/40 hover:border-primary rounded-sm transition-colors"
                                >
                                    <PlusIcon size={12} />
                                    Add New Restaurant
                                </button>
                            </div>

                            <nav className="flex flex-col gap-1.5">
                                <button
                                    onClick={() => setActiveTab("bookings")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer transition-colors ${
                                        activeTab === "bookings" ? "bg-primary text-white" : "text-black/55 hover:bg-surface"
                                    }`}
                                >
                                    <CalendarIcon size={14} />
                                    Bookings ({restaurantBookings.length})
                                </button>

                                <button
                                    onClick={() => setActiveTab("details")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-wider uppercase text-left rounded-sm cursor-pointer transition-colors ${
                                        activeTab === "details" ? "bg-primary text-white" : "text-black/55 hover:bg-surface"
                                    }`}
                                >
                                    <SettingsIcon size={14} />
                                    Profile Details
                                </button>
                            </nav>
                        </aside>

                        <div className="lg:col-span-9 space-y-8">
                            {activeTab === "bookings" && (
                                <OwnerBookings bookings={restaurantBookings} setBookings={setBookings} totalSeats={selectedRestaurant?.totalSeats} />
                            )}

                            {activeTab === "details" && selectedRestaurant && (
                                <OwnerProfileDetails
                                    restaurant={selectedRestaurant}
                                    setRestaurant={handleRestaurantUpdated}
                                />
                            )}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}