import React, { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';

// --- Utility Components ---

/**
 * Generic 3D Tilt Container
 * Wraps any content to give it a 3D hover effect
 */
const TiltCard = ({ children, className = "" }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; 
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  return (
    <div 
      className={`relative perspective-1000 group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
      style={{ perspective: '1000px' }}
    >
      <div 
        className="transition-transform duration-200 ease-out transform-gpu preserve-3d h-full"
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// --- Core Components ---

const Navbar = ({ navigate, darkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('landing')}>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Ticket className="text-white w-6 h-6 transform -rotate-12" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
              AlgoTix
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('events')} className="text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">Explore Events</button>
            <button className="text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">How it Works</button>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={() => navigate('auth')} className="text-slate-700 dark:text-white border border-slate-300 dark:border-white/10 px-6 py-2 rounded-full text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
              Sign In
            </button>
            <button onClick={() => navigate('auth')} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105">
              Sign Up
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden items-center gap-4">
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-yellow-400"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => navigate('events')} className="text-slate-600 dark:text-slate-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Explore</button>
            <button onClick={() => navigate('auth')} className="text-slate-600 dark:text-slate-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Sign In</button>
            <button onClick={() => navigate('auth')} className="text-cyan-600 dark:text-cyan-400 font-bold block px-3 py-2 rounded-md text-base w-full text-left">Get Started</button>
          </div>
        </div>
      )}
    </nav>
  );
};

const HeroSection = ({ navigate }) => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-[120px] -z-10 transition-colors duration-500"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[100px] -z-10 transition-colors duration-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-sm font-semibold mb-6 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Live on Algorand Mainnet
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              Fraud-Proof <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 animate-gradient">
                NFT Tickets
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Experience the future of event ticketing. Secure, verifiable, and transferrable tickets powered by the Algorand blockchain.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => navigate('auth')}
                className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/20 dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('events')}
                className="px-8 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-full font-bold text-lg hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                Explore Events
              </button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
             {/* 3D Ticket Component Inlined for simplicity within context */}
             <div className="relative w-80 h-48 md:w-96 md:h-60 perspective-1000 group">
                <div className="w-full h-full duration-1000 animate-float ease-in-out transition-transform transform-gpu preserve-3d shadow-2xl rounded-2xl rotate-y-12 rotate-x-12 hover:rotate-y-0 hover:rotate-x-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl border border-white/20 shadow-[0_0_50px_rgba(6,182,212,0.5)] overflow-hidden flex flex-col justify-between p-6">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                    <div className="flex justify-between items-start z-10">
                      <div><span className="text-xs font-bold text-cyan-200 tracking-wider uppercase">Algorand NFT</span><h3 className="text-2xl font-black text-white mt-1">VIP ACCESS</h3></div>
                      <Ticket className="text-white/80 w-8 h-8" />
                    </div>
                    <div className="flex justify-between items-end z-10">
                      <div><p className="text-blue-100 text-sm font-mono">ID: #8942-ALGO</p><p className="text-white font-bold mt-1">Decentralized Events</p></div>
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg"><QrCode className="text-white w-6 h-6" /></div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <TiltCard className="h-full">
    <div className="h-full group p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-cyan-500/30 dark:hover:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 relative overflow-hidden transition-all duration-300">
      {/* Hover Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className={`relative z-10 w-14 h-14 rounded-2xl bg-${color}-50 dark:bg-slate-800 flex items-center justify-center mb-6 shadow-inner border border-${color}-100 dark:border-white/5 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-7 h-7 text-${color}-600 dark:text-${color}-400`} />
      </div>
      
      <h3 className="relative z-10 text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="relative z-10 text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  </TiltCard>
);

const AuthPage = ({ navigate }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('landing');
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Left Side - Visuals */}
        <div className="hidden md:flex flex-col justify-center">
          <TiltCard>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
               
               <h2 className="text-3xl font-bold text-white mb-4">
                 {isLogin ? "Welcome Back!" : "Join the Future"}
               </h2>
               <p className="text-slate-400 mb-8 leading-relaxed">
                 {isLogin 
                   ? "Access your NFT tickets, manage your events, and check your wallet balance." 
                   : "Create an account to start buying and selling fraud-proof tickets on Algorand."}
               </p>

               <div className="space-y-4">
                 <div className="flex items-center gap-4 text-slate-300">
                   <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                     <ShieldCheck className="w-5 h-5 text-cyan-400" />
                   </div>
                   <div>
                     <p className="font-bold text-white">Bank-Grade Security</p>
                     <p className="text-xs">Powered by Algorand</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4 text-slate-300">
                   <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                     <Zap className="w-5 h-5 text-purple-400" />
                   </div>
                   <div>
                     <p className="font-bold text-white">Instant Transfer</p>
                     <p className="text-xs">Send tickets in seconds</p>
                   </div>
                 </div>
               </div>
            </div>
          </TiltCard>
        </div>

        {/* Right Side - Form */}
        <TiltCard>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {!isLogin && (
                <div className="relative group">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                  />
                </div>
              )}
              
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : (
                  <>
                    {isLogin ? "Sign In" : "Get Started"} <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or continue with</span>
              </div>
            </div>

            <button className="w-full bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/50 text-yellow-600 dark:text-yellow-400 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-3">
              <Wallet className="w-5 h-5" />
              Connect Pera Wallet
            </button>
          </div>
        </TiltCard>
      </div>
    </div>
  );
};

const LandingPage = ({ navigate }) => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const PlaceholderPage = ({ title }) => (
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-900 dark:text-white transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">This page is under construction.</p>
      <button 
        onClick={() => navigate('landing')}
        className="px-6 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 transition-colors"
      >
        Back to Home
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-800 dark:selection:text-cyan-200 ${darkMode ? 'dark' : ''}`}>
      <Navbar navigate={navigate} darkMode={darkMode} toggleTheme={toggleTheme} />
      
      <div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <HeroSection navigate={navigate} />
        <div className="py-24 relative bg-white dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Why AlgoTix?</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Built on pure proof-of-stake to ensure your event experience is seamless, secure, and sustainable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard 
                icon={Ticket}
                title="NFT Tickets"
                description="Every ticket is a unique asset on the blockchain. You truly own it."
                color="cyan"
              />
              <FeatureCard 
                icon={QrCode}
                title="QR Verification"
                description="Dynamic QR codes that change every 30 seconds to prevent screenshots."
                color="blue"
              />
              <FeatureCard 
                icon={ShieldCheck}
                title="100% Fraud Proof"
                description="Blockchain immutability makes it impossible to duplicate tickets."
                color="purple"
              />
              <FeatureCard 
                icon={Repeat}
                title="Easy Resale"
                description="Sell your ticket safely on our marketplace with price caps."
                color="pink"
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/5 pt-16 pb-8 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Ticket className="text-white w-4 h-4 transform -rotate-12" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">AlgoTix</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                  The world's most secure ticketing platform powered by the Algorand blockchain. Democratizing access to events.
                </p>
              </div>
              
              <div>
                <h4 className="text-slate-900 dark:text-white font-bold mb-4">Platform</h4>
                <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                  <li className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors">Browse Events</li>
                  <li className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors">Sell Tickets</li>
                  <li className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors">Secondary Market</li>
                </ul>
              </div>

              <div>
                <h4 className="text-slate-900 dark:text-white font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                  <li className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors">Help Center</li>
                  <li className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors">Contact Us</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-500 text-sm">© 2024 AlgoTix Inc. All rights reserved.</p>
              <p className="text-slate-600 dark:text-slate-600 text-sm flex items-center gap-2">
                Powered by <span className="text-slate-900 dark:text-slate-400 font-semibold">Algorand</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
