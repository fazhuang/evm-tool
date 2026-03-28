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
  Cpu,
  FilePlus
} from 'lucide-react';
import ReviewModule from './components/ReviewModule';
import WarningModule from './components/WarningModule';
import ConstructionModule from './components/ConstructionModule';
import DashboardModule from './components/DashboardModule';
import SettingsModule from './components/SettingsModule';

function App() {
  const [activeTab, setActiveTab] = useState('review');

  const menuItems = [
    { id: 'review', label: '文件合规智能核查', icon: Search, color: 'text-emerald-500' },
    { id: 'construction', label: '标准化招标文件制作', icon: FilePlus, color: 'text-sky-400' },
    { id: 'warning', label: '业务操作问题答疑', icon: AlertCircle, color: 'text-amber-500' },
    { id: 'dashboard', label: '内部协作实时监测', icon: LayoutDashboard, color: 'text-sky-500' },
    { id: 'settings', label: '系统设置', icon: Settings, color: 'text-slate-400' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f9f9f9] dark:bg-[#343541]">
      {/* Sidebar - Clean Professional Look */}
      <aside className="w-72 bg-[#202123] text-white flex flex-col p-4 shrink-0 shadow-xl">
        <div className="px-2 py-8 mb-4 border-b border-white/5">
          <div className="h-14 w-full flex items-center justify-start bg-white/95 rounded-xl p-3 shadow-lg shadow-black/20 overflow-hidden">
            <img src="/logo_hz.png" alt="HZ Logo" className="h-full w-auto object-contain" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">智能采购平台·HZ-SAGE</p>
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
        {/* Simple Header with Unified Title */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#343541]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-8 py-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            {React.createElement(menuItems.find(i => i.id === activeTab)?.icon || Search, { className: `w-7 h-7 ${menuItems.find(i => i.id === activeTab)?.color}` })}
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
               {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-mono text-slate-500 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">v1.2.5-stable</span>
            <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm hover:ring-2 hover:ring-emerald-500/20 transition-all cursor-pointer">
              <img src="/avatar_admin.png" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="ai-container animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'review' && <ReviewModule />}
          {activeTab === 'construction' && <ConstructionModule />}
          {activeTab === 'warning' && <WarningModule />}
          {activeTab === 'dashboard' && <DashboardModule />}
          {activeTab === 'settings' && <SettingsModule />}
        </div>
      </main>
    </div>
  );
}

export default App;
