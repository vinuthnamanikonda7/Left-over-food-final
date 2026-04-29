/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  MapPin, 
  Clock, 
  Utensils, 
  Truck, 
  Heart, 
  ChevronRight, 
  Plus, 
  LogOut, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  MessageSquare,
  Menu,
  Home,
  Info,
  Zap,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Role, User, FoodListing, ListingStatus } from './types.ts';

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = 'button'
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  variant?: 'primary' | 'secondary' | 'outline' | 'dark',
  className?: string,
  disabled?: boolean,
  type?: 'button' | 'submit'
}) => {
  const base = "px-6 py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100";
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark shadow-lg shadow-orange-200",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border-2 border-brand text-brand hover:bg-orange-50",
    dark: "bg-slate-900 text-white hover:bg-slate-800"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", onClick, ...props }: any) => (
  <div 
    {...props}
    onClick={onClick}
    className={`bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ status }: { status: ListingStatus }) => {
  const colors = {
    'Available': 'bg-green-100 text-green-700',
    'Claimed': 'bg-blue-100 text-blue-700',
    'Picked Up': 'bg-amber-100 text-amber-700',
    'Delivered': 'bg-slate-100 text-slate-500'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors[status]}`}>
      {status}
    </span>
  );
};

const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <motion.div 
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 20, opacity: 1 }}
    exit={{ y: -50, opacity: 0 }}
    className="fixed top-0 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-slate-700"
  >
    <Smartphone className="text-brand h-5 w-5" />
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 hover:text-brand transition-colors"><X size={18} /></button>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<'HOME' | 'ABOUT' | 'CONTACT' | 'IMPACT'>('HOME');
  const [tempUser, setTempUser] = useState<Partial<User>>({ role: 'DONOR' });
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState<string | null>(null);
  
  // Dummy Data
  useEffect(() => {
    const initialListings: FoodListing[] = [
      {
        id: '1',
        title: 'Mixed Veg Thali Packs',
        description: '20 packs of premium thali including rotis, dal, and sabzi.',
        quantity: '20 Packs',
        expiryTime: '22:00',
        pickupAddress: 'Lumbini Mall, Banjara Hills',
        donorName: 'The Spicy Kitchen',
        status: 'Available',
        createdAt: Date.now() - 1000000
      },
      {
        id: '2',
        title: 'Assorted Pastries',
        description: 'Fresh pastries from the evening buffet. High quality.',
        quantity: '3 kg',
        expiryTime: '21:30',
        pickupAddress: 'Grand Plaza Hotel, Gachibowli',
        donorName: 'Grand Plaza',
        status: 'Available',
        createdAt: Date.now() - 500000
      }
    ];
    setListings(initialListings);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  };

  // Auth Logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUser.name || !tempUser.phone) return;
    
    // Validation
    const phoneRegex = /^[789]\d{9}$/;
    if (!phoneRegex.test(tempUser.phone)) {
      showToast("Invalid number! Must be 10 digits starting with 7, 8, or 9.");
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setShowOtpModal(true);
    showToast(`Verification code sent! Your OTP is ${code}`);
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setUser(tempUser as User);
      setShowOtpModal(false);
      showToast("Verification successful!");
    } else {
      showToast("Incorrect OTP. Please try again.");
    }
  };

  // Donor Logic
  const postSurplus = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newListing: FoodListing = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      quantity: formData.get('quantity') as string,
      expiryTime: formData.get('expiry') as string,
      pickupAddress: formData.get('address') as string,
      donorName: user?.name || 'Restaurant',
      status: 'Available',
      createdAt: Date.now()
    };
    setListings([newListing, ...listings]);
    setShowPostModal(false);
    showToast("Surplus posted! Waiting for a receiver to claim.");
  };

  // Receiver Logic
  const claimFood = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orgName = formData.get('orgName') as string;
    const location = formData.get('location') as string;

    setListings(prev => prev.map(l => 
      l.id === showClaimModal 
        ? { ...l, status: 'Claimed', receiverName: orgName, receiverLocation: location }
        : l
    ));
    setShowClaimModal(null);
    showToast("Food claimed! A delivery partner is being assigned.");
  };

  // Delivery Logic
  const updateStatus = (id: string, newStatus: ListingStatus) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    if (newStatus === 'Delivered') {
      showToast("Delivery completed! +50 XP Awarded 🏆");
    }
  };

  // --- Views ---

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(#FC8019_0.5px,transparent_0.5px)] [background-size:24px_24px] [background-position:0_0]">
        <AnimatePresence>
          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="bg-brand w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <Utensils size={28} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 uppercase italic">
              LeftOver<span className="text-brand">Go</span>
            </h1>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-2">Join the Rescue</h2>
            <p className="text-slate-500 mb-8">Reduce waste, feed hearts.</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">FULL NAME</label>
                <input 
                  required
                  type="text" 
                  placeholder="John Doe"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand outline-none transition-all"
                  value={tempUser.name || ''}
                  onChange={e => setTempUser({...tempUser, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">ROLE</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['DONOR', 'RECEIVER', 'DELIVERY'] as Role[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTempUser({...tempUser, role: r})}
                      className={`py-3 rounded-2xl border-2 transition-all font-bold text-[10px] ${tempUser.role === r ? 'bg-brand border-brand text-white' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">PHONE NUMBER</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">+91</span>
                  <input 
                    required
                    type="tel" 
                    placeholder="9876543210"
                    className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand outline-none transition-all"
                    value={tempUser.phone || ''}
                    onChange={e => setTempUser({...tempUser, phone: e.target.value})}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-4 text-lg">
                Get Started <ArrowRight size={20} />
              </Button>
            </form>
          </Card>
        </motion.div>

        {showOtpModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-2">Verify Mobile</h3>
              <p className="text-slate-500 mb-6">Enter the 4-digit code sent to your phone.</p>
              
              <div className="flex gap-3 mb-8 justify-center">
                <input 
                  type="text" 
                  maxLength={4}
                  className="w-full text-center text-4xl tracking-[1rem] font-bold py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand outline-none"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                />
              </div>

              <Button onClick={verifyOtp} className="w-full">
                Verify & Login
              </Button>
              <button 
                onClick={() => setShowOtpModal(false)}
                className="w-full mt-4 text-sm font-bold text-slate-400 underline"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-slate-100 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setActiveView('HOME')}
          >
            <div className="bg-brand w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold italic">L</div>
            <span className="text-xl font-black italic tracking-tighter uppercase text-slate-800">
              LeftOver<span className="text-brand">Go</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => setActiveView('HOME')} className={`text-sm font-bold uppercase tracking-tighter transition-colors ${activeView === 'HOME' ? 'text-brand' : 'text-slate-400 hover:text-slate-900'}`}>Home</button>
            <button onClick={() => setActiveView('ABOUT')} className={`text-sm font-bold uppercase tracking-tighter transition-colors ${activeView === 'ABOUT' ? 'text-brand' : 'text-slate-400 hover:text-slate-900'}`}>About</button>
            <button onClick={() => setActiveView('IMPACT')} className={`text-sm font-bold uppercase tracking-tighter transition-colors ${activeView === 'IMPACT' ? 'text-brand' : 'text-slate-400 hover:text-slate-900'}`}>Impact</button>
            <button onClick={() => setActiveView('CONTACT')} className={`text-sm font-bold uppercase tracking-tighter transition-colors ${activeView === 'CONTACT' ? 'text-brand' : 'text-slate-400 hover:text-slate-900'}`}>Contact</button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-400">LOGGED IN AS</p>
              <p className="text-sm font-bold text-brand uppercase">{user.name} • {user.role}</p>
            </div>
            <button 
              onClick={() => { setUser(null); setActiveView('HOME'); }}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        {activeView === 'HOME' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-extrabold text-slate-900">Welcome, {user.name}</h1>
            <p className="text-slate-500">How would you like to save the day today?</p>
          </motion.div>
        )}

        {/* ROLE BASED VIEWS */}
        
        {activeView === 'HOME' && user.role === 'DONOR' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center p-8 cursor-pointer hover:bg-white hover:border-brand h-[300px] transition-all" onClick={() => setShowPostModal(true)}>
                <div className="p-4 bg-brand rounded-full text-white mb-4">
                  <Plus size={32} />
                </div>
                <h3 className="text-xl font-extrabold">Post Surplus</h3>
                <p className="text-sm text-slate-500 mt-2">Have extra food? Post it here for rescue.</p>
              </Card>

              {listings.filter(l => l.donorName === user.name || l.id === '1').map(l => (
                <Card key={l.id} className="flex flex-col justify-between h-[300px]">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <Badge status={l.status} />
                      <span className="text-xs font-bold text-slate-400">#{l.id}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{l.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{l.description}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Clock size={16} className="text-brand" /> 
                      Expires: {l.expiryTime}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{l.quantity}</span>
                    {l.status === 'Available' ? (
                      <div className="status-pulse">
                        <span className="bg-green-400"></span>
                        <span className="bg-green-500"></span>
                      </div>
                    ) : (
                      <CheckCircle2 size={18} className="text-blue-500" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* RECEIVER VIEW */}
        {activeView === 'HOME' && user.role === 'RECEIVER' && (
          <div className="space-y-12">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Utensils className="text-brand" /> Available Food Near You
                </h2>
                <span className="text-sm font-bold text-brand uppercase tracking-tighter underline">View All</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.filter(l => l.status === 'Available').map(l => (
                  <Card key={l.id} className="overflow-hidden p-0 group">
                    <div className="h-24 bg-slate-900 flex items-center justify-center text-white/10 group-hover:bg-brand transition-colors relative">
                        <Utensils size={48} />
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full text-[10px] font-bold">
                          {l.quantity}
                        </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-1 text-[10px] font-black text-brand uppercase tracking-widest mb-1">
                        <Heart size={10} fill="currentColor" /> {l.donorName}
                      </div>
                      <h3 className="text-lg font-bold mb-1">{l.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 font-medium uppercase tracking-tighter">
                        <div className="flex items-center gap-1"><MapPin size={12} /> {l.pickupAddress.split(',')[0]}</div>
                        <div className="flex items-center gap-1"><Clock size={12} /> Exp {l.expiryTime}</div>
                      </div>
                      <Button 
                        onClick={() => setShowClaimModal(l.id)} 
                        className="w-full py-2.5" 
                        variant="primary"
                      >
                        Claim for Rescue
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="text-blue-500" /> In Progress Trips
              </h2>
              <div className="space-y-4">
                {listings.filter(l => l.receiverName && (l.status === 'Claimed' || l.status === 'Picked Up')).map(l => (
                  <Card key={l.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                        {l.status === 'Claimed' ? <ShieldCheck /> : <Truck />}
                      </div>
                      <div>
                        <h4 className="font-bold">{l.title}</h4>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                          {l.status} • Pickup: {l.donorName}
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-500/10 text-blue-600 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                      <div className="status-pulse">
                        <span className="bg-blue-400"></span>
                        <span className="bg-blue-500"></span>
                      </div>
                      Tracking Live
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* DELIVERY VIEW */}
        {activeView === 'HOME' && user.role === 'DELIVERY' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold mb-6 italic uppercase tracking-tighter flex items-center gap-2">
                  <TrendingUp className="text-blue-500" /> ⚡ Active Trip Details
                </h2>
                {listings.find(l => l.status === 'Picked Up' || l.status === 'Claimed') ? (
                  listings.filter(l => l.status === 'Picked Up' || l.status === 'Claimed').slice(0, 1).map(l => (
                    <Card key={l.id} className="bg-slate-900 border-none text-white p-0 overflow-hidden shadow-2xl">
                      <div className="p-6 bg-gradient-to-r from-orange-500 to-brand flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase opacity-70 tracking-[0.2em]">Assignment ID</p>
                          <h3 className="text-xl font-black">#T-{l.id.toUpperCase()}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase opacity-70 tracking-[0.2em]">Partner Reward</p>
                          <h3 className="text-xl font-bold italic">+₹50</h3>
                        </div>
                      </div>
                      
                      <div className="p-8 space-y-8 relative">
                        {/* Map Style Connector */}
                        <div className="absolute left-[2.5rem] top-12 bottom-12 w-0.5 border-l-2 border-dashed border-white/20"></div>
                        
                        <div className="relative flex gap-6">
                            <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shrink-0 z-10 font-bold text-xs ring-4 ring-slate-900/50 uppercase">P</div>
                            <div>
                              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Pick up From</p>
                              <h4 className="text-lg font-extrabold">{l.donorName}</h4>
                              <p className="text-sm font-medium opacity-60 flex items-center gap-1 mt-1"><MapPin size={14} /> {l.pickupAddress}</p>
                            </div>
                        </div>

                        <div className="relative flex gap-6">
                            <div className="w-10 h-10 rounded-full bg-slate-600 text-white flex items-center justify-center shrink-0 z-10 font-bold text-xs ring-4 ring-slate-900/50 uppercase">D</div>
                            <div>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Deliver to</p>
                                <h4 className="text-lg font-extrabold">{l.receiverName}</h4>
                                <p className="text-sm font-medium opacity-60 flex items-center gap-1 mt-1"><MapPin size={14} /> {l.receiverLocation}</p>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-3">
                          {l.status === 'Claimed' && (
                            <Button onClick={() => updateStatus(l.id, 'Picked Up')} className="flex-1 py-4 text-white hover:bg-white hover:text-slate-900" variant="primary">
                              Arrived at Pickup
                            </Button>
                          )}
                          {l.status === 'Picked Up' && (
                            <Button onClick={() => updateStatus(l.id, 'Delivered')} className="flex-1 py-4 text-white hover:bg-white hover:text-slate-900" variant="primary">
                              Mark as Delivered
                            </Button>
                          )}
                          <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 px-8">
                             Contact Support
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 border-dashed border-2">
                    <Truck size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">No active deliveries</p>
                    <p className="text-sm">Grab a pickup from the list below</p>
                  </Card>
                )}
              </section>

              <section>
                <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2">
                  <Package className="text-slate-400" /> Available Pickups
                </h2>
                <div className="space-y-4">
                  {listings.filter(l => l.status === 'Claimed').map(l => (
                    <Card key={l.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-brand">
                          <Package size={28} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-bold">{l.title}</h4>
                            <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase">NEW TASK</span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs font-medium text-slate-500">
                             <span className="flex items-center gap-1 font-bold text-slate-900"><Utensils size={12} className="text-brand" /> {l.donorName}</span>
                             <span className="flex items-center gap-1"><MapPin size={12} /> {l.pickupAddress.split(',')[0]}</span>
                             <span className="flex items-center gap-1"><ArrowRight size={12} /> {l.receiverName}</span>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => updateStatus(l.id, 'Picked Up')} variant="dark" className="px-8 whitespace-nowrap">
                        Accept Order
                      </Button>
                    </Card>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <Card className="bg-brand text-white border-none p-8">
                <p className="text-sm font-black opacity-70 uppercase tracking-widest mb-1">Today's Earnings</p>
                <div className="flex items-end gap-2 mb-8">
                  <h3 className="text-5xl font-black italic tracking-tighter">₹450</h3>
                  <span className="pb-1 font-bold opacity-70 text-lg">.00</span>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="opacity-70">DELIVERIES</span>
                    <span>09</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="opacity-70">TIPS EARNED</span>
                    <span>₹120</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="opacity-70">STREAK XP</span>
                    <span>+240 XP</span>
                  </div>
                </div>
              </Card>

              <h2 className="text-lg font-bold px-2">Delivery History</h2>
              <div className="space-y-3">
                {listings.filter(l => l.status === 'Delivered').map(l => (
                  <div key={l.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 italic">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                          <CheckCircle2 size={16} />
                       </div>
                       <span className="text-sm font-bold text-slate-700">{l.title}</span>
                    </div>
                    <span className="text-xs font-black text-brand">+50 XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABOUT PAGE */}
        {activeView === 'ABOUT' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-12">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-8 italic">About <span className="text-brand">LeftOverGo</span></h1>
            <Card className="p-12 mb-12">
              <div className="prose prose-slate lg:prose-xl">
                 <p className="text-2xl font-medium leading-relaxed mb-6">
                    We believe that no stomach should be empty when so much food goes to waste.
                 </p>
                 <p className="text-slate-600 mb-8">
                    LeftOverGo is a mission-driven food tech platform designed to bridge the massive gap between food surplus and food insecurity. Every year, millions of tons of perfectly edible food are thrown away from restaurants, hotels, and corporate events. At the same time, thousands of shelters and orphanages struggle to provide nutritious meals.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div className="p-6 bg-slate-50 rounded-3xl">
                       <Heart className="text-brand mb-4" size={32} />
                       <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                       <p className="text-sm text-slate-500">To end hunger by making food rescue as fast and simple as ordering a pizza.</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl">
                       <Truck className="text-brand mb-4" size={32} />
                       <h3 className="text-xl font-bold mb-2">Crowdsourced Power</h3>
                       <p className="text-sm text-slate-500">Connecting surplus to demand using a network of local delivery heroes.</p>
                    </div>
                 </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* IMPACT PAGE */}
        {activeView === 'IMPACT' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto py-12 text-center">
            <div className="mb-16">
              <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 italic">Our <span className="text-brand">Impact</span> Card</h1>
              <p className="text-slate-500 text-lg">Real numbers. Real hearts. Real rescue.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <Card className="p-10 border-b-4 border-brand">
                  <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center text-brand mx-auto mb-6">
                    <Utensils size={32} />
                  </div>
                  <h3 className="text-4xl font-black mb-2">12,450+</h3>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Meals Rescued</p>
               </Card>
               <Card className="p-10 border-b-4 border-green-500">
                  <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                    <TrendingUp size={32} />
                  </div>
                  <h3 className="text-4xl font-black mb-2">840 kg</h3>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">CO2 Saved</p>
               </Card>
               <Card className="p-10 border-b-4 border-blue-500">
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-6">
                    <Heart size={32} />
                  </div>
                  <h3 className="text-4xl font-black mb-2">45+</h3>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Partner Homes</p>
               </Card>
            </div>

            <Card className="mt-12 bg-slate-900 text-white p-12 overflow-hidden relative">
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold mb-4 italic">Ready to make your first rescue?</h3>
                 <p className="opacity-60 mb-8 max-w-md mx-auto">Join a community of 500+ restaurants and 1200+ delivery partners changing the world one meal at a time.</p>
                 <Button onClick={() => setActiveView('HOME')} className="mx-auto bg-white text-slate-900 hover:bg-slate-100">Back to Dashboard</Button>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </Card>
          </motion.div>
        )}

        {/* CONTACT PAGE */}
        {activeView === 'CONTACT' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-6 italic">Get In <span className="text-brand">Touch</span></h1>
                <p className="text-slate-500 mb-8 text-lg">Need help with a pickup? Want to register your organization? We're here 24/7.</p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand">
                      <Smartphone />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Phone Support</p>
                      <p className="font-bold">+91 800 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand">
                      <MapPin />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Headquarters</p>
                      <p className="font-bold">Tech Park, Hyderabad, India</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="p-8">
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); showToast("Message Sent! We'll get back shortly."); }}>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Your Name</label>
                    <input className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand outline-none" placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                    <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand outline-none font-bold">
                       <option>Support Inquiry</option>
                       <option>Partnership Request</option>
                       <option>Delivery Dispute</option>
                       <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Message</label>
                    <textarea className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand outline-none h-32" placeholder="Tell us how we can help..."></textarea>
                  </div>
                  <Button type="submit" className="w-full py-4 uppercase">Send Message</Button>
                </form>
              </Card>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="mt-auto py-12 px-6 bg-white border-t border-slate-100 pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('HOME')}>
                <div className="bg-brand w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold italic">L</div>
                <span className="text-xl font-black italic tracking-tighter uppercase text-slate-800">
                  LeftOver<span className="text-brand">Go</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-xs text-center md:text-left">Bringing surplus food to orphanages and homes via crowdsourced logistics.</p>
           </div>
           
           <div className="flex gap-12 font-bold text-sm text-slate-600 uppercase tracking-widest italic">
              <button 
                onClick={() => { setActiveView('ABOUT'); window.scrollTo(0,0); }} 
                className={`hover:text-brand transition-colors ${activeView === 'ABOUT' ? 'text-brand' : ''}`}
              >
                About Us
              </button>
              <button 
                onClick={() => { setActiveView('CONTACT'); window.scrollTo(0,0); }}
                className={`hover:text-brand transition-colors ${activeView === 'CONTACT' ? 'text-brand' : ''}`}
              >
                Contact
              </button>
              <button 
                onClick={() => { setActiveView('IMPACT'); window.scrollTo(0,0); }}
                className={`hover:text-brand transition-colors ${activeView === 'IMPACT' ? 'text-brand' : ''}`}
              >
                Impact
              </button>
           </div>

           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-orange-50 transition-colors">
                 <Smartphone size={20} className="text-slate-400" />
              </div>
           </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-50 text-center">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">© 2026 LEFTOVERGO TECHNOLOGY SOLUTIONS PVT LTD</p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 bg-slate-900 text-white rounded-full p-2 flex items-center justify-around z-[100] shadow-2xl border border-white/10">
        <button 
          onClick={() => { setActiveView('HOME'); window.scrollTo(0,0); }}
          className={`flex flex-col items-center gap-1 p-3 rounded-full transition-all ${activeView === 'HOME' ? 'text-brand bg-white/10' : 'text-slate-400'}`}
        >
          <Home size={20} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </button>
        <button 
          onClick={() => { setActiveView('ABOUT'); window.scrollTo(0,0); }}
          className={`flex flex-col items-center gap-1 p-3 rounded-full transition-all ${activeView === 'ABOUT' ? 'text-brand bg-white/10' : 'text-slate-400'}`}
        >
          <Info size={20} />
          <span className="text-[10px] font-black uppercase tracking-tighter">About</span>
        </button>
        <button 
          onClick={() => { setActiveView('IMPACT'); window.scrollTo(0,0); }}
          className={`flex flex-col items-center gap-1 p-3 rounded-full transition-all ${activeView === 'IMPACT' ? 'text-brand bg-white/10' : 'text-slate-400'}`}
        >
          <Zap size={20} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Impact</span>
        </button>
        <button 
          onClick={() => { setActiveView('CONTACT'); window.scrollTo(0,0); }}
          className={`flex flex-col items-center gap-1 p-3 rounded-full transition-all ${activeView === 'CONTACT' ? 'text-brand bg-white/10' : 'text-slate-400'}`}
        >
          <MessageSquare size={20} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Contact</span>
        </button>
      </div>

      {/* MODALS */}
      
      {/* Post Surplus Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Post Surplus</h3>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-900"><X /></button>
            </div>
            <form onSubmit={postSurplus} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Food Title</label>
                <input required name="title" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand outline-none transition-all font-bold" placeholder="Veg Pulav & Curry" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Quantity</label>
                  <input required name="quantity" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand outline-none font-bold" placeholder="10 Packs" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Expiry Time</label>
                  <input required name="expiry" type="time" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand outline-none font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Short Description</label>
                <textarea name="description" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand outline-none font-medium h-24" placeholder="Freshly made food from corporate event..."></textarea>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Pickup Address</label>
                <input required name="address" className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand outline-none font-medium" placeholder="E.g. Hitech City, Towers Building G-05" />
              </div>
              <Button type="submit" className="w-full py-4 uppercase">Launch Rescue Listing</Button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Claim Food Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black italic tracking-tighter uppercase">Claim for Rescue</h3>
              <button onClick={() => setShowClaimModal(null)} className="text-slate-400 hover:text-slate-900 text-lg"><X /></button>
            </div>
            <p className="text-sm text-slate-500 mb-8 border-l-4 border-brand pl-4">Once claimed, a delivery partner will be notified to pick this up and deliver it to your specified location.</p>
            <form onSubmit={claimFood} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Organization Name</label>
                <input required name="orgName" placeholder="e.g., St. Mary’s Home" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand outline-none font-bold" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Delivery Address</label>
                <textarea required name="location" placeholder="Lane 4, Beside City Park, Gachibowli" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-brand outline-none font-medium h-24" />
              </div>
              <Button type="submit" className="w-full py-4 text-lg">Confirm Claim</Button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
