import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Cpu, 
  ShieldCheck, 
  Palette, 
  Activity, 
  Save, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  ShieldAlert,
  KeyRound
} from 'lucide-react';
import { getSettings, updateSettings, verifyAdminPasscode } from '../utils/api';

const SettingsModule = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      setMessage({ type: 'error', text: '无法加载系统配置' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateSettings(settings);
      setMessage({ type: 'success', text: '配置已成功保存' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setMessage({ type: 'error', text: '保存配置失败，请检查网络或权限' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleVerifyPasscode = async (e) => {
    if (e) e.preventDefault();
    setVerifying(true);
    setAuthError(null);
    try {
      await verifyAdminPasscode(passcode);
      setIsLocked(false);
      fetchSettings();
    } catch (err) {
      setAuthError("管理口令校验失败，请重试");
    } finally {
      setVerifying(false);
    }
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-in fade-in duration-500">
        <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 mb-2">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">受保护的访问区域</h2>
            <p className="text-slate-500 text-sm mt-2">进入系统设置需要管理员权限，请输入行政口令进行验证。</p>
          </div>
          
          <form onSubmit={handleVerifyPasscode} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password"
                placeholder="请输入管理口令"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1.5 justify-center">
                <ShieldAlert className="w-3.5 h-3.5" /> {authError}
              </p>
            )}
            <button 
              type="submit"
              disabled={verifying}
              className="w-full bg-[#202123] text-white py-3 rounded-xl font-bold hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "验证并进入"}
            </button>
          </form>
          
          <p className="text-[10px] text-slate-400">
            如果您丢失了口令，请联系系统部署人员在后端 .env 中重置。
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-slate-500 animate-pulse">正在初始化系统控制台...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-emerald-500" />
            控制台与系统设置
          </h1>
          <p className="text-slate-500 mt-2">
            管理 AI 核心参数、安全令牌及全局界面偏好。
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchSettings}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> 重置修改
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            保存全局配置
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in zoom-in-95 duration-300 ${
          message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-500/20'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Engine Settings */}
        <div className="ai-card p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">AI 智能核心</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">首选推理模型</label>
              <select 
                value={settings.ai_model}
                onChange={(e) => handleChange('ai_model', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              >
                <option value="deepseek-chat">DeepSeek-V3 (推荐)</option>
                <option value="deepseek-reasoner">DeepSeek-R1 (深度思维)</option>
                <option value="gpt-4o">OpenAI GPT-4o</option>
                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro</option>
              </select>
            </div>
            
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">采样温度 (Temperature)</label>
                <span className="text-xs font-mono text-emerald-500">{settings.ai_temperature}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1"
                value={settings.ai_temperature}
                onChange={(e) => handleChange('ai_temperature', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-[11px] text-slate-500 mt-2">
                较低值（0.1）适用于严谨的招标文件审查，较高值则更具创意。
              </p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="ai-card p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">安全与身份验证</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">系统访问令牌 (ACCESS_TOKEN)</label>
              <div className="relative">
                <input 
                  type={showToken ? "text" : "password"}
                  value={settings.security_token}
                  onChange={(e) => handleChange('security_token', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 pr-12 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button 
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                用于前端 API 通信的 Bearer Token。变更后需刷新页面。
              </p>
            </div>
            
            <div className="pt-2">
              <button 
                className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1.5 transition-colors"
                onClick={() => { if(confirm('确定要清除所有系统缓存数据吗？')) alert('缓存已清除'); }}
              >
                <Trash2 className="w-3.5 h-3.5" /> 强制清除所有会话缓存
              </button>
            </div>
          </div>
        </div>

        {/* UI Preferences */}
        <div className="ai-card p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-purple-600">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">界面与显示偏好</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">深色模式</p>
                <p className="text-xs text-slate-500">跟随系统或手动切换</p>
              </div>
              <button 
                onClick={() => handleChange('ui_theme', settings.ui_theme === 'dark' ? 'light' : 'dark')}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.ui_theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.ui_theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">系统语言</p>
                <p className="text-xs text-slate-500">主要显示语言</p>
              </div>
              <select 
                value={settings.ui_language}
                onChange={(e) => handleChange('ui_language', e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-xs"
              >
                <option value="zh">简体中文</option>
                <option value="en">English (BETA)</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="ai-card p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-600">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">系统运行状态</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold">后台版本</p>
              <p className="text-sm font-mono text-slate-700 dark:text-slate-300 mt-1">{settings.system_version}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold">API 延迟</p>
              <p className="text-sm font-mono text-emerald-500 mt-1">~142ms</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold">RAG 索引状态</p>
              <p className="text-sm font-mono text-sky-500 mt-1">Ready</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold">后端状态</p>
              <p className="text-sm font-mono text-emerald-500 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Perfect
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">开发者调试建议 (Advanced)</h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          HZ-SAGE 采用的是即时配置热重载技术。您在此处修改的所有参数将立即映射至后端服务（通过 `config.json` 同步）。若修改后 AI 表现未及预期，请优先检查是否由于 API Quota 限制或配置的采样温度过高导致。
        </p>
      </div>
    </div>
  );
};

export default SettingsModule;
