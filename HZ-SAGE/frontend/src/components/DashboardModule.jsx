import React, { useState, useEffect } from 'react';
import { getDashboardMetrics, downloadReminder } from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Download, AlertTriangle, Users, Target, Activity, TrendingUp, CheckCircle2, Layout, Clock } from 'lucide-react';

const DashboardModule = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardMetrics();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = async (projectName, manager) => {
    try {
      const blob = await downloadReminder(projectName, manager);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${projectName}_催办函.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert("下载失败");
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <Activity className="w-8 h-8 animate-pulse text-sky-500" />
      <p className="text-slate-400 font-medium animate-pulse">正在同步全域招标监控数据...</p>
    </div>
  );
  
  if (!data) return (
    <div className="h-96 flex flex-col items-center justify-center text-red-500 font-bold">
      数据加载失败，请检查后端连接
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <Layout className="w-8 h-8 text-sky-500" />
            业务执行流监控中心
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm">
            实时追踪全省招标项目的线上化进度、团队负荷及系统接口稳定性。
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 rounded-full text-[12px] font-semibold text-sky-600 dark:text-sky-400">
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
          Live Data Syncing
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: '当月招标项目', value: data.monthly_projects.value, change: data.monthly_projects.change, icon: Target, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10' },
          { label: '核心团队负荷', value: data.team_load.value, change: data.team_load.change, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: '接口通畅度', value: data.api_stability.value, change: data.api_stability.change, icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
        ].map((stat, i) => (
          <div key={i} className="ai-card p-6 flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                {stat.label}
              </div>
              <div className="text-3xl font-bold text-slate-800 dark:text-white">
                {stat.value}
              </div>
            </div>
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              stat.change.startsWith('+') 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
              : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
            }`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="ai-card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-500" />
            执行流趋势图
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500"><span className="w-3 h-3 rounded-full bg-sky-500"></span> 电子标书</div>
            <div className="flex items-center gap-1.5 text-slate-500"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> 系统集成</div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" hide />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', background: '#202123', color: '#fff', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="电子标书制作" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorSky)" strokeWidth={2} />
              <Area type="monotone" dataKey="系统集成测试" stroke="#6366f1" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="ai-card p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 opacity-5 bg-sky-500 rounded-full w-32 h-32"></div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">整体满意度分析</h3>
            <p className="text-xs text-slate-500">业主与专家反馈情感极化监控</p>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div className="space-y-2 flex-col">
              <span className="text-4xl font-bold text-sky-500">{data.satisfaction}%</span>
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-500/10 dark:text-emerald-400">
                Above benchmark
              </div>
            </div>
            <div className="w-32 rotate-[-90deg]">
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-l from-sky-500 to-indigo-500" style={{width: `${data.satisfaction}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="ai-card lg:col-span-2 overflow-hidden border-amber-500/20">
          <div className="bg-amber-500/5 p-4 border-b border-amber-500/10 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              进度滞后项目 (AI 预警)
            </h3>
            <div className="text-[10px] font-mono text-amber-600 bg-amber-500/10 p-1 border border-amber-500/20 rounded">
              {data.warnings?.length || 0} ITEMS REQUIRES ATTENTION
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">项目名称 / 负责人</th>
                  <th className="px-6 py-4">健康度</th>
                  <th className="px-6 py-4 text-right">紧急对策</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data.warnings || []).map((proj, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{proj['项目名称']}</div>
                      <div className="text-slate-400 mt-1 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {proj['负责人']}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden min-w-[100px]">
                          <div className={`h-full ${proj['电子化进度'] < 50 ? 'bg-red-500' : 'bg-amber-500'}`} style={{width: `${proj['电子化进度']}%`}}></div>
                        </div>
                        <span className="font-mono font-bold text-slate-600 dark:text-slate-400">{proj['电子化进度']}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDownload(proj['项目名称'], proj['负责人'])}
                        className="p-2 bg-white dark:bg-[#343541] hover:bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-all"
                        title="下达催办函"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!data.warnings || data.warnings.length === 0) && (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                 <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2 opacity-20" />
                 暂无风险项目
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;
