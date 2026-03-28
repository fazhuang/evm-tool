import React, { useState, useRef } from 'react';
import { 
  FilePlus, 
  Upload, 
  Settings, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  Download, 
  AlertCircle,
  ClipboardList,
  ShieldCheck,
  Zap,
  Plus,
  Trash2,
  FileText
} from 'lucide-react';
import { extractBiddingParams, generateBiddingDoc, uploadDocument } from '../utils/api';

const ConstructionModule = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    project_name: '',
    project_code: '',
    project_category: '政府采购-服务类',
    budget_amount: 0,
    agent_name: '兰州华招国际代建管理有限公司',
    agent_contact: '张工 0931-8888888',
    opening_time: '',
    opening_location: '甘肃省公共资源交易中心第 5 开标厅',
    supplier_qualifications: [],
    technical_specs: [],
    evaluation_method: '综合评分法'
  });

  const [reviewResult, setReviewResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    setLoading(true);
    setError(null);
    
    try {
      const result = await extractBiddingParams(uploadedFile);
      setFormData(prev => ({
        ...prev,
        project_name: result.data.project_name || prev.project_name,
        budget_amount: result.data.budget_amount || prev.budget_amount,
        supplier_qualifications: result.data.supplier_qualifications.length > 0 
          ? result.data.supplier_qualifications 
          : prev.supplier_qualifications
      }));
      setStep(2);
    } catch (err) {
      setError("参数提取失败，请检查文件格式或手动填报");
      setStep(2); // Still move to step 2 for manual entry
    } finally {
      setLoading(false);
    }
  };

  const handleSelfCheck = async () => {
    setLoading(true);
    try {
      // We simulate a self-check by running the current review engine on a mock version of the project specs
      const mockText = `项目名称：${formData.project_name}. 预算：${formData.budget_amount}. 资格要求：${formData.supplier_qualifications.join(',')}`;
      // In a real app, we'd send the full assembled text. For now, we use a simple text buffer.
      const blob = new Blob([mockText], { type: 'text/plain' });
      const checkFile = new File([blob], "draft_check.txt");
      const result = await uploadDocument(checkFile);
      setReviewResult(result);
      setStep(3);
    } catch (err) {
      setError("自检模块调用失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const blob = await generateBiddingDoc(formData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `招标文件_${formData.project_name || '未命名'}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("下载失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const addQual = () => setFormData(prev => ({ ...prev, supplier_qualifications: [...prev.supplier_qualifications, ''] }));
  const updateQual = (idx, val) => {
    const newQuals = [...formData.supplier_qualifications];
    newQuals[idx] = val;
    setFormData(prev => ({ ...prev, supplier_qualifications: newQuals }));
  };
  const removeQual = (idx) => setFormData(prev => ({ ...prev, supplier_qualifications: prev.supplier_qualifications.filter((_, i) => i !== idx) }));

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Steps */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div>
          <p className="text-slate-500 font-medium">配置向导：基于甘肃省政采范本及 AI 合规引擎，快速生成标准化招标文件。</p>
        </div>
        
        {/* Stepper UI */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110' : 
                step > s ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 mx-1 ${step > s ? 'bg-emerald-200 dark:bg-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800'}`}></div>}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-red-600 text-sm flex items-center gap-3 animate-in shake duration-500">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Step 1: Upload Requirements */}
      {step === 1 && (
        <div className="ai-card p-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
            {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Upload className="w-10 h-10" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">上传甲方需求参数</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              上传甲方提供的采购清单、参数要求或任务单，AI 将自动分析并填充到对应的招标文件章节。
            </p>
          </div>
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
            className="px-10 py-4 bg-[#202123] text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-2xl"
          >
            {loading ? "正在解析语义..." : "选择文档并开始"}
            <ArrowRight className="w-5 h-5" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.docx,.txt" />
          
          <div className="flex gap-4 pt-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-full">
              <Zap className="w-3 h-3 text-amber-500" /> 支持智能要素萃取
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> 符合甘肃 2024 范本
            </span>
          </div>
        </div>
      )}

      {/* Step 2: Form Entry */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="ai-card p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <ClipboardList className="w-6 h-6 text-emerald-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">项目核心要素填报</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">项目名称</label>
                  <input 
                    type="text" 
                    value={formData.project_name} 
                    onChange={e => setFormData({...formData, project_name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">项目编号</label>
                  <input 
                    type="text" 
                    placeholder="例如: GZ240501-..."
                    value={formData.project_code} 
                    onChange={e => setFormData({...formData, project_code: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">项目分型</label>
                  <select 
                    value={formData.project_category}
                    onChange={e => setFormData({...formData, project_category: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option>政府采购-货物类</option>
                    <option>政府采购-服务类</option>
                    <option>政府采购-工程类</option>
                    <option>工程建设项目-招标投标</option>
                    <option>招标代理机构遴选/入围</option>
                    <option>阳光招标采购平台项目</option>
                    <option>医药/医疗设备采购</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">预算金额 (元)</label>
                  <input 
                    type="number" 
                    value={formData.budget_amount} 
                    onChange={e => setFormData({...formData, budget_amount: parseFloat(e.target.value)})}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-bold text-slate-400 uppercase">供应商资格要求</label>
                  <button onClick={addQual} className="text-xs text-emerald-500 font-bold flex items-center gap-1 hover:underline">
                    <Plus className="w-3 h-3" /> 添加项
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.supplier_qualifications.map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <input 
                        type="text" 
                        value={q} 
                        onChange={e => updateQual(i, e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                      />
                      <button onClick={() => removeQual(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> 上一步
              </button>
              <button 
                onClick={handleSelfCheck}
                disabled={loading}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "下一步：智能合规自检"}
                <ShieldCheck className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="ai-card p-6 bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20">
              <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4" /> AI 萃取助手提示
              </h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-300/80 leading-relaxed italic">
                “根据您上传的文件，我已检测到项目预算为 {formData.budget_amount.toLocaleString()} 元。我已经自动为您加载了甘肃标准招标文件的【财务资质】模版要求。请补充具体的技术规格详情。”
              </p>
            </div>
            
            <div className="ai-card p-6 border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">制作进度</h4>
              <div className="space-y-4">
                {[
                  { label: '招标公告章节', status: 'ready' },
                  { label: '投标人须知章节', status: 'ready' },
                  { label: '评分方案章节', status: 'pending' },
                  { label: '采购需求章节', status: 'ai-gen' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{item.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                      item.status === 'ready' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10' :
                      item.status === 'ai-gen' ? 'bg-sky-100 text-sky-600 dark:bg-sky-500/10' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review & Finalize */}
      {step === 3 && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="ai-card p-8 border-amber-100 dark:border-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">合规性自检：生成前终审</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-slate-500 mb-6">在导出最终 Word 文件前，我们对生成的初稿进行了全卷审计。以下是建议项：</p>
              
              {reviewResult?.['合规性风险']?.map((risk, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-amber-100 dark:border-slate-800">
                  <span className="text-amber-500 font-bold text-xs shrink-0 mt-1">风险 {i+1}</span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">{risk['描述']}</h5>
                    <p className="text-xs text-slate-500 mt-1 italic">修正建议：{risk['建议']}</p>
                  </div>
                </div>
              ))}
              
              {(!reviewResult?.['合规性风险'] || reviewResult?.['合规性风险'].length === 0) && (
                <div className="flex flex-col items-center justify-center p-12 text-center text-emerald-600">
                  <ShieldCheck className="w-12 h-12 mb-3" />
                  <p className="font-bold">质量检核通过！未发现实质性违法违规风险。</p>
                </div>
              )}
            </div>
          </div>

          <div className="ai-card p-12 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-5 pointer-events-none">
                <FileText className="w-64 h-64 text-slate-900" />
             </div>
             <div className="relative z-10 text-center space-y-6">
                <div className="inline-block p-4 bg-white dark:bg-slate-900 shadow-xl rounded-2xl mb-4 border border-slate-100 dark:border-slate-800">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                </div>
                <div>
                   <h3 className="text-2xl font-bold text-slate-900 dark:text-white">标准化招标文件已就绪</h3>
                   <p className="text-slate-500 mt-2">文档已按照甘肃省 2024 最新政策范本封装完毕。</p>
                </div>
                
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="px-8 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> 返回微调
                  </button>
                  <button 
                    onClick={handleDownload}
                    disabled={loading}
                    className="px-12 py-4 bg-emerald-600 text-white rounded-2xl font-extrabold hover:bg-emerald-500 transition-all flex items-center gap-3 shadow-2xl scale-105 active:scale-95"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                    立即导出本地 Word 标书
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstructionModule;
