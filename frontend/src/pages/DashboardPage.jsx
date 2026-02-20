import React, { useState, useRef, useEffect } from 'react';
import {
  Ticket,
  ShieldCheck,
  QrCode,
  Repeat,
  ChevronRight,
  ChevronLeft,
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
    title: "AlgoTix Sound Fest",
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
  },
  {
    id: 5,
    title: "Quantum Techno Rave",
    date: "October 30, 2024",
    location: "Subspace Club",
    price: 65.00,
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1559103551-78716f2c0022?auto=format&fit=crop&q=80&w=800",
    category: "Ongoing",
    description: "High-energy deep house and techno until sunrise.",
    isVerified: true,
    isExclusive: true,
    isTrending: true
  },
  {
    id: 6,
    title: "Neon Nebula Carnival",
    date: "November 20, 2024",
    location: "Central Quad",
    price: 25.00,
    status: "Buy Ticket",
    image: "https://images.unsplash.com/photo-1513623935135-c896b59073c1?auto=format&fit=crop&q=80&w=800",
    category: "Upcoming",
    description: "Fun, games, and street food under futuristic neon lights.",
    isVerified: true,
    isExclusive: false,
    isTrending: true
  },
  {
    id: 7,
    title: "Cyberpunk Art Expo",
    date: "October 24, 2024",
    location: "Digital Gallery",
    price: 15.00,
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=800",
    category: "Ongoing",
    description: "Explore the intersection of AI and campus creativity.",
    isVerified: true,
    isExclusive: false,
    isTrending: false
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
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New VIP drop: Galactic Gala tickets released!", time: "2m ago" },
    { id: 2, text: "Wallet successfully synced with Mainnet.", time: "1h ago" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(null);
  const [unreadCount, setUnreadCount] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [userProfile, setUserProfile] = useState(() => {
    const savedName = localStorage.getItem('username') || "Alex Johnson";
    return {
      name: savedName,
      email: `${savedName.toLowerCase().replace(/\s/g, '')}@example.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${savedName}`
    };
  });

  useEffect(() => {
    const savedName = localStorage.getItem('username');
    if (savedName && savedName !== userProfile.name) {
      setUserProfile(prev => ({
        ...prev,
        name: savedName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${savedName}`
      }));
    }
  }, []);

  const FEATURED_SLIDES = [
    { title: "Galactic Gala: VIP Alpha Pass", desc: "Exclusive early access. Secured by Algorand.", color: "from-indigo-900 via-purple-900 to-zinc-900", img: "https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=1200" },
    { title: "AlgoTix Sound VIP Lounge", desc: "Backstage access for NFT holders.", color: "from-blue-900 via-indigo-900 to-zinc-900", img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200" },
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
    { role: 'ai', text: `Hello ${userProfile.name}! I'm your AlgoTix Assistant. How can I help you navigate the cosmos today?` }
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

  const toggleAssistant = () => {
    setIsAssistantOpen(!isAssistantOpen);
    setUnreadCount(0);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...chatMessages, { role: 'user', text: userInput }];
    setChatMessages(newMessages);
    setUserInput("");
    setIsTyping(true);

    try {
      const context = `You are the AlgoTix Assistant for a campus event ticketing platform called 'AlgoTix'. 
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


  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group overflow-hidden ${activeTab === id
        ? 'bg-indigo-600 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] scale-[1.02]'
        : `${theme === 'dark' ? 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900/80' : 'text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50/80 shadow-sm'}`
        }`}
    >
      {activeTab === id && (
        <div className="absolute left-0 top-0 w-1.5 h-full bg-white shadow-[0_0_20px_#fff]"></div>
      )}
      <Icon size={20} className={`${activeTab === id ? 'text-white' : 'text-zinc-600 group-hover:text-indigo-500'} transition-transform duration-500 group-hover:scale-110`} />
      <span className="relative z-10">{label}</span>
      {activeTab !== id && (
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      )}
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
    <div className={`${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} rounded-2xl overflow-hidden border flex flex-col h-full group hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300`}>
      <div className={`relative h-52 overflow-hidden ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
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
        <h3 className={`${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'} font-bold text-lg mb-4 leading-tight group-hover:text-indigo-500 transition-colors`}>
          {event.title}
        </h3>

        <div className="space-y-3 mb-8">
          <div className="flex items-center text-zinc-500 text-sm">
            <div className={`w-8 h-8 rounded-lg ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'} flex items-center justify-center mr-3 group-hover:bg-indigo-500/10 transition-colors`}>
              <Calendar size={14} className="text-indigo-500" />
            </div>
            {event.date}
          </div>
          <div className="flex items-center text-zinc-500 text-sm">
            <div className={`w-8 h-8 rounded-lg ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'} flex items-center justify-center mr-3 group-hover:bg-indigo-500/10 transition-colors`}>
              <MapPin size={14} className="text-indigo-500" />
            </div>
            {event.location}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-inherit pt-5">
          <div className="flex flex-col">
            <span className={`text-[9px] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'} font-black uppercase tracking-widest mb-0.5`}>Entry Price</span>
            <div className={`${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'} font-black text-lg flex items-center`}>
              {event.price.toFixed(2)}
              <span className="text-[10px] text-indigo-500 font-bold ml-1.5 opacity-80 uppercase">Algo</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('explore')}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:bg-indigo-600 hover:text-white cursor-pointer active:scale-90 ${theme === 'dark' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-zinc-50 text-zinc-500 border-zinc-200 shadow-sm'} border`}
              title="Global Market"
            >
              <Compass size={16} />
            </button>
            {event.status === "Sold Out" ? (
              <button disabled className={`px-5 py-2.5 ${theme === 'dark' ? 'bg-zinc-800 text-zinc-600 border-zinc-700' : 'bg-zinc-50 text-zinc-400 border-zinc-200 shadow-sm'} rounded-xl cursor-not-allowed text-[9px] font-black uppercase tracking-widest border`}>
                Closed
              </button>
            ) : (
              <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-indigo-500/30 active:scale-95 cursor-pointer">
                Unlock
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} p-6 rounded-3xl border hover:border-indigo-500/50 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all group cursor-default`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500 group-hover:scale-110 transition-transform">
                    <Ticket size={24} />
                  </div>
                  <span className="text-emerald-500 text-[10px] font-black bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">+2 Active</span>
                </div>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Owned Tickets</h4>
                <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-zinc-900'} mt-2`}>12</p>
              </div>
              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} p-6 rounded-3xl border hover:border-amber-500/50 hover:shadow-[0_20px_50px_rgba(245,158,11,0.1)] transition-all group cursor-default`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform">
                    <Wallet size={24} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>ALGO Mainnet</span>
                </div>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Wallet Balance</h4>
                <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-zinc-900'} mt-2`}>452.80 <span className="text-xs font-medium text-zinc-500">ALGO</span></p>
              </div>
              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} p-6 rounded-3xl border hover:border-purple-500/50 hover:shadow-[0_20px_50px_rgba(168,85,247,0.1)] transition-all group cursor-default`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500 group-hover:scale-110 transition-transform">
                    <TrendingUp size={24} />
                  </div>
                  <span className="text-purple-500 text-[10px] font-black bg-purple-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Growth +12%</span>
                </div>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Portfolio Value</h4>
                <p className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-zinc-900'} mt-2`}>$1,240.00</p>
              </div>
            </div>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'} flex items-center`}>
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-4 animate-ping"></span>
                  Live Sessions
                </h2>
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`px-4 py-2 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} rounded-xl text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-zinc-100 hover:bg-indigo-600 hover:border-indigo-600 transition-all active:scale-95`}
                >
                  View Market
                </button>
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
                <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>Future Drops</h2>
                <button className={`px-4 py-2 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} rounded-xl text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-zinc-100 hover:bg-indigo-600 hover:border-indigo-600 transition-all active:scale-95`}>Calendar</button>
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
            <section className={`relative h-64 rounded-[3rem] overflow-hidden group shadow-2xl border ${theme === 'dark' ? 'border-zinc-800 shadow-indigo-500/10' : 'border-zinc-200 shadow-zinc-200'}`}>
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
              <div className={`flex items-center space-x-2 p-1.5 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
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
                  <p className={`text-lg font-black ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'} italic`}>42.8K <span className="text-indigo-400 not-italic">ALGO</span></p>
                </div>
                <div className={`w-[1px] h-10 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Floor Price</p>
                  <p className={`text-lg font-black ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'} italic`}>12.5 <span className="text-indigo-400 not-italic">ALGO</span></p>
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
            <h2 className={`text-3xl font-black ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>Ticket Vault</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {MY_TICKETS.map(ticket => (
                <div key={ticket.id} className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 flex items-center justify-between group hover:border-indigo-500/50 transition-all duration-300">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-500">
                      <Ticket size={40} />
                    </div>
                    <div>
                      <h3 className={`font-black text-xl ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'} mb-1`}>{ticket.event}</h3>
                      <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">{ticket.date}</p>
                      <div className={`flex items-center mt-3 px-2 py-1 ${theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-100'} rounded-lg w-fit`}>
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
              <div className={`border-2 border-dashed ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'} rounded-3xl p-8 flex flex-col items-center justify-center text-zinc-500 hover:border-indigo-500/50 hover:text-indigo-500 hover:bg-indigo-500/5 transition-all cursor-pointer group active:scale-[0.98]`}>
                <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
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
              <h2 className={`text-3xl font-black ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'} uppercase italic tracking-tighter`}>Digital Vault</h2>
              <button onClick={handleConnect} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center space-x-3 transition-all active:scale-95">
                <Repeat size={18} />
                <span>Sync Node</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Asset Card */}
              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'} border rounded-[2.5rem] p-10 relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-12 opacity-5 -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-700">
                  <Wallet size={200} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/20">
                      Live Balance
                    </span>
                    <button className={`p-3 rounded-xl transition-all active:scale-95 ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200'}`}>
                      <Repeat size={16} className="text-zinc-400" />
                    </button>
                  </div>
                  <div className="mt-8 flex items-end space-x-4">
                    <h3 className={`text-6xl font-black ${theme === 'dark' ? 'text-white' : 'text-zinc-900'} italic tracking-tighter`}>452.80</h3>
                    <span className="text-2xl font-bold text-zinc-500 mb-2">ALGO</span>
                  </div>
                  <p className="text-zinc-500 font-medium mt-4 max-w-sm">
                    Secured by <span className="text-indigo-400 italic font-black">Algorand Mainnet</span>. Assets are non-custodial and synchronized in real-time.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowWalletModal('transfer')}
                      className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
                    >
                      Transfer Funds
                    </button>
                    <button
                      onClick={() => setShowWalletModal('request')}
                      className={`py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'}`}
                    >
                      Request Asset
                    </button>
                  </div>
                </div>
              </div>

              {/* Transaction History Simulation */}
              <div className={`${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'} border rounded-[2.5rem] p-10`}>
                <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'} mb-8 uppercase italic tracking-tighter`}>Recent Activities</h3>
                <div className="space-y-6">
                  {[
                    { action: 'Ticket Minted', time: '12h ago', amount: '-45.00', icon: Zap, color: 'text-amber-500' },
                    { action: 'Transfer Received', time: '2d ago', amount: '+120.00', icon: ArrowRight, color: 'text-emerald-500' },
                    { action: 'Vault Sync', time: '5d ago', amount: '0.00', icon: ShieldCheck, color: 'text-indigo-500' }
                  ].map((tx, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 border transition-all cursor-pointer group rounded-2xl ${theme === 'dark' ? 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700' : 'bg-zinc-50/50 border-zinc-100 hover:border-indigo-200'}`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white shadow-sm'} ${tx.color}`}>
                          <tx.icon size={18} />
                        </div>
                        <div>
                          <p className={`text-sm font-bold group-hover:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{tx.action}</p>
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
            <h2 className={`text-3xl font-black ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>User Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`md:col-span-1 border p-8 rounded-3xl ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative group">
                    <img src={userProfile.avatar} alt="Profile" className="w-24 h-24 rounded-2xl mb-4 border-2 border-indigo-500/20 group-hover:border-indigo-500 transition-all" />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Sparkles size={20} className="text-white" />
                    </div>
                  </div>
                  <h3 className={`text-xl font-black mb-1 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{userProfile.name}</h3>
                  <p className="text-zinc-500 text-sm mb-6">Session: X92A-44</p>
                  <button className="w-full px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-xl font-bold text-sm transition-all">Change Avatar</button>
                </div>
              </div>
              <div className={`md:col-span-2 border p-8 rounded-3xl space-y-6 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>
                <div>
                  <label className="text-zinc-400 text-sm font-bold uppercase tracking-widest block mb-2">Full Name</label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`}
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-sm font-bold uppercase tracking-widest block mb-2">Email Address</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`}
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-sm font-bold uppercase tracking-widest block mb-2">Wallet Address</label>
                  <input type="text" value={connectedAccount || "Not Linked"} disabled className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-not-allowed font-mono ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-400'}`} />
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
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-[#09090b] text-zinc-100' : 'bg-zinc-50 text-zinc-900'} font-sans selection:bg-indigo-500/30 transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 ${theme === 'dark'
        ? 'bg-[#09090b] bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.05),transparent)] border-zinc-900 shadow-[20px_0_50px_rgba(0,0,0,0.3)]'
        : 'bg-white bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.03),transparent)] border-zinc-100 shadow-2xl'} 
        border-r z-50 flex flex-col transition-all duration-500`}>
        <div className="p-8 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full group-hover:bg-indigo-500/40 transition-all"></div>
              <img src="/Ticket.png" alt="AlgoTix Logo" className="w-10 h-10 object-contain relative z-10 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />
            </div>
            <div>
              <h1 className={`text-xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-zinc-900'} hover:text-indigo-500 transition-colors cursor-default`}>AlgoTix</h1>
              <p className={`text-[8px] font-black uppercase tracking-[0.3em] opacity-80 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Protocol V2</p>
            </div>
          </div>
        </div>

        <nav className="px-4 mt-2 space-y-1.5">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="tickets" icon={Ticket} label="My Vault" />
          <SidebarItem id="explore" icon={Compass} label="Marketplace" />
          <SidebarItem id="profile" icon={User} label="User Config" />
          <button
            onClick={() => setShowCalendar(true)}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group overflow-hidden ${theme === 'dark' ? 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900/80' : 'text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50/80 shadow-sm'}`}
          >
            <Calendar size={20} className="text-zinc-600 group-hover:text-indigo-500 transition-transform duration-500 group-hover:scale-110" />
            <span className="relative z-10">Events Schedule</span>
          </button>
        </nav>

        <div className="p-6 border-t border-zinc-900 space-y-4">
          {connectedAccount ? (
            <div className={`border ${theme === 'dark' ? 'bg-zinc-900/50 border-emerald-500/20' : 'bg-emerald-500/5 border-emerald-500/20'} rounded-2xl p-5 group relative overflow-hidden transition-all`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Live Node</span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                  title="Terminate Connection"
                >
                  <LogOut size={12} />
                </button>
              </div>
              <p className={`text-[10px] ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-500'} font-mono truncate mb-4`}>
                {connectedAccount?.toString()}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => setShowWalletModal('transfer')}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                  Transfer
                </button>
                <button
                  onClick={() => setShowWalletModal('request')}
                  className={`px-3 py-2 ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200' : 'bg-white hover:bg-zinc-50 text-zinc-600 border border-zinc-200'} rounded-lg text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm`}
                >
                  Request
                </button>
              </div>
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

          <div className={`${theme === 'dark' ? 'bg-zinc-900 shadow-xl' : 'bg-white shadow-sm'} rounded-2xl p-4 border ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'} mb-4`}>
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${algoStatus.connected ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {algoStatus.connected ? 'Node Connected' : 'Node Offline'}
              </span>
            </div>
            <p className={`text-[11px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'} font-mono`}>
              {algoStatus.connected ? `Round: #${algoStatus.last_round}` : 'Waiting for backend...'}
            </p>
            {algoStatus.app_id > 0 && (
              <>
                <p className="text-[9px] text-indigo-400 font-mono mt-1">App ID: {algoStatus.app_id}</p>
                <p className={`text-[9px] ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'} font-mono`}>Network: Testnet</p>
              </>
            )}
            {algoStatus.asset_id > 0 && (
              <p className="text-[9px] text-emerald-500 font-mono">Asset ID: {algoStatus.asset_id}</p>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-grow min-h-screen">
        {/* Top Header */}
        <header className={`sticky top-0 z-40 backdrop-blur-xl border-b px-10 py-6 flex items-center justify-between transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950/80 border-zinc-900' : 'bg-white/80 border-zinc-200 shadow-sm'}`}>
          <div className="relative w-full max-w-lg group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search cosmic events, tickets, or nodes..."
              className={`w-full border rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800 focus:bg-zinc-900 text-white placeholder:text-zinc-700' : 'bg-zinc-100/50 border-zinc-200 focus:bg-white text-zinc-900 placeholder:text-zinc-400'
                }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-3 rounded-2xl border transition-all active:scale-90 group ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800 hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]' : 'bg-white border-zinc-200 text-indigo-600 shadow-sm hover:border-indigo-600 hover:shadow-lg'
                }`}
            >
              {theme === 'dark' ? <Sun size={20} className="group-hover:rotate-45 transition-transform" /> : <Moon size={20} className="group-hover:-rotate-12 transition-transform" />}
            </button>

            <div className="relative group">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative transition-all p-3 rounded-2xl border active:scale-90 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.1)] ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-indigo-500/50' : 'bg-white border-zinc-200 text-zinc-500 hover:text-indigo-600 shadow-sm hover:border-indigo-600'
                  }`}
              >
                <Bell size={20} className="group-hover:animate-bounce" />
                {notifications.length > 0 && (
                  <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full border-2 border-inherit animate-pulse shadow-[0_0_10px_#6366f1]"></span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-4 w-72 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 shadow-2xl' : 'bg-white border-zinc-200 shadow-xl'} z-[60] overflow-hidden animate-in fade-in slide-in-from-top-4`}>
                  <div className="p-4 border-b border-inherit bg-indigo-600/5">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Notifications</h5>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-inherit last:border-0 hover:bg-indigo-500/5 transition-colors cursor-pointer">
                        <p className="text-xs font-bold leading-tight mb-1">{n.text}</p>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-[1px] bg-zinc-800/50"></div>
            <div className="relative">
              <div
                className="flex items-center space-x-3 group cursor-pointer active:scale-95 transition-all"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="text-right hidden sm:block">
                  <p className={`text-xs font-black ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'} group-hover:text-indigo-500 transition-colors`}>{userProfile.name}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 p-1 ring-2 ring-transparent group-hover:ring-indigo-600/20">
                  <img src={userProfile.avatar} alt="user" className="w-full h-full rounded-lg bg-zinc-800" />
                </div>
              </div>

              {showProfileMenu && (
                <div className={`absolute right-0 mt-4 w-56 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-950 border-zinc-900 shadow-2xl' : 'bg-white border-zinc-200 shadow-xl'} z-[60] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300`}>
                  <div className="p-2">
                    <button
                      onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${theme === 'dark' ? 'text-zinc-300 hover:bg-zinc-900 hover:text-white' : 'text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
                    >
                      <User size={16} />
                      <span className="text-xs font-bold">Profile Config</span>
                    </button>
                    <div className={`h-[1px] my-1 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100'}`}></div>
                    <button
                      onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                      className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all text-red-500 hover:bg-red-500/10 active:scale-95 group/logout"
                    >
                      <LogOut size={16} className="group-hover/logout:translate-x-1 transition-transform" />
                      <span className="text-xs font-black uppercase tracking-wider">Terminate Session</span>
                    </button>
                  </div>
                </div>
              )}
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
        onClick={toggleAssistant}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 z-[70] group overflow-hidden ${isAssistantOpen ? 'bg-zinc-800 rotate-90 scale-90' : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-110 hover:-translate-y-2'
          }`}
      >
        {isAssistantOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {(!isAssistantOpen && unreadCount > 0) && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-bounce shadow-lg ring-4 ring-indigo-600"></div>
        )}
      </button>

      {/* AI Assistant Panel */}
      {isAssistantOpen && (
        <>
          <div
            className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-[65] animate-in fade-in duration-300"
            onClick={() => setIsAssistantOpen(false)}
          ></div>
          <div className={`fixed bottom-28 right-8 w-[360px] h-[520px] border rounded-[3rem] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] z-[70] flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 fade-in duration-500 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
            }`}>
            <div className="p-8 bg-indigo-600 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-5">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl leading-none">AlgoTix AI</h3>
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

            <div className={`flex-grow overflow-y-auto p-8 space-y-6 ${theme === 'dark' ? 'bg-zinc-950/20' : 'bg-zinc-50/50'}`}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10'
                    : `${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-600 shadow-sm'} border rounded-tl-none`
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`p-4 rounded-3xl rounded-tl-none border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
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

            <div className={`p-6 border-t backdrop-blur-md ${theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-zinc-200'}`}>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Message AlgoTix..."
                  className={`w-full border rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-700' : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400'
                    }`}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isTyping}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg active:scale-90"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Wallet Action Modals */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" onClick={() => setShowWalletModal(null)}></div>
          <div className={`relative border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
            }`}>
            <h3 className={`text-lg font-black italic uppercase tracking-tighter mb-5 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
              {showWalletModal === 'transfer' ? 'Transfer ALGO' : 'Request Assets'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1.5">Recipient Address</label>
                <input type="text" placeholder="Wallet Address..." className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500/50 outline-none ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`} />
              </div>
              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1.5">Amount (ALGO)</label>
                <input type="number" placeholder="0.00" className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500/50 outline-none ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`} />
              </div>
              <button
                onClick={() => {
                  alert("Transaction broadcast to Algorand Mainnet!");
                  setShowWalletModal(null);
                }}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest text-[9px] active:scale-95 transition-all mt-3"
              >
                Sign Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal Overlay */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setShowQR(null)}
          ></div>
          <div className={`relative w-full max-w-sm rounded-[2rem] p-8 border shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden group ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
            }`}>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
            <div className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-zinc-100'} rounded-2xl flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <ShieldCheck size={32} />
              </div>
              <h3 className={`text-xl font-black mb-1 tracking-tight ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>{showQR.event}</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Entry Token Validation</p>

              <div className="bg-white p-6 rounded-[1.5rem] mb-6 shadow-xl relative">
                <div className="w-40 h-40 bg-zinc-50 flex flex-wrap items-center justify-center gap-1 overflow-hidden rounded-lg">
                  {[...Array(64)].map((_, i) => (
                    <div key={i} className={`w-3.5 h-3.5 rounded-sm ${Math.random() > 0.4 ? 'bg-zinc-950' : 'bg-transparent'}`}></div>
                  ))}
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-3 mb-6">
                <div className={`${theme === 'dark' ? 'bg-zinc-950/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} p-3 rounded-xl border`}>
                  <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest block mb-0.5">Vault ID</span>
                  <span className="text-[10px] text-indigo-500 font-mono font-bold tracking-tight">{showQR.nftId}</span>
                </div>
                <div className={`${theme === 'dark' ? 'bg-zinc-950/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} p-3 rounded-xl border`}>
                  <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest block mb-0.5">Expires In</span>
                  <span className={`text-[10px] font-mono font-bold tracking-tight ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>04:59s</span>
                </div>
              </div>

              <button
                onClick={() => setShowQR(null)}
                className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] transition-all active:scale-95"
              >
                Close Secure Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowCalendar(false)}></div>
          <div className={`relative w-full max-w-md ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'bg-white border-zinc-200 shadow-2xl'} border rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-300`}>
            <div className="p-8 border-b border-inherit bg-indigo-600/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-2xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Event Calendar</h3>
                  <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</p>
                </div>
                <button onClick={() => setShowCalendar(false)} className={`p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-7 gap-3 text-center mb-6">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <span key={i} className={`text-[10px] font-black ${theme === 'dark' ? 'text-zinc-700' : 'text-zinc-400'}`}>{d}</span>
                ))}
                {[...Array(30)].map((_, i) => {
                  const day = i + 1;
                  const isToday = day === new Date().getDate();
                  const hasEvent = [12, 15, 20, 24].includes(day);
                  return (
                    <div
                      key={i}
                      className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all relative group cursor-pointer
                        ${isToday
                          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30'
                          : `hover:bg-indigo-500/10 ${theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-indigo-600'}`}`}
                    >
                      <span className="text-xs font-black">{day}</span>
                      {hasEvent && !isToday && <div className="absolute bottom-2 w-1 h-1 bg-indigo-500 rounded-full shadow-[0_0_5px_#6366f1]"></div>}
                    </div>
                  );
                })}
              </div>
              <div className={`p-5 rounded-3xl ${theme === 'dark' ? 'bg-zinc-900 shadow-inner' : 'bg-zinc-50'} border ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'} transition-all`}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_#6366f1]"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Upcoming Highlight</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>Galaxy Gala: An Orchestral Journey</p>
                  <span className="text-[9px] text-indigo-500 font-bold">Nov 12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
