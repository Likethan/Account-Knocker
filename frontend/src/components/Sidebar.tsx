import { NavLink } from 'react-router-dom';
import { LayoutDashboard, KeyRound, MessageSquareCode, FileLineChart, ShieldAlert } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Accounts', icon: KeyRound, path: '/accounts' },
    { name: 'AI Assistant', icon: MessageSquareCode, path: '/chat' },
    { name: 'Security Reports', icon: FileLineChart, path: '/reports' }
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-zinc-950 flex flex-col justify-between shrink-0 h-[calc(100vh-73px)] sticky top-[73px]">
      <div className="p-6 flex flex-col gap-6">
        <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
          Navigation
        </div>
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 border border-transparent ${
                    isActive
                      ? 'bg-emerald-500/5 text-cyber-accent border-emerald-500/10 font-medium glow-green'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/5 bg-zinc-950/40">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-white/5">
          <div className="p-2 rounded bg-cyber-blue/10 text-cyber-blue">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-300">Knock AI</p>
            <p className="text-[10px] text-zinc-500 font-mono">Status: Ready</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
