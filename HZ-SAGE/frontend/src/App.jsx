import React, { useState } from 'react';
import { 
  Search, 
  AlertCircle, 
  LayoutDashboard, 
  Database, 
  Link as LinkIcon, 
  Zap, 
  Settings,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import ReviewModule from './components/ReviewModule';
import WarningModule from './components/WarningModule';
import DashboardModule from './components/DashboardModule';
import SettingsModule from './components/SettingsModule';

function App() {
  const [activeTab, setActiveTab] = useState('review');

  const menuItems = [
    { id: 'review', label: '招标文件智能审查', icon: Search, color: 'text-emerald-500' },
    { id: 'warning', label: '交易平台操作预警', icon: AlertCircle, color: 'text-amber-500' },
    { id: 'dashboard', label: '智能化协作看板', icon: LayoutDashboard, color: 'text-sky-500' },
    { id: 'settings', label: '系统设置', icon: Settings, color: 'text-slate-400' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f9f9f9] dark:bg-[#343541]">
      {/* Sidebar - Clean Professional Look */}
      <aside className="w-72 bg-[#202123] text-white flex flex-col p-4 shrink-0 shadow-xl">
        <div className="flex items-center gap-3 px-2 py-6 mb-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">HZ-SAGE</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">AI Procurement Platform</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">主要模块</p>
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.id 
                ? 'bg-[#343541] text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? item.color : 'text-slate-500'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
          <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">系统状态</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 text-[12px] text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                安全通道
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 text-[12px] text-slate-300">
                <Database className="w-4 h-4 text-sky-400" />
                RAG 向量库
              </div>
              <span className="text-[10px] text-slate-500 font-mono">2.4k docs</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 text-[12px] text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" />
                核心引擎
              </div>
              <span className="text-[10px] text-emerald-400 px-1.5 py-0.5 bg-emerald-400/10 rounded">Active</span>
            </div>
          </div>
          
          {/* Re-using the same loop logic for consistent styling, removing the hardcoded button */}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-white dark:bg-[#343541]">
        {/* Simple Header */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#343541]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 italic">
             {menuItems.find(i => i.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-mono text-slate-500 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">v1.2.5-stable</span>
            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
          </div>
        </header>

        <div className="ai-container animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'review' && <ReviewModule />}
          {activeTab === 'warning' && <WarningModule />}
          {activeTab === 'dashboard' && <DashboardModule />}
          {activeTab === 'settings' && <SettingsModule />}
        </div>
      </main>
    </div>
  );
}

export default App;
