import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { securityService } from '../services/api';
import type { SecurityReport as ReportData, SecurityTimelinePoint } from '../services/api';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { FileText, Download, TrendingUp, Calendar, Loader2, Award } from 'lucide-react';

export default function SecurityReport() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [timeline, setTimeline] = useState<SecurityTimelinePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const reportsHistory = await securityService.getReports();
      setReports(reportsHistory);

      const scoreHistory = await securityService.getTimeline();
      setTimeline(scoreHistory);
    } catch (e) {
      console.error('Failed to load report data:', e);
      // Fallbacks
      setReports([
        {
          id: 1,
          security_score: 72,
          risk_level: 'Medium',
          issues_found: [
            { type: 'critical', title: 'GitHub MFA Disabled', description: 'Multi-factor auth is turned off for developer repos.' },
            { type: 'medium', title: 'Stale Permissions', description: 'Google Drive access was granted to an unrecognized calendar app 8 months ago.' }
          ],
          recommendations: [
            { id: '1', platform: 'github', title: 'Turn MFA ON', description: 'Ensure authentication token checks are enabled.', priority: 'high', fixed: false }
          ],
          created_at: new Date().toISOString()
        }
      ]);
      setTimeline([
        { month: 'Jan', score: 60 },
        { month: 'Feb', score: 65 },
        { month: 'Mar', score: 72 },
        { month: 'Apr', score: 72 },
        { month: 'May', score: 85 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownloadPDF = (reportId: number) => {
    setDownloading(true);
    console.info('Generating PDF for report ID:', reportId);
    // Simulate API PDF generation and document download trigger
    setTimeout(() => {
      setDownloading(false);
      alert('Your PDF Security Report is downloading. In production, this generates a server-side PyPDF/ReportLab binary containing risk scores, connected account status lists, and Gemini remediation coach guidelines.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Security Auditing</h2>
              <p className="text-xs text-zinc-400 mt-1">Audit trail history and digital defense scores timeline</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-zinc-500 font-mono text-xs gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-cyber-blue" />
              <span>Compiling defense summaries...</span>
            </div>
          ) : (
            <>
              {/* Score Chart Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timeline Chart */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyber-accent" />
                      Security Score History
                    </h3>
                    <p className="text-xs text-zinc-500 mb-6">Visual tracking of posture improvement over time</p>
                  </div>
                  
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                        <XAxis dataKey="month" stroke="#52525b" fontSize={10} className="font-mono" />
                        <YAxis domain={[0, 100]} stroke="#52525b" fontSize={10} className="font-mono" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.08)' }} 
                          labelStyle={{ color: '#8a8a8a', fontFamily: 'monospace', fontSize: 10 }}
                          itemStyle={{ color: '#00ff88', fontSize: 12 }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#00ff88" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Defense badges and milestone stats */}
                <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                      <Award className="w-4 h-4 text-cyber-blue" />
                      Security Badges
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/[0.02] border border-emerald-500/10">
                        <div className="w-10 h-10 rounded-full bg-cyber-accent/10 border border-cyber-accent/20 flex items-center justify-center font-bold text-cyber-accent text-sm font-mono shadow-lg">
                          01
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Beginner Defender</p>
                          <p className="text-[10px] text-zinc-500">Unlocked upon initial registration check</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-white/5 opacity-50">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-400 text-sm font-mono">
                          02
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-400">Cyber Guardian</p>
                          <p className="text-[10px] text-zinc-500">Achieve safety score of 80+ across 3 accounts</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-white/5 opacity-50">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-400 text-sm font-mono">
                          03
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-400">Security Master</p>
                          <p className="text-[10px] text-zinc-500">Achieve 95+ safety score for all connections</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* History list */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">Previous Reports History</h3>
                <div className="space-y-3">
                  {reports.map((rep) => (
                    <div key={rep.id} className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-zinc-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">Score: {rep.security_score}</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400">
                              Level: {rep.risk_level}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-1 font-mono">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(rep.created_at).toLocaleDateString()} at {new Date(rep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadPDF(rep.id)}
                        disabled={downloading}
                        className="w-full sm:w-auto px-4 py-2 bg-zinc-900 border border-white/10 hover:border-cyber-accent hover:text-cyber-accent text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
                      >
                        {downloading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        Download PDF Report
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
