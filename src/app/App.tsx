import { useEffect, useRef, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  Calendar, Trophy, Users, Zap, Code, Clock, 
  MapPin, Download, ChevronRight, Award, Rocket, PhoneCall
} from 'lucide-react';
import { CountdownTimer } from './components/CountdownTimer';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const [activeDay, setActiveDay] = useState(1);
  const [activeScheduleCard, setActiveScheduleCard] = useState<number | null>(null);
  
  // Mobile Detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); 
    };
    checkMobile(); 
    window.addEventListener('resize', checkMobile); 
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop Scroll Animation Timeline
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  const opacity3D = useTransform(scrollYProgress, [0.75, 0.85], [1, 0]);
  const bgOverlayOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
  
  const logoOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
  const logoScale = useTransform(scrollYProgress, [0.75, 0.85], [4, 1]); 
  const logoY = useTransform(scrollYProgress, [0.85, 0.9], [0, -200]); 

  const ctaOpacity = useTransform(scrollYProgress, [0.88, 0.98], [0, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.88, 0.98], [0.8, 1]);
  const ctaY = useTransform(scrollYProgress, [0.88, 0.98], [50, 0]);
  const ctaFilter = useTransform(scrollYProgress, [0.88, 0.98], ["blur(20px)", "blur(0px)"]);
  
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // Date
  const eventDate = new Date('2026-03-12T10:00:00');

  const prizes = [
    { place: '1st Place', amount: '₹20,000', icon: Trophy, color: 'from-yellow-400 to-orange-500' },
    { place: '2nd Place', amount: '₹10,000', icon: Award, color: 'from-gray-300 to-gray-400' },
  ];

  const scheduleDay1 = [
    { time: '10:00 AM', event: 'Inaugural Ceremony & Theme Disclosure', description: 'Start the Digital Arena with the opening ceremony, introductions, and the official reveal of the hackathon theme.' },
    { time: '11:00 AM', event: 'Hackathon Begins', description: 'The arena opens! Teams start brainstorming, planning, and building their solutions.' },
    { time: '12:00 PM', event: 'Mandatory First Commit', description: 'Teams must make their first official submission to mark the start of their project development.' },
    { time: '04:00 PM', event: 'Checkpoint 1', description: 'A quick progress check with mentors to review ideas, solve blockers, and refine your direction.' },
    { time: '09:00 PM', event: 'Checkpoint 2', description: 'Another progress review where mentors provide guidance and help you prepare for the final stretch.' },
  ];

  const scheduleDay2 = [
    { time: '09:00 AM', event: 'Reporting', description: 'Teams report to campus and prepare for the final sprint of the hackathon.' },
    { time: '11:00 AM', event: 'Final Commit Deadline', description: 'All coding must stop! Submit your final code and other requirements.' },
    { time: '12:00 PM', event: 'Project Presentations', description: 'Showcase your innovations and demonstrate your solution to the judges.' },
    { time: '02:00 PM', event: 'Valedictory & Prize Distribution', description: 'Winners announcement and closing remarks.' },
  ];

  const coordinators = [
    { name: 'Daniel Fernandes', role: 'Coordinator', phone: '+91 89999 08454', image: '/daniel.jpg' },
    { name: 'Chris Dias', role: 'Coordinator', phone: '+91 93215 36870', image: '/chris.jpg' },
  ];

  return (
    <div ref={containerRef} className="relative bg-black text-white clip-path-auto">
      
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] animate-grain" />
        </div>
      )}

      {/* =========================================
          HERO SECTION: MOBILE 
          ========================================= */}
      {isMobile && (
        <section className="relative min-h-[100svh] w-full bg-black flex flex-col items-center justify-center pt-12 pb-20 px-4 overflow-hidden z-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-950/60 via-black to-black z-0 pointer-events-none" />
          
          {/* THE 360 HORIZONTAL FLIP LOGO*/}
          <motion.div 
            className="relative z-10 flex items-center justify-center mb-10 mt-8"
            initial={{ rotateY: -360, scale: 0.5, opacity: 0 }}
            animate={{ rotateY: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }} 
          >
            <div className="absolute w-[200px] h-[200px] bg-purple-600/50 rounded-full blur-[70px]" />
            <img 
              src="/hackwarz-logo.png" 
              alt="HackWarz 2026 Official Crest" 
              className="relative z-10 w-[85vw] max-w-[280px] h-auto object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.7)]"
            />
          </motion.div>

          {/* WELCOME TEXT SLIDE UP */}
          <motion.div 
            className="relative z-20 w-full text-center space-y-3 mb-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              Welcome to the Arena
            </h2>
            <p className="text-sm text-purple-300/80 tracking-[0.2em] font-bold drop-shadow-md">
              CODE. COMPETE. CONQUER.
            </p>
          </motion.div>

          {/* TIMER SLIDE UP */}
          <motion.div 
            className="relative z-20 mb-10 scale-[0.85] w-[90%] mx-auto flex justify-center filter drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <CountdownTimer targetDate={eventDate} />
          </motion.div>

          {/* BUTTONS SLIDE UP */}
          <motion.div 
            className="relative z-20 flex flex-col gap-4 w-full max-w-sm px-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 2.1 }}
          >
            <a href="https://forms.gle/1Wni9ez4CtD32DU16" target="_blank" rel="noopener noreferrer" className="w-full">
              <button className="w-full group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <span className="relative flex items-center justify-center gap-2 font-bold text-lg text-white tracking-wide">
                  Register Now
                  <ChevronRight className="w-5 h-5" />
                </span>
              </button>
            </a>
            <a href="/HAckwarz_brochure.pdf" download="Hackwarz_2026_brochure.pdf" className='W-full'>
            <button className="w-full px-8 py-4 border border-purple-500/50 rounded-xl bg-black/50 backdrop-blur-sm text-purple-300 font-bold text-lg flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Brochure
            </button>
            </a>
          </motion.div>
        </section>
      )}


      {/* =========================================
          HERO SECTION: DESKTOP
          ========================================= */}
      {!isMobile && (
        <section ref={heroRef} className="relative h-[400vh] w-full bg-black">
          <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center">
            
            <motion.div 
              className="absolute inset-0 w-full h-full z-0 pointer-events-none"
              style={{ opacity: opacity3D }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-black z-10 pointer-events-none" />
              <Spline scene="https://prod.spline.design/wBr5Q2bC0Qtlzb1q/scene.splinecode" />
            </motion.div>

            <motion.div 
              className="absolute inset-0 z-0 pointer-events-none"
              style={{ opacity: bgOverlayOpacity }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/50 via-black to-black" />
            </motion.div>

            <motion.div 
              className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
              style={{ opacity: logoOpacity, scale: logoScale, y: logoY }}
            >
              <div className="absolute w-[350px] h-[350px] bg-purple-600/40 rounded-full blur-[100px]" />
              <img 
                src="/hackwarz-logo.png" 
                alt="HackWarz 2026 Official Crest" 
                className="relative z-10 w-[80vw] max-w-[350px] h-auto object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]"
              />
            </motion.div>

            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center pt-[45vh] px-4 z-20 pointer-events-auto w-full max-w-4xl mx-auto"
              style={{ opacity: ctaOpacity, scale: ctaScale, y: ctaY, filter: ctaFilter }}
            >
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                  Welcome to the Arena
                </h2>
                <p className="text-xl text-purple-300/80 tracking-[0.2em] font-bold drop-shadow-md">
                  CODE. COMPETE. CONQUER.
                </p>
              </div>

              <div className="mb-8 filter drop-shadow-[0_0_20px_rgba(168,85,247,0.3)] w-full flex justify-center">
                <CountdownTimer targetDate={eventDate} />
              </div>

              <div className="flex flex-row gap-4 w-auto px-0">
                <a href="https://forms.gle/1Wni9ez4CtD32DU16" target="_blank" rel="noopener noreferrer" className="w-auto">
                  <button className="w-full group relative px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 pointer-events-auto shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center justify-center gap-2 font-bold text-xl text-white tracking-wide">
                      Register Now
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </a>
                <a href="/brochure.pdf" download="Hackwarz_2026_brochure.pdf" className='W-full'>
                <button className="w-auto group relative px-10 py-4 border-2 border-purple-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:border-pink-500 pointer-events-auto bg-black/50 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
                  <span className="relative flex items-center justify-center gap-3 font-bold text-xl text-purple-300 group-hover:text-pink-300 transition-colors tracking-wide">
                    <Download className="w-6 h-6" />
                    Brochure
                  </span>
                </button>
                </a>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
              style={{ opacity: scrollIndicatorOpacity }}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex flex-col items-center gap-3">
                <span className="text-purple-400/80 text-sm tracking-[0.3em] font-bold uppercase">Scroll to Enter</span>
                <div className="w-6 h-10 border-2 border-purple-500/50 rounded-full flex items-start justify-center p-2">
                  <div className="w-1.5 h-2.5 bg-purple-500 rounded-full" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Other section */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden z-40 bg-black border-t border-purple-900/50 shadow-[0_-30px_60px_rgba(0,0,0,1)]">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-black pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 pb-2 md:pb-4">
              About HackWarz
            </h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-lg md:text-xl text-purple-200/80 leading-relaxed">
                HackWarz 2K26 is not just another hackathon. It's a 24-hour digital battlefield where the brightest 
                minds converge to build the future. Enter the arena, face real-world problem statements, and emerge as a champion.
              </p>
              <p className="text-lg md:text-xl text-purple-200/80 leading-relaxed">
                Backed by industry experts from Luarc Technology, HackWarz provides the platform, structured mentorship, 
                and resources to transform your wildest ideas into a functional reality.
              </p>
              
              <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400">
                    Hybrid
                  </div>
                  <div className="text-xs md:text-sm text-purple-300 mt-1 md:mt-2">Mode</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400">
                    24h
                  </div>
                  <div className="text-xs md:text-sm text-purple-300 mt-1 md:mt-2">Non-Stop</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400">
                    ₹30K
                  </div>
                  <div className="text-xs md:text-sm text-purple-300 mt-1 md:mt-2">In Prizes</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative mt-8 md:mt-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-3xl" />
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-purple-500/30">
                <ImageWithFallback
                  src="/about.jpg"
                  alt="Hackathon"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 pb-2 md:pb-4">
              Event Format
            </h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Users,
                title: 'Team Formation',
                description: 'Gather your squad! Teams must strictly consist of exactly 3 members from the same college.',
              },
              {
                icon: Code,
                title: 'Build & Innovate',
                description: '24 hours of non-stop hybrid coding with access to mentors, workshops, and resources.',
              },
              {
                icon: Rocket,
                title: 'Present & Win',
                description: 'Showcase your project to judges and compete for amazing prizes and opportunities.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative h-full bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 md:p-8 hover:border-pink-500/50 transition-all duration-300">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4 md:mb-6">
                    <item.icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-purple-200">{item.title}</h3>
                  <p className="text-sm md:text-base text-purple-300/80 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 px-4 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 pb-2 md:pb-4">
              Schedule
            </h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </motion.div>

          <div className="flex justify-center mb-16 relative z-20">
            <div className="bg-purple-950/30 p-1.5 rounded-full border border-purple-500/30 flex shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <button 
                onClick={() => { setActiveDay(1); setActiveScheduleCard(null); }}
                className={`relative px-8 py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${activeDay === 1 ? 'text-white' : 'text-purple-400 hover:text-purple-200'}`}
              >
                {activeDay === 1 && (
                  <motion.div 
                    layoutId="activeDayBg" 
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]" 
                  />
                )}
                <span className="relative z-10">Day 1</span>
              </button>

              <button 
                onClick={() => { setActiveDay(2); setActiveScheduleCard(null); }}
                className={`relative px-8 py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${activeDay === 2 ? 'text-white' : 'text-purple-400 hover:text-purple-200'}`}
              >
                {activeDay === 2 && (
                  <motion.div 
                    layoutId="activeDayBg" 
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]" 
                  />
                )}
                <span className="relative z-10">Day 2</span>
              </button>
            </div>
          </div>

          <div className="relative mt-8">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500" />

            <div className="space-y-8 md:space-y-12">
              <AnimatePresence mode="wait">
                {(activeDay === 1 ? scheduleDay1 : scheduleDay2).map((item, index) => (
                  <motion.div
                    key={`${activeDay}-${index}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
                  >
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-black z-10" />

                    <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'} w-full pr-4`}>
                      <div 
                        onClick={() => setActiveScheduleCard(activeScheduleCard === index ? null : index)}
                        className="relative group cursor-pointer"
                      >
                        <div className={`absolute inset-0 rounded-xl transition-all duration-500 blur-xl ${
                          activeScheduleCard === index 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 opacity-70' 
                            : 'bg-transparent opacity-0 group-hover:bg-purple-600/20 group-hover:opacity-100'
                        }`} />
                        
                        <div className={`relative bg-black/80 backdrop-blur-sm border rounded-xl p-5 md:p-6 transition-all duration-500 ${
                          activeScheduleCard === index 
                            ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)] scale-[1.02]' 
                            : 'border-purple-500/30 hover:border-purple-400/60'
                        }`}>
                          <div className="flex items-center gap-3 mb-2 md:mb-3">
                            <Clock className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-300 ${activeScheduleCard === index ? 'text-pink-400' : 'text-purple-400'}`} />
                            <span className={`font-bold text-sm md:text-base transition-colors duration-300 ${activeScheduleCard === index ? 'text-pink-400' : 'text-purple-400'}`}>{item.time}</span>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-purple-100 mb-1 md:mb-2">{item.event}</h3>
                          <p className="text-sm md:text-base text-purple-300/70">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 pb-2 md:pb-4">
              Prizes
            </h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
            {prizes.map((prize, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${prize.color} opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-300`} />
                <div className="relative bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 md:p-8 hover:border-pink-500/50 transition-all duration-300 text-center">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${prize.color} flex items-center justify-center mx-auto mb-4 md:mb-6`}>
                    <prize.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-purple-200">{prize.place}</h3>
                  <div className={`text-4xl md:text-5xl font-black mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-br ${prize.color}`}>
                    {prize.amount}
                  </div>
                  <p className="text-xs md:text-sm text-purple-300/80">+ Trophy + Certificates</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 md:mt-16 text-center px-4"
          >
            <p className="text-lg md:text-xl text-purple-300/80">
              Plus many more exciting opportunities <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">awaiting you!</span>
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 px-4 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 pb-2 md:pb-4">
              Registration
            </h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 md:p-12"
          >
            <div className="space-y-6 md:space-y-8">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-purple-200 mb-1 md:mb-2">When</h3>
                    <p className="text-sm md:text-base text-purple-300/80">March 12th - 13th, 2026.</p>
                    <p className="text-sm md:text-base text-purple-300/80">24 Hours of pure coding chaos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-purple-200 mb-1 md:mb-2">Where</h3>
                    <p className="text-sm md:text-base text-purple-300/80">The Day 2 final showdown will take place on campus at Rosary College of Commerce & Arts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-purple-200 mb-1 md:mb-2">Team Size</h3>
                    <p className="text-sm md:text-base text-purple-300/80">You must enter the arena as a team of exactly 3 members.</p>
                    <p className="text-sm md:text-base text-purple-300/80">All teammates must be from the same institution.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-purple-200 mb-1 md:mb-2">Who Can Join</h3>
                    <p className="text-sm md:text-base text-purple-300/80">Undergraduate students pursuing:</p>
                    <p className="text-xs md:text-sm text-purple-300/60 mt-1">B.E./B.Tech (Computer/IT/E&T), BCA, B.Sc. (CS/IT), B.Voc (Software/IT).</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 md:pt-8 border-t border-purple-500/30">
                <h3 className="text-xl md:text-2xl font-bold text-purple-200 mb-3 md:mb-4">What's Included</h3>
                <ul className="grid md:grid-cols-2 gap-2 md:gap-3">
                  {['Guidance and mentoring', 'Refreshments', 'Cash Prizes & Trophies', 'Career Opportunities'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm md:text-base text-purple-300/80">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 px-4 overflow-hidden z-20 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 pb-2 md:pb-4">
              Our Partners
            </h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative group rounded-2xl p-1 bg-gradient-to-br from-purple-600/30 to-pink-600/30 hover:from-purple-500/50 hover:to-pink-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-black rounded-xl p-8 md:p-12 flex flex-col items-center text-center">
                <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-4 tracking-wider">
                  Luarc Technology Private Limited
                </h3>
                <p className="text-purple-300/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                 Powering the future of innovation. We are proud to partner with Luarc Technology Private Limited, a Goa-based company specializing in AI-driven and mission-critical technology solutions. 
                 As our Official Mentoring & Judging Partner, Luarc brings industry insights, real-world problem-solving expertise, and valuable guidance to support participants throughout the HackWarz arena.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 pb-2 md:pb-4">
              Meet the Team
            </h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {coordinators.map((coordinator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative h-full bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 md:p-8 hover:border-pink-500/50 transition-all duration-300 text-center flex flex-col items-center">
                  
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full mb-4 md:mb-6 p-1 bg-gradient-to-br from-purple-600 to-pink-600 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-shadow duration-300">
                    <img 
                      src={coordinator.image} 
                      alt={coordinator.name} 
                      className="w-full h-full object-cover rounded-full bg-black"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden absolute inset-1 bg-black rounded-full flex items-center justify-center text-3xl font-bold text-white">
                      {coordinator.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-purple-200 mb-1">{coordinator.name}</h3>
                  <p className="text-purple-400 text-sm md:text-base mb-4">{coordinator.role}</p>
                  
                  <a 
                    href={`tel:${coordinator.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-200 hover:bg-pink-600 hover:border-pink-500 hover:text-white transition-all duration-300 text-sm font-medium mt-auto"
                  >
                    <PhoneCall className="w-4 h-4" />
                    {coordinator.phone}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 px-4 overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/40 to-black" />
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758404196311-70c62a445e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9uJTIwY2l0eSUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzcyNjM1MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Cyberpunk background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-8xl font-black mb-6 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 pb-2 md:pb-4">
            Ready to Battle?
          </h2>
          
          <p className="text-xl md:text-2xl text-purple-200/80 mb-8 md:mb-12 px-4">
            The arena awaits. Will you answer the call?
          </p>

          <a href="https://forms.gle/1Wni9ez4CtD32DU16" target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto px-4 sm:px-0">
            <button className="w-full group relative px-12 md:px-16 py-5 md:py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 blur-2xl bg-purple-500 opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-3 font-black text-xl md:text-2xl uppercase tracking-wider text-white">
                Enter the Arena
                <Zap className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
              </span>
            </button>
          </a>
        </motion.div>
      </section>

      <footer className="relative border-t border-purple-500/30 py-6 md:py-8 px-4 bg-black">
        <div className="max-w-6xl mx-auto text-center text-purple-300/60">
          <p className="text-sm md:text-base">&copy; 2026 HackWarz. All rights reserved.</p>
          <p className="text-xs md:text-sm mt-2">Built for HackWarz by Chris Dias & Mevin Quadros</p>
        </div>
      </footer>
    </div>
  );
}