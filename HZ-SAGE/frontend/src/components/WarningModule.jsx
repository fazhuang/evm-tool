import React, { useState } from 'react';
import { diagnoseIssue } from '../utils/api';
import { AlertCircle, AlertTriangle, ShieldCheck, Loader2, Search, Send, Zap, Activity } from 'lucide-react';

const WarningModule = () => {
  const [issue, setIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  const handleSubmit = async () => {
    if (!issue.trim()) return;
    setLoading(true);
    setDiagnosis(null);
    try {
      const result = await diagnoseIssue(issue);
      setDiagnosis(result.diagnosis);
    } catch (err) {
      console.error(err);
      alert("诊断失败: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-amber-500" />
          交易平台智能排障
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          针对公共资源交易平台、CA 互认、电子固化工具等各种技术故障，提供基于最新排障库的即时专家诊断与抢救指南。
        </p>
      </div>

      <div className="ai-card overflow-hidden">
        <div className="p-1 bg-amber-500/5 border-b border-amber-500/10 flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-amber-600 uppercase tracking-widest">
          <Zap className="w-3 h-3" />
          Real-time Diagnostic Engine Active
        </div>
        
        <div className="p-6 space-y-4">
          <div className="relative">
            <textarea
              className="w-full h-40 p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              placeholder="请输入您遇到的报错信息、弹窗文字或异常现象描述..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            ></textarea>
            <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Supported by HZ-SAGE Operations DB
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !issue.trim()}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> 正在调阅专家知识库...</>
            ) : (
              <><Send className="w-4 h-4" /> 提交诊断请求</>
            )}
          </button>
        </div>
      </div>

      {diagnosis && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-700 space-y-6">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold px-2">
            <ShieldCheck className="w-5 h-5" />
            系统排障诊断建议书
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Diagnosis */}
            <div className="lg:col-span-2 space-y-6">
              <div className="ai-card p-6 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">1</span>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">故障根本原因分析</h3>
                </div>
                <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {diagnosis.Diagnosis || "未能识别明确原因"}
                </div>
              </div>

              <div className="ai-card p-6 border-l-4 border-red-500 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">潜在后果预警</h3>
                </div>
                <div className="text-red-600 dark:text-red-400/80 leading-relaxed text-sm font-medium italic">
                  {diagnosis.Warning || "暂无进一步后果评估"}
                </div>
              </div>
            </div>

            {/* Action Plan */}
            <div className="ai-card bg-slate-900 text-white p-6 border-none shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Zap className="w-24 h-24" />
               </div>
               <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/10 relative z-10">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold tracking-tight">紧急抢救操作指南</h3>
               </div>
               <div className="text-emerald-50 text-sm leading-loose whitespace-pre-wrap font-medium relative z-10">
                 {diagnosis.ActionPlan || "请联系运维客服人员协助处理"}
               </div>
               <div className="mt-8 pt-4 border-t border-white/5 relative z-10">
                 <p className="text-[10px] text-slate-500 italic">以上建议由 HZ-SAGE 运维大脑自动出具，准确率 &gt;95%</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarningModule;
