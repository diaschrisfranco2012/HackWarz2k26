import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { doc, onSnapshot, setDoc, collection } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { ShieldAlert, Power, Trophy, Users, Award, LogOut, Table2, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const AUTHORIZED_EMAILS = [
  'chrisdias.216@gmail.com', 
  'danielfernandes7484@gmail.com',
  'tracy@rosarycollege.ac.in',
  'qmevin@gmail.com'
];

export default function AdminHQ() {
  const [user, setUser] = useState<User | null>(null);
  const [displayState, setDisplayState] = useState({
    showVoting: false, 
    revealPeersAward: false, 
    revealRunnerUp: false, 
    revealWinner: false,
    teamLeadersOnly: false, // NEW: Team Leaders Only Voting Switch
    winnerName: '', 
    runnerUpName: '', 
    peersAwardName: '',
  });

  // Data states for Live Sheet and Graph
  const [votesData, setVotesData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Listen to Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => setUser(user));
    return () => unsubscribe();
  }, []);

  // Listen to Database (Display Settings & Live Votes)
  useEffect(() => {
    if (!user || !AUTHORIZED_EMAILS.includes(user.email || '')) return;

    const unsubSettings = onSnapshot(doc(db, 'hackwarz', 'display_settings'), (doc) => {
      if (doc.exists()) setDisplayState(doc.data() as any);
    });

    const unsubVotes = onSnapshot(collection(db, 'votes'), (snapshot) => {
      const votes: any[] = [];
      const counts: Record<string, number> = {};
      
      snapshot.forEach(doc => {
        const data = doc.data();
        votes.push({ id: doc.id, ...data });
        
        // Count votes for graph
        if (data.votedForTeam) {
          counts[data.votedForTeam] = (counts[data.votedForTeam] || 0) + 1;
        }
      });
      
      setVotesData(votes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      
      // Convert counts to array for Recharts
      const formattedChartData = Object.keys(counts).map(team => ({
        name: team,
        votes: counts[team]
      })).sort((a, b) => b.votes - a.votes);
      
      setChartData(formattedChartData);
    });

    return () => { unsubSettings(); unsubVotes(); };
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const updateSettings = async (newState: Partial<typeof displayState>) => {
    const updated = { ...displayState, ...newState };
    setDisplayState(updated);
    await setDoc(doc(db, 'hackwarz', 'display_settings'), updated, { merge: true });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
        <h1 className="text-3xl font-black text-white mb-8 tracking-widest uppercase">Restricted Area</h1>
        <button onClick={handleLogin} className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-3">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" /> Sign in with Google
        </button>
      </div>
    );
  }

  if (!AUTHORIZED_EMAILS.includes(user.email || '')) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl text-red-500 font-bold mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-8">{user.email} is not an admin.</p>
        <button onClick={() => signOut(auth)} className="text-white underline">Sign Out</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8 border-b border-purple-500/30 pb-6">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Admin HQ</h1>
            <p className="text-green-400 text-sm font-mono mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Connected as {user.email}
            </p>
          </div>
          <button onClick={() => signOut(auth)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* TOP GRID: CONTROLS & DATA ENTRY */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* STAGE CONTROLS */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-400 mb-4 flex items-center gap-2"><Power className="w-5 h-5" /> Stage Controls</h2>
            
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex justify-between items-center">
              <div><h3 className="font-bold">Public Voting</h3><p className="text-xs text-gray-500">Allow students to vote</p></div>
              <button onClick={() => updateSettings({ showVoting: !displayState.showVoting })} className={`w-14 h-8 rounded-full relative ${displayState.showVoting ? 'bg-green-500' : 'bg-neutral-700'}`}>
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${displayState.showVoting ? 'translate-x-6' : ''}`} />
              </button>
            </div>

            {/* NEW TEAM LEADERS ONLY SWITCH */}
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold">Team Leaders Only</h3>
                <p className="text-xs text-gray-500">Only Member 1 from the CSV can vote</p>
              </div>
              <button 
                onClick={() => updateSettings({ teamLeadersOnly: !displayState.teamLeadersOnly })} 
                className={`w-14 h-8 rounded-full relative ${displayState.teamLeadersOnly ? 'bg-cyan-500' : 'bg-neutral-700'}`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${displayState.teamLeadersOnly ? 'translate-x-6' : ''}`} />
              </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex justify-between items-center">
              <div><h3 className="font-bold">Reveal Peers Award</h3><p className="text-xs text-gray-500">Trigger big screen animation</p></div>
              <button onClick={() => updateSettings({ revealPeersAward: !displayState.revealPeersAward })} className={`px-4 py-2 rounded-lg font-bold text-sm ${displayState.revealPeersAward ? 'bg-red-500' : 'bg-purple-600'}`}>{displayState.revealPeersAward ? 'HIDE' : 'REVEAL'}</button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex justify-between items-center">
              <div><h3 className="font-bold">Reveal Runner Up</h3><p className="text-xs text-gray-500">Trigger big screen animation</p></div>
              <button onClick={() => updateSettings({ revealRunnerUp: !displayState.revealRunnerUp })} className={`px-4 py-2 rounded-lg font-bold text-sm ${displayState.revealRunnerUp ? 'bg-red-500' : 'bg-purple-600'}`}>{displayState.revealRunnerUp ? 'HIDE' : 'REVEAL'}</button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex justify-between items-center border-l-4 border-l-yellow-500">
              <div><h3 className="font-bold text-yellow-400">Reveal Winner</h3><p className="text-xs text-gray-500">Triggers ultimate animation</p></div>
              <button onClick={() => updateSettings({ revealWinner: !displayState.revealWinner })} className={`px-4 py-2 rounded-lg font-bold text-sm ${displayState.revealWinner ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'}`}>{displayState.revealWinner ? 'HIDE' : 'REVEAL'}</button>
            </div>
          </div>

          {/* DATA ENTRY */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-400 mb-4 flex items-center gap-2"><Trophy className="w-5 h-5" /> Enter Winners</h2>
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4">
              <div>
                <label className="flex text-sm font-bold text-yellow-400 mb-2 items-center gap-2">Winner Name</label>
                <input type="text" value={displayState.winnerName} onChange={(e) => updateSettings({ winnerName: e.target.value })} className="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" />
              </div>
              <div>
                <label className="flex text-sm font-bold text-purple-400 mb-2 items-center gap-2">Runner Up Name</label>
                <input type="text" value={displayState.runnerUpName} onChange={(e) => updateSettings({ runnerUpName: e.target.value })} className="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="flex text-sm font-bold text-pink-400 mb-2 items-center gap-2">Peers Icon Name</label>
                <input type="text" value={displayState.peersAwardName} onChange={(e) => updateSettings({ peersAwardName: e.target.value })} className="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:border-pink-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: LIVE GRAPH & SPREADSHEET */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LIVE GRAPH */}
          <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><BarChart3 className="text-pink-500 w-5 h-5" /> Live Vote Graph</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#000', borderColor: '#333'}} />
                  <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#ec4899' : '#8b5cf6'} />
                    ))}
                    {/* THIS MAKES THE NUMBERS PERMANENTLY VISIBLE */}
                    <LabelList dataKey="votes" position="right" fill="#9ca3af" fontSize={14} fontWeight="bold" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LIVE SPREADSHEET */}
          <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col h-[400px]">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 justify-between">
              <span className="flex items-center gap-2"><Table2 className="text-cyan-500 w-5 h-5" /> Live Response Sheet</span>
              <span className="text-sm font-normal text-gray-400 bg-neutral-800 px-3 py-1 rounded-full">{votesData.length} Total Votes</span>
            </h2>
            
            <div className="flex-1 overflow-auto rounded-xl border border-neutral-800">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-xs uppercase bg-neutral-950 text-gray-400 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 border-b border-neutral-800">Voter Name</th>
                    <th className="px-4 py-3 border-b border-neutral-800">Email</th>
                    <th className="px-4 py-3 border-b border-neutral-800">Their Team</th>
                    <th className="px-4 py-3 border-b border-neutral-800 text-pink-400">Voted For</th>
                  </tr>
                </thead>
                <tbody>
                  {votesData.map((vote) => (
                    <tr key={vote.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{vote.name}</td>
                      <td className="px-4 py-3 text-gray-500">{vote.email}</td>
                      <td className="px-4 py-3">{vote.myTeam}</td>
                      <td className="px-4 py-3 font-bold text-pink-400">{vote.votedForTeam}</td>
                    </tr>
                  ))}
                  {votesData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500 italic">No votes recorded yet. Turn on Public Voting!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}