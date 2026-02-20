import React, { useState, useRef, useEffect } from 'react';
import {
  Ticket,
  ShieldCheck,
  QrCode,
  Repeat,
  ChevronRight,
  Menu,
  X,
  Zap,
  Wallet,
  Globe,
  Lock,
  Sun,
  Moon,
  Mail,
  User,
  ArrowRight,
  Bell,
  LogOut,
  Search,
  Calendar,
  MapPin,
  LayoutDashboard,
  Compass,
  MessageSquare,
  Send,
  Sparkles,
  ImageOff,
  Loader2,
  TrendingUp,
  Link2 as LinkIcon
} from 'lucide-react';

import { peraWallet, connectWallet, reconnectWallet, disconnectWallet } from '../utils/wallet';

// --- Gemini API Configuration ---
// TO ENABLE LIVE AI: Replace the empty string in API_KEY with your Google AI Studio key.
const API_KEY = ""; // Fallback to simulation mode if empty
const GEMINI_MODEL = "gemini-1.5-flash-latest";

const callGemini = async (prompt, systemInstruction = "") => {
  if (!API_KEY || API_KEY === "") {
    // Simulation Mode if no API Key is provided
    const fallbacks = [
      "Our orbital sensors show that the event is filling up fast! You should secure your passage soon.",
      "The Algorand blockchain ensures your ticket is as permanent as a star in the night sky.",
      "I've synchronized your schedule with the upcoming Galaxy Gala. It looks like clear skies ahead!",
      "Pro tip: Keep your Pera Wallet linked for instant verification at the venue gates.",
      "The Hackathon Entry Ticket is a rare NFT asset. It's your key to the VIP sectors of the Odyssey Arena."
    ];
    await new Promise(r => setTimeout(r, 800)); // Simulate thinking
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    system_instruction: { parts: [{ text: systemInstruction }] }
  };

  const fetchWithBackoff = async (retries = 0) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "The cosmos is quiet today. Try again in a moment.";
    } catch (error) {
      if (retries < 3) {
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithBackoff(retries + 1);
      }
      throw error;
    }
  };
  return fetchWithBackoff();
};

// Updated Mock Data with verified high-quality event photography URLs
const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Galaxy Gala: An Orchestral Journey",
    date: "November 12, 2024",
    location: "Celestial Concert Hall",
    price: 120.00,
    status: "Sold Out",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800",
    category: "Ongoing",
    description: "A cosmic symphonic experience featuring local campus talent.",
    isVerified: true,
    isExclusive: true,
    isTrending: true
  },
  {
    id: 2,
    title: "Cosmic Comedy Jam",
    date: "November 5, 2024",
    location: "The Laughing Gas",
    price: 40.00,
    status: "Buy Ticket",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800",
    category: "Upcoming",
    description: "The funniest stand-up comics from the Computer Science department.",
    isVerified: true,
    isExclusive: false,
    isTrending: false
  },
  {
    id: 3,
    title: "Rock the Cosmos Tour",
    date: "December 1, 2024",
    location: "Meteor Stadium",
    price: 95.00,
    status: "Buy Ticket",
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800",
    category: "Upcoming",
    description: "High-energy rock performances with stellar lighting effects.",
    isVerified: false,
    isExclusive: true,
    isTrending: true
  },
  {
    id: 4,
    title: "Stellar Sound Fest",
    date: "October 26, 2024",
    location: "Odyssey Arena",
    price: 150.00,
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
    category: "Ongoing",
    description: "The biggest music festival on campus with multiple stages.",
    isVerified: true,
    isExclusive: false,
    isTrending: true
  }
];

const MY_TICKETS = [
  {
    id: 'T-8821',
    event: "Galaxy Gala",
    date: "Nov 12, 2024",
    nftId: "ALGO-NFT-9902",
    qrValue: "VERIFIED-SESSION-X92"
  }
];

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQR, setShowQR] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [marketFilter, setMarketFilter] = useState('All Items');
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
  });

  const FEATURED_SLIDES = [
    { title: "Galactic Gala: VIP Alpha Pass", desc: "Exclusive early access. Secured by Algorand.", color: "from-indigo-900 via-purple-900 to-zinc-900", img: "https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=1200" },
    { title: "Stellar Sound VIP Lounge", desc: "Backstage access for NFT holders.", color: "from-blue-900 via-indigo-900 to-zinc-900", img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200" },
    { title: "Algorand Arena Open", desc: "Tournament tickets live now.", color: "from-zinc-900 via-emerald-900 to-zinc-900", img: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=1200" }
  ];

  // Auto-slide effect
  useEffect(() => {
    if (activeTab === 'explore') {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % FEATURED_SLIDES.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeTab]);

  // Keyboard accessibility for AI Assistant
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsAssistantOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // AI States
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: "Hello Alex! I'm your Stellar Assistant. How can I help you navigate the cosmos today?" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiInsights, setAiInsights] = useState({});
  const [loadingInsight, setLoadingInsight] = useState(null);
  const [algoStatus, setAlgoStatus] = useState({ connected: false, app_id: 0, asset_id: 0, last_round: 0 });
  const [verificationLoading, setVerificationLoading] = useState(null);
  const [verificationResults, setVerificationResults] = useState({});
  const [connectedAccount, setConnectedAccount] = useState(null);
  const chatEndRef = useRef(null);

  // Wallet Connection Handlers
  const handleConnect = async () => {
    const account = await connectWallet();
    if (account) setConnectedAccount(account);
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setConnectedAccount(null);
  };

  useEffect(() => {
    // Reconnect session on load
    reconnectWallet().then(account => {
      if (account) setConnectedAccount(account);
    });
  }, []);

  const verifyTicket = async (ticket) => {
    if (!connectedAccount) {
      alert("Please connect your wallet first!");
      return;
    }

    setVerificationLoading(ticket.id);
    try {
      const response = await fetch('/api/algo/check-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: connectedAccount })
      });
      const data = await response.json();
      setVerificationResults(prev => ({ ...prev, [ticket.id]: data.has_ticket }));
    } catch (err) {
      console.error("Verification failed", err);
    } finally {
      setVerificationLoading(null);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/algo/status');
        const data = await response.json();
        setAlgoStatus(data);
      } catch (err) {
        console.error("Failed to fetch algo status", err);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...chatMessages, { role: 'user', text: userInput }];
    setChatMessages(newMessages);
    setUserInput("");
    setIsTyping(true);

    try {
      const context = `You are the Stellar Assistant for a campus event ticketing platform called 'Stellar'. 
      Events available: ${INITIAL_EVENTS.map(e => `${e.title} at ${e.location} on ${e.date}`).join(', ')}.
      Users buy tickets as Algorand NFTs. 
      Keep responses brief, helpful, and use space/cosmos metaphors.`;

      const response = await callGemini(userInput, context);
      setChatMessages([...newMessages, { role: 'ai', text: response }]);
    } catch (err) {
      setChatMessages([...newMessages, { role: 'ai', text: "I've hit a solar flare! Please try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateInsight = async (event) => {
    if (aiInsights[event.id]) return;
    setLoadingInsight(event.id);
    try {
      const prompt = `Give me a 1-sentence "can't miss" reason for this event: ${event.title}. 
      Details: ${event.description} at ${event.location}. 
      Make it punchy and student-focused.`;
      const response = await callGemini(prompt);
      setAiInsights(prev => ({ ...prev, [event.id]: response }));
    } catch (err) {
      setAiInsights(prev => ({ ...prev, [event.id]: "This event is lightyears ahead of the rest!" }));
    } finally {
      setLoadingInsight(null);
    }
  };

  // Layout Components
  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-6 py-4 transition-all duration-200 ${activeTab === id
        ? 'text-indigo-500 bg-zinc-900 border-r-4 border-indigo-500'
        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
        }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  // Reliable Image Component with Fallback
  const EventImage = ({ src, alt }) => {
    const [error, setError] = useState(false);

    if (error) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-zinc-900 to-purple-950 flex flex-col items-center justify-center space-y-3 opacity-90">
          <div className="p-3 bg-indigo-500/10 rounded-full">
            <ImageOff size={24} className="text-indigo-400/40" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-400/40 font-bold">Stellar Visuals</span>
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        onError={() => setError(true)}
      />
    );
  };

  const EventCard = ({ event }) => (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex flex-col h-full group hover:border-zinc-700 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300">
      <div className="relative h-52 overflow-hidden bg-zinc-800">
        <EventImage src={event.image} alt={event.title} />
        {event.status === "Ongoing" && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse shadow-lg z-10">
            Live Now
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); generateInsight(event); }}
          className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 backdrop-blur-md text-white rounded-xl hover:bg-indigo-600 transition-all shadow-xl border border-white/10 z-10 active:scale-95"
          title="✨ AI Insight"
        >
          {loadingInsight === event.id ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        </button>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        {aiInsights[event.id] && (
          <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-300 italic animate-in fade-in slide-in-from-top-2">
            ✨ {aiInsights[event.id]}
          </div>
        )}
        <h3 className="text-zinc-100 font-bold text-lg mb-4 leading-tight group-hover:text-indigo-400 transition-colors">
          {event.title}
        </h3>

        <div className="space-y-3 mb-8">
          <div className="flex items-center text-zinc-400 text-sm">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center mr-3 group-hover:bg-zinc-700 transition-colors">
              <Calendar size={14} className="text-indigo-400" />
            </div>
            {event.date}
          </div>
          <div className="flex items-center text-zinc-400 text-sm">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center mr-3 group-hover:bg-zinc-700 transition-colors">
              <MapPin size={14} className="text-indigo-400" />
            </div>
            {event.location}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Entry Price</span>
            <div className="text-zinc-100 font-bold text-xl">
              ${event.price.toFixed(2)}
            </div>
          </div>
          {event.status === "Sold Out" ? (
            <div className="flex flex-col items-end">
              <button disabled className="px-5 py-2.5 bg-zinc-800 text-zinc-500 rounded-xl cursor-not-allowed text-xs font-bold uppercase tracking-wider">
                Buy Ticket
              </button>
              <span className="text-[9px] text-red-500 font-black mt-1.5 uppercase tracking-tighter">Sold Out</span>
            </div>
          ) : (
            <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
              Buy Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500">
                    <Ticket size={28} />
                  </div>
                  <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full">+2 this month</span>
                </div>
                <h4 className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Owned Tickets</h4>
                <p className="text-3xl font-black text-zinc-100 mt-2">12</p>
              </div>
              <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 hover:border-amber-500/30 transition-all group cursor-help">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500">
                    <Wallet size={28} />
                  </div>
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">ALGO Mainnet</span>
                </div>
                <h4 className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Wallet Balance</h4>
                <p className="text-3xl font-black text-zinc-100 mt-2">452.80 <span className="text-sm font-normal text-zinc-600">ALGO</span></p>
              </div>
              <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-500">
                    <TrendingUp size={28} />
                  </div>
                </div>
                <h4 className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Total Investment</h4>
                <p className="text-3xl font-black text-zinc-100 mt-2">$1,240.00</p>
              </div>
            </div>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-zinc-100 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-4 animate-ping"></span>
                  Live Sessions
                </h2>
                <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-zinc-100 hover:border-zinc-700 transition-all active:scale-95">View Market</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {INITIAL_EVENTS
                  .filter(e => e.category === "Ongoing")
                  .filter(e =>
                    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    e.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-zinc-100">Future Drops</h2>
                <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-zinc-100 hover:border-zinc-700 transition-all active:scale-95">Calendar</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {INITIAL_EVENTS
                  .filter(e => e.category === "Upcoming")
                  .filter(e =>
                    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    e.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </div>
            </section>
          </div>
        );

      case 'explore':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Marketplace Dynamic Slider */}
            <section className="relative h-64 rounded-[3rem] overflow-hidden group shadow-2xl shadow-indigo-500/10 border border-zinc-800">
              {FEATURED_SLIDES.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
                    }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-80 z-10`}></div>
                  <img src={slide.img} className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] contrast-[1.2]" alt="" />
                  <div className="relative h-full flex flex-col justify-center px-12 space-y-4 z-20">
                    <div className="flex items-center space-x-3">
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest">Featured Drop</div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter max-w-xl drop-shadow-2xl">
                      {slide.title}
                    </h2>
                    <p className="text-zinc-300 text-sm max-w-md font-medium drop-shadow-md">
                      {slide.desc}
                    </p>
                    <button className="w-fit px-8 py-3 bg-white text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-xl active:scale-95">
                      Secure Entry
                    </button>
                  </div>
                </div>
              ))}

              {/* Slider Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
                {FEATURED_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 transition-all duration-300 rounded-full active:scale-90 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                  />
                ))}
              </div>
            </section>

            {/* Marketplace Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
                {['All Items', 'Verified', 'Exclusive', 'Trending'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setMarketFilter(filter)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${marketFilter === filter ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:text-zinc-200'
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Market Volume</p>
                  <p className="text-lg font-black text-zinc-100 italic">42.8K <span className="text-indigo-400 not-italic">ALGO</span></p>
                </div>
                <div className="w-[1px] h-10 bg-zinc-800"></div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Floor Price</p>
                  <p className="text-lg font-black text-zinc-100 italic">12.5 <span className="text-indigo-400 not-italic">ALGO</span></p>
                </div>
              </div>
            </div>

            {/* Market Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {INITIAL_EVENTS
                .filter(event => {
                  if (marketFilter === 'All Items') return true;
                  if (marketFilter === 'Verified') return event.isVerified;
                  if (marketFilter === 'Exclusive') return event.isExclusive;
                  if (marketFilter === 'Trending') return event.isTrending;
                  return true;
                })
                .filter(event =>
                  event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  event.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
            </div>
          </div>
        );

      case 'tickets':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-zinc-100">Ticket Vault</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {MY_TICKETS.map(ticket => (
                <div key={ticket.id} className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 flex items-center justify-between group hover:border-indigo-500/50 transition-all duration-300">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-500">
                      <Ticket size={40} />
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-zinc-100 mb-1">{ticket.event}</h3>
                      <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">{ticket.date}</p>
                      <div className="flex items-center mt-3 px-2 py-1 bg-zinc-950 rounded-lg w-fit">
                        <span className="text-[9px] text-zinc-600 font-mono tracking-tighter mr-2">NFT ID:</span>
                        <span className="text-[10px] text-indigo-400 font-mono">{ticket.nftId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <button
                      onClick={() => setShowQR(ticket)}
                      className="p-4 bg-zinc-800 hover:bg-indigo-600 text-zinc-100 rounded-2xl transition-all shadow-xl group-hover:shadow-indigo-600/20"
                    >
                      <QrCode size={28} />
                    </button>
                    <button
                      onClick={() => verifyTicket(ticket)}
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${verificationResults[ticket.id] === true
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50'
                        : verificationResults[ticket.id] === false
                          ? 'bg-red-500/10 text-red-500 border-red-500/50'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-indigo-500'
                        }`}
                    >
                      {verificationLoading === ticket.id ? 'Checking...' :
                        verificationResults[ticket.id] === true ? 'Verified On-Chain' :
                          verificationResults[ticket.id] === false ? 'Not Found' : 'Verify My Ticket'}
                    </button>
                  </div>
                </div>
              ))}
              <div className="border-2 border-dashed border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center text-zinc-600 hover:border-indigo-500/50 hover:text-indigo-400 transition-all cursor-pointer group active:scale-[0.98]">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Compass size={32} />
                </div>
                <p className="font-black uppercase tracking-widest text-sm">Scan for new Drops</p>
              </div>
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-zinc-100 uppercase italic tracking-tighter">Digital Vault</h2>
              <button onClick={handleConnect} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center space-x-3 transition-all active:scale-95">
                <Repeat size={18} />
                <span>Sync Node</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Asset Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-700">
                  <Wallet size={200} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/20">
                      Live Balance
                    </span>
                    <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all active:scale-95">
                      <Repeat size={16} className="text-zinc-400" />
                    </button>
                  </div>
                  <div className="mt-8 flex items-end space-x-4">
                    <h3 className="text-6xl font-black text-white italic tracking-tighter">452.80</h3>
                    <span className="text-2xl font-bold text-zinc-600 mb-2">ALGO</span>
                  </div>
                  <p className="text-zinc-500 font-medium mt-4 max-w-sm">
                    Secured by <span className="text-indigo-400 italic font-black">Algorand Mainnet</span>. Assets are non-custodial and synchronized in real-time.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <button className="py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                      Transfer Funds
                    </button>
                    <button className="py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95">
                      Request Asset
                    </button>
                  </div>
                </div>
              </div>

              {/* Transaction History Simulation */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10">
                <h3 className="text-xl font-black text-zinc-100 mb-8 uppercase italic tracking-tighter">Recent Activities</h3>
                <div className="space-y-6">
                  {[
                    { action: 'Ticket Minted', time: '12h ago', amount: '-45.00', icon: Zap, color: 'text-amber-500' },
                    { action: 'Transfer Received', time: '2d ago', amount: '+120.00', icon: ArrowRight, color: 'text-emerald-500' },
                    { action: 'Vault Sync', time: '5d ago', amount: '0.00', icon: ShieldCheck, color: 'text-indigo-500' }
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center ${tx.color}`}>
                          <tx.icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">{tx.action}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{tx.time}</p>
                        </div>
                      </div>
                      <p className={`font-mono text-sm font-bold ${tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-zinc-400'}`}>
                        {tx.amount} <span className="text-[10px]">ALGO</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-zinc-100">User Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
                <div className="flex flex-col items-center text-center">
                  <div className="relative group">
                    <img src={userProfile.avatar} alt="Profile" className="w-24 h-24 rounded-2xl mb-4 border-2 border-indigo-500/20 group-hover:border-indigo-500 transition-all" />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Sparkles size={20} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-zinc-100 mb-1">{userProfile.name}</h3>
                  <p className="text-zinc-500 text-sm mb-6">Session: X92A-44</p>
                  <button className="w-full px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-xl font-bold text-sm transition-all">Change Avatar</button>
                </div>
              </div>
              <div className="md:col-span-2 bg-zinc-900 p-8 rounded-3xl border border-zinc-800 space-y-6">
                <div>
                  <label className="text-zinc-400 text-sm font-bold uppercase tracking-widest block mb-2">Full Name</label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-sm font-bold uppercase tracking-widest block mb-2">Email Address</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-sm font-bold uppercase tracking-widest block mb-2">Wallet Address</label>
                  <input type="text" value={connectedAccount || "Not Linked"} disabled className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed font-mono text-xs" />
                </div>
                <button
                  onClick={() => {
                    setIsSaving(true);
                    setTimeout(() => setIsSaving(false), 2000);
                  }}
                  className={`w-full px-6 py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center space-x-2 ${isSaving ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                >
                  {isSaving ? (
                    <>
                      <ShieldCheck size={18} />
                      <span>Configuration Saved</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-zinc-950 border-r border-zinc-900 z-50 flex flex-col">
        <div className="p-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30 ring-4 ring-indigo-600/20">
              <Ticket size={28} />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase italic block leading-none">STellar</span>
              <span className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] mt-1 block">Campus OS</span>
            </div>
          </div>
        </div>

        <nav className="flex-grow px-4 mt-6 space-y-2">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="tickets" icon={Ticket} label="My Vault" />
          <SidebarItem id="explore" icon={Compass} label="Marketplace" />
          <SidebarItem id="wallet" icon={Wallet} label="Wallet" />
          <SidebarItem id="profile" icon={User} label="User Config" />
        </nav>

        <div className="p-6 border-t border-zinc-900 space-y-4">
          {connectedAccount ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 group relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Wallet Linked</span>
                <button
                  onClick={handleDisconnect}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                  title="Disconnect"
                >
                  <LogOut size={14} />
                </button>
              </div>
              <p className="text-[11px] text-zinc-100 font-mono truncate">
                {connectedAccount?.toString()}
              </p>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all shadow-lg shadow-indigo-600/20 font-bold text-sm"
            >
              <LinkIcon size={18} />
              <span>Connect Pera</span>
            </button>
          )}

          <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50 mb-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${algoStatus.connected ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                {algoStatus.connected ? 'Node Connected' : 'Node Offline'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              {algoStatus.connected ? `Round: #${algoStatus.last_round}` : 'Waiting for backend...'}
            </p>
            {algoStatus.app_id > 0 && (
              <>
                <p className="text-[9px] text-indigo-400 font-mono mt-1">App ID: {algoStatus.app_id}</p>
                <p className="text-[9px] text-zinc-600 font-mono">Network: Testnet</p>
              </>
            )}
            {algoStatus.asset_id > 0 && (
              <p className="text-[9px] text-emerald-500 font-mono">Asset ID: {algoStatus.asset_id}</p>
            )}
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            className="w-full flex items-center space-x-3 px-6 py-4 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all active:scale-95"
          >
            <LogOut size={20} />
            <span className="font-bold uppercase tracking-widest text-xs">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-72 flex-grow min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 px-10 py-6 flex items-center justify-between">
          <div className="relative w-full max-w-lg group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="✨ Query: 'Show me high-energy festivals'..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-zinc-900 transition-all placeholder:text-zinc-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-8">
            <button className="relative text-zinc-400 hover:text-white transition-all p-2.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 active:scale-95">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-zinc-950"></span>
            </button>
            <div className="h-10 w-[1px] bg-zinc-800"></div>
            <div className="flex items-center space-x-4 group cursor-pointer active:scale-95 transition-all" onClick={() => setActiveTab('profile')}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-zinc-100 group-hover:text-indigo-400 transition-colors">{userProfile.name}</p>
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-0.5">Session: X92A-44</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 p-1 group-hover:scale-110 transition-transform ring-2 ring-transparent group-hover:ring-indigo-600/20">
                <img src={userProfile.avatar} alt="user" className="w-full h-full rounded-xl bg-zinc-800" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="px-10 py-10 max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Floating AI Assistant Toggle */}
      <button
        onClick={() => setIsAssistantOpen(!isAssistantOpen)}
        className={`fixed bottom-10 right-10 w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-3xl transition-all duration-500 z-[70] group overflow-hidden ${isAssistantOpen ? 'bg-zinc-800 rotate-90 scale-90' : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-110 hover:-translate-y-2'
          }`}
      >
        {isAssistantOpen ? <X size={32} /> : <MessageSquare size={32} />}
        {!isAssistantOpen && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-black px-2 py-1 rounded-full animate-bounce shadow-lg ring-4 ring-zinc-950">1</div>
          </>
        )}
      </button>

      {/* AI Assistant Panel */}
      {isAssistantOpen && (
        <>
          <div
            className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-[65] animate-in fade-in duration-300"
            onClick={() => setIsAssistantOpen(false)}
          ></div>
          <div className="fixed bottom-36 right-10 w-[420px] h-[600px] bg-zinc-900 border border-zinc-800 rounded-[3rem] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.8)] z-[70] flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 fade-in duration-500">
            <div className="p-8 bg-indigo-600 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-5">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl leading-none">Stellar AI</h3>
                    <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mt-1.5 flex items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                      {API_KEY ? 'Galactic Neural Link Active' : 'Simulation Mode Engaged'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAssistantOpen(false)}
                  className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-zinc-950/20">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10'
                    : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800 shadow-sm'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 p-4 rounded-3xl rounded-tl-none border border-zinc-800">
                    <div className="flex space-x-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Message Stellar..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-700"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isTyping}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all shadow-lg active:scale-90"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* QR Code Modal Overlay */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setShowQR(null)}
          ></div>
          <div className="relative bg-zinc-900 w-full max-w-md rounded-[3rem] p-12 border border-zinc-800 shadow-[0_0_100px_rgba(79,70,229,0.1)] animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-500 mb-8 ring-4 ring-indigo-500/5">
                <ShieldCheck size={48} />
              </div>
              <h3 className="text-3xl font-black text-zinc-100 mb-2 tracking-tight">{showQR.event}</h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-10">Entry Token Validation</p>

              <div className="bg-white p-8 rounded-[2.5rem] mb-10 shadow-2xl relative group">
                <div className="absolute -inset-2 bg-indigo-500/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-56 h-56 bg-zinc-50 flex flex-wrap items-center justify-center gap-1.5 overflow-hidden rounded-xl relative z-10">
                  {[...Array(81)].map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded-sm transition-colors duration-1000 ${Math.random() > 0.4 ? 'bg-zinc-950' : 'bg-transparent'}`}></div>
                  ))}
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 mb-10">
                <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest block mb-1">Vault ID</span>
                  <span className="text-xs text-indigo-400 font-mono font-bold tracking-tight">{showQR.nftId}</span>
                </div>
                <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest block mb-1">Expires In</span>
                  <span className="text-xs text-zinc-200 font-mono font-bold tracking-tight">04:59s</span>
                </div>
              </div>

              <button
                onClick={() => setShowQR(null)}
                className="w-full py-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:scale-95"
              >
                Close Secure Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
