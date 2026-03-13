import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import Confetti from 'react-confetti';
import Papa from 'papaparse';
import { db, auth } from '../../firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Trophy, Users, Award, Zap, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export default function Results() {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [displayState, setDisplayState] = useState({
    showVoting: false,
    revealPeersAward: false,
    revealRunnerUp: false,
    revealWinner: false,
    teamLeadersOnly: false, // NEW: Team Leaders Only Mode
    winnerName: '',
    runnerUpName: '',
    peersAwardName: '',
  });

  const [user, setUser] = useState(auth.currentUser);
  const [hasVoted, setHasVoted] = useState(false);
  
  // Dynamic Registry States from CSV (Now includes isLeader flag)
  const [participatingTeams, setParticipatingTeams] = useState<string[]>([]);
  const [participantRegistry, setParticipantRegistry] = useState<{email: string, name: string, team: string, isLeader: boolean}[]>([]);

  // Voting Form State
  const [voterEmail, setVoterEmail] = useState('');
  const [voterName, setVoterName] = useState('');
  const [myTeam, setMyTeam] = useState('');
  const [votedForTeam, setVotedForTeam] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isAuthorizedLeader, setIsAuthorizedLeader] = useState(true);

  // Handle Window Resize for Confetti
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. FETCH AND PARSE THE CSV FILE
  useEffect(() => {
    fetch('/participants.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const registry: any[] = [];
            const teams = new Set<string>();

            results.data.forEach((row: any) => {
              const teamKey = Object.keys(row).find(k => k?.includes('Team Name'));
              const teamName = teamKey && row[teamKey] ? String(row[teamKey]).trim() : '';
              
              if (!teamName) return;
              teams.add(teamName);

              const addMember = (num: number) => {
                const nameKey = Object.keys(row).find(k => k?.includes(`Team Member ${num}`) && k?.includes('Name'));
                const emailKey = Object.keys(row).find(k => k?.includes(`Team Member ${num}`) && k?.includes('Email'));

                const rawName = nameKey ? row[nameKey] : undefined;
                const rawEmail = emailKey ? row[emailKey] : undefined;

                if (rawName && rawEmail && typeof rawName === 'string' && typeof rawEmail === 'string') {
                  const cleanEmail = rawEmail.trim().toLowerCase();
                  const cleanName = rawName.trim();

                  if (cleanEmail !== '' && cleanName !== '') {
                    registry.push({ 
                      name: cleanName, 
                      email: cleanEmail, 
                      team: teamName,
                      isLeader: num === 1 // Identifies Team Member 1
                    });
                  }
                }
              };

              addMember(1);
              addMember(2);
              addMember(3);
            });

            setParticipantRegistry(registry);
            setParticipatingTeams(Array.from(teams).sort());
          }
        });
      })
      .catch(err => console.error("Could not load participants.csv", err));
  }, []);

  // 2. Listen to Display Settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'hackwarz', 'display_settings'), (doc) => {
      if (doc.exists()) setDisplayState(doc.data() as any);
    });
    return () => unsub();
  }, []);

  // 3. Listen to Auth (Enforces 1 vote per email)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setVoterEmail(currentUser.email || '');
        const voteDoc = await getDoc(doc(db, 'votes', currentUser.email || 'unknown'));
        if (voteDoc.exists()) setHasVoted(true); // Locks form instantly if they already voted
      }
    });
    return () => unsubscribe();
  }, []);

  // 4. Auto-fill Listener & Leader Checker
  useEffect(() => {
    if (participantRegistry.length === 0) return;

    const matchedUser = participantRegistry.find(
      p => p.email === voterEmail.toLowerCase().trim()
    );

    if (matchedUser) {
      setVoterName(matchedUser.name);
      setMyTeam(matchedUser.team);
      setIsEmailVerified(true);
      
      // Check if Leader Mode is ON and they are NOT the leader
      if (displayState.teamLeadersOnly && !matchedUser.isLeader) {
        setIsAuthorizedLeader(false);
        setErrorMsg("Only Team Leaders are authorized to vote in this mode.");
      } else {
        setIsAuthorizedLeader(true);
        setErrorMsg('');
      }
    } else {
      setVoterName('');
      setMyTeam('');
      setIsEmailVerified(false);
      setIsAuthorizedLeader(false);
    }
  }, [voterEmail, participantRegistry, displayState.teamLeadersOnly]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleVote = async () => {
    if (!isEmailVerified) {
      setErrorMsg("Access Denied: Email not found in the official registry.");
      return;
    }

    if (displayState.teamLeadersOnly && !isAuthorizedLeader) {
      setErrorMsg("Only Team Leaders can cast the vote.");
      return;
    }

    if (!votedForTeam) {
      setErrorMsg("Please select a team to vote for.");
      return;
    }

    if (myTeam === votedForTeam) {
      setErrorMsg("You cannot vote for your own team!");
      return;
    }

    await setDoc(doc(db, 'votes', user?.email || 'unknown'), {
      name: voterName,
      email: voterEmail.toLowerCase().trim(),
      googleAuthEmail: user?.email || 'unknown', 
      myTeam: myTeam,
      votedForTeam: votedForTeam,
      timestamp: new Date().toISOString()
    });
    setHasVoted(true);
    setErrorMsg('');
  };

  const RevealCard = ({ title, name, icon: Icon, colorClass, glowClass, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay, type: "spring", bounce: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} glareEnable glareMaxOpacity={0.3} glareColor="#ffffff" className="w-full">
        <div className={`relative group p-1 rounded-2xl bg-gradient-to-br ${colorClass} transition-all duration-500`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
          <div className="relative bg-black rounded-xl p-8 flex flex-col items-center text-center h-full border border-white/10 overflow-hidden">
            <div className={`absolute inset-0 border-2 border-transparent group-hover:border-${glowClass} rounded-xl transition-all duration-700`} />
            <Icon className={`w-16 h-16 mb-6 ${glowClass} animate-pulse`} />
            <h3 className="text-xl font-bold text-gray-400 mb-2 uppercase tracking-widest">{title}</h3>
            <h2 className={`text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${colorClass} uppercase`}>
              {name || '???'}
            </h2>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );

  const isRevealing = displayState.revealWinner || displayState.revealRunnerUp || displayState.revealPeersAward;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans flex flex-col items-center justify-start pt-8 p-4">
      {isRevealing && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={800} gravity={0.15} />
        </div>
      )}

      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        
        <motion.div 
          className="relative flex items-center justify-center mb-6"
          initial={{ rotateY: -360, scale: 0.5, opacity: 0 }}
          animate={{ rotateY: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }} 
        >
          <div className="absolute w-[150px] h-[150px] bg-purple-600/30 rounded-full blur-[60px]" />
          <img src="/hackwarz-logo.png" alt="HackWarz Logo" className="relative z-10 w-[40vw] max-w-[180px] h-auto object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.7)]" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4 glitch-text uppercase tracking-tighter" data-text="Hackwarz 2k26 results">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500">
              RESULTS ARENA
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)]" />
        </motion.div>

        {!displayState.showVoting && !isRevealing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center mt-12">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-32 h-32 border border-purple-500/30 rounded-full animate-ping" />
              <ShieldAlert className="w-12 h-12 text-purple-400 animate-pulse" />
            </div>
            <h2 className="mt-8 text-xl md:text-2xl font-bold tracking-widest text-gray-500 uppercase">Awaiting System Override...</h2>
          </motion.div>
        )}

        <AnimatePresence>
          {displayState.showVoting && !displayState.revealWinner && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -50 }}
              className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-purple-500/30 p-6 md:p-8 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.1)] mb-16 text-center"
            >
              <Zap className="w-10 h-10 text-pink-400 mx-auto mb-4" />
              <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1 uppercase">Peers Icon Voting</h2>
              
              {/* DYNAMIC SUBTITLE BASED ON VOTING MODE */}
              <p className="text-purple-300 font-bold mb-4 text-xs tracking-widest uppercase">
                {displayState.teamLeadersOnly ? '🚨 Team Leaders Only 🚨' : '1 Vote Per Person'}
              </p>

              {!user ? (
                <button onClick={handleLogin} className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-3">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  Sign in with Google to Vote
                </button>
              ) : hasVoted ? (
                <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 font-bold flex items-center justify-center gap-2">
                  <Award className="w-5 h-5" /> Vote Locked In Successfully!
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  
                  <div className="relative">
                    <label className="text-xs font-bold text-purple-400 uppercase tracking-wider ml-1">Registered Email</label>
                    <input 
                      type="email" 
                      placeholder="Enter registered email"
                      value={voterEmail} 
                      onChange={(e) => setVoterEmail(e.target.value)} 
                      className={`w-full mt-1 bg-black border ${isEmailVerified ? (displayState.teamLeadersOnly && !isAuthorizedLeader ? 'border-red-500' : 'border-green-500') : 'border-neutral-700'} rounded-xl p-3 pr-10 text-white focus:outline-none transition-colors`} 
                    />
                    {isEmailVerified && isAuthorizedLeader && <CheckCircle2 className="absolute right-3 top-9 w-5 h-5 text-green-500" />}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Your Full Name</label>
                    <input type="text" value={voterName} readOnly placeholder="Auto-filled from registry" className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-gray-400 cursor-not-allowed" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Your Team</label>
                    <input type="text" value={myTeam} readOnly placeholder="Auto-filled from registry" className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-gray-400 cursor-not-allowed" />
                  </div>

                  {/* LEADER LOCKOUT WARNING */}
                  {displayState.teamLeadersOnly && isEmailVerified && !isAuthorizedLeader ? (
                    <div className="p-4 mt-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 flex items-start gap-3 text-sm">
                      <Lock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <p><strong>Locked:</strong> You are not registered as the Team Leader. Only Member 1 can cast the vote.</p>
                    </div>
                  ) : (
                    <div className={isEmailVerified ? 'opacity-100' : 'opacity-50 pointer-events-none transition-opacity'}>
                      <label className="text-xs font-bold text-pink-400 uppercase tracking-wider ml-1">Team You Are Voting For</label>
                      <select value={votedForTeam} onChange={(e) => setVotedForTeam(e.target.value)} className="w-full mt-1 bg-black border border-neutral-700 rounded-xl p-3 text-white focus:border-pink-500 outline-none">
                        <option value="">Select a team to vote for...</option>
                        {participatingTeams.map(team => <option key={`vote-${team}`} value={team}>{team}</option>)}
                      </select>
                    </div>
                  )}

                  {errorMsg && <p className="text-red-500 text-sm font-bold text-center">{errorMsg}</p>}

                  {/* HIDE BUTTON IF NOT AUTHORIZED TO VOTE */}
                  {(!displayState.teamLeadersOnly || isAuthorizedLeader) && (
                    <button 
                      onClick={handleVote}
                      disabled={!isEmailVerified}
                      className="w-full mt-2 py-4 bg-gradient-to-r from-purple-600 to-pink-600 font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(236,72,153,0.3)] text-white uppercase tracking-wider"
                    >
                      Submit Official Vote
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8 items-end justify-center w-full">
          {displayState.revealPeersAward && (
            <div className="order-2 lg:order-1">
              <RevealCard title="Peers Icon Award" name={displayState.peersAwardName} icon={Users} colorClass="from-cyan-400 to-blue-500" glowClass="text-cyan-400" delay={0} />
            </div>
          )}

          {displayState.revealWinner && (
            <div className="order-1 lg:order-2 lg:-translate-y-12 z-20">
              <motion.div initial={{ opacity: 0, scale: 0.1, rotateY: 90 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 1.5, type: "spring", bounce: 0.5 }} className="w-full max-w-lg mx-auto">
                <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable glareMaxOpacity={0.5} glareColor="#FFD700">
                  <div className="relative group p-1.5 rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 transition-all duration-500 shadow-[0_0_100px_rgba(250,204,21,0.4)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 blur-3xl opacity-70 animate-pulse" />
                    <div className="relative bg-black rounded-2xl p-10 flex flex-col items-center text-center border-2 border-yellow-500/20">
                      <Trophy className="w-24 h-24 mb-6 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
                      <h3 className="text-2xl font-bold text-yellow-500/80 mb-2 uppercase tracking-widest">Champions</h3>
                      <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 uppercase drop-shadow-2xl">
                        {displayState.winnerName || '???'}
                      </h2>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            </div>
          )}

          {displayState.revealRunnerUp && (
            <div className="order-3 lg:order-3">
              <RevealCard title="1st Runner Up" name={displayState.runnerUpName} icon={Award} colorClass="from-purple-400 to-pink-600" glowClass="text-pink-400" delay={0.5} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}