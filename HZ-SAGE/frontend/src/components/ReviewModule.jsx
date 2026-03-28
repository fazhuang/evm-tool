import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  AlertTriangle, 
  Info, 
  Download, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  XCircle,
  ArrowRight,
  Search
} from 'lucide-react';
import { uploadDocument } from '../utils/api';

const ReviewModule = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, complete, error
  const [errorMsg, setErrorMsg] = useState('');
  const [report, setReport] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('risks');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus('idle');
      setReport(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setReport(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setStatus('uploading');
    setErrorMsg('');
    try {
      const result = await uploadDocument(file);
      setReport(result);
      setStatus('complete');
    } catch (err) {
      console.error(err);
      setStatus('error');
      // FastAPI 422 errors might return detail as list of objects, convert to string safely
      const details = err.response?.data?.detail;
      const finalMsg = Array.isArray(details) 
        ? details.map(d => `${d.loc.join('.')}: ${d.msg}`).join(', ') 
        : (typeof details === 'string' ? details : (err.message || "未知错误"));
      setErrorMsg(finalMsg);
    }
  };

  const handleDownload = async () => {
    if (!report) return;
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/review/prepare_download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer hz_sage_secure_token_2026` // Hardcoded for demo, should be from context/env
        },
        body: JSON.stringify({
          report_data: report.report,
          filename: report.filename
        })
      });

      if (!response.ok) {
        throw new Error(`网络响应错误: ${response.status}`);
      }

      const data = await response.json();
      window.location.href = `http://127.0.0.1:8000${data.download_url}`;
      
    } catch (err) {
      console.error("Export error:", err);
      alert("下载失败！");
    }
  };
  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
          <Search className="w-8 h-8 text-emerald-500" />
          招标文件智能审查
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          依托深度语言模型与 RAG 增强检索，自动识别标书中的法律合规风险、逻辑冲突与关键缺失项。
        </p>
      </div>

      {/* Main Interaction Card */}
      <div className="ai-card overflow-hidden">
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`p-12 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            file ? 'bg-emerald-50/30 dark:bg-emerald-500/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 ${
            file ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          }`}>
            <UploadCloud className="w-8 h-8" />
          </div>
          
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {file ? file.name : '点击或拖拽上传招标文件'}
          </h3>
          <p className="text-slate-500 text-sm mt-1">支持 PDF、Word 或文本格式 (最大 10MB)</p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.docx,.doc,.txt" 
            onChange={handleFileChange}
          />
        </div>

        {file && status === 'idle' && (
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex justify-center">
            <button 
              onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              开始智能分析
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'uploading' && (
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">正在进行高维语义分析...</span>
                  <span className="text-xs text-slate-400 italic">预计耗时 15-30s</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 animate-progress-fast"></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-slate-500">文档结构解析完成</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                <span className="text-xs text-slate-500">正在对比 RAG 知识库...</span>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-6 bg-red-50 dark:bg-red-900/10 border-t border-red-100 dark:border-red-900/20 flex items-start gap-4">
            <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-700 dark:text-red-400">分析中断</h4>
              <p className="text-sm text-red-600 dark:text-red-300/80 mt-1">{errorMsg}</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-4 text-sm font-semibold text-red-700 dark:text-red-400 hover:underline"
              >
                重试上传
              </button>
            </div>
          </div>
        )}
      </div>

      {status === 'complete' && report && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              分析报告：{report.filename}
            </h2>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              导出 Word 报告
            </button>
          </div>

          {/* Clean Segmented Tabs */}
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex gap-1">
            <button 
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeSubTab === 'risks' ? 'bg-white dark:bg-[#343541] shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveSubTab('risks')}
            >
              合规性风险
            </button>
            <button 
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeSubTab === 'logic' ? 'bg-white dark:bg-[#343541] shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveSubTab('logic')}
            >
              逻辑冲突
            </button>
            <button 
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeSubTab === 'info' ? 'bg-white dark:bg-[#343541] shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveSubTab('info')}
            >
              核心信息萃取
            </button>
          </div>

          <div className="ai-card p-6 min-h-[400px]">
            {activeSubTab === 'risks' && (
              <div className="space-y-6">
                {(report.report?.['合规性风险'] || []).length > 0 ? (
                  report.report['合规性风险'].map((risk, idx) => (
                    <div key={idx} className="group border-l-4 border-red-500 pl-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{risk['描述']}</h4>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">修正建议：</span>
                        {risk['建议']}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4 opacity-20" />
                    <p>未发现合规性风险</p>
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'logic' && (
              <div className="space-y-6">
                {(report.report?.['逻辑错误'] || []).length > 0 ? (
                  report.report['逻辑错误'].map((logic, idx) => (
                    <div key={idx} className="group border-l-4 border-amber-500 pl-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-amber-500" />
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{logic['描述']}</h4>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">修正建议：</span>
                        {logic['建议']}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4 opacity-20" />
                    <p>逻辑自洽，未发现冲突</p>
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(report.report?.['核心信息'] || []).map((info, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest block mb-1">Feature Extraction</span>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{info['描述']}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{info['建议']}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewModule;
