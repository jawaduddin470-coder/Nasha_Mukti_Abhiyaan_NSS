import React, { useState, useEffect } from 'react';
import {
  Award,
  Search,
  Download,
  ExternalLink,
  Eye,
  Sliders,
  RefreshCw,
  Save,
  Copy,
  Check,
  ShieldCheck,
  FileCheck2,
  Settings2,
} from 'lucide-react';
import { certificateService } from '../../services/certificateService';
import {
  CertificateAdminItem,
  CertificateSettingsResponse,
} from '../../types/certificate';

export const CertificateManager: React.FC<{ isSuperAdmin?: boolean }> = ({ isSuperAdmin = false }) => {
  const [activeTab, setActiveTab] = useState<'records' | 'templates'>('records');
  const [selectedTemplateType, setSelectedTemplateType] = useState<'anti_drug_awareness' | 'national_unity_day'>('anti_drug_awareness');

  // Certificate Records State
  const [records, setRecords] = useState<CertificateAdminItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quizFilter, setQuizFilter] = useState<string>('all');
  const [loadingRecords, setLoadingRecords] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Settings State
  const [settings, setSettings] = useState<CertificateSettingsResponse | null>(null);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Interactive Live Positioning Inputs
  const [antiDrugEnabled, setAntiDrugEnabled] = useState<boolean>(true);
  const [antiDrugFontSize, setAntiDrugFontSize] = useState<number>(17);
  const [antiDrugYOffset, setAntiDrugYOffset] = useState<number>(0);
  const [antiDrugXOffset, setAntiDrugXOffset] = useState<number>(0);

  const [unityDayEnabled, setUnityDayEnabled] = useState<boolean>(true);
  const [unityDayFontSize, setUnityDayFontSize] = useState<number>(21);
  const [unityDayYOffset, setUnityDayYOffset] = useState<number>(0);
  const [unityDayXOffset, setUnityDayXOffset] = useState<number>(0);

  // Test name for preview
  const [previewTestName, setPreviewTestName] = useState<string>('Mohammed Abdul Quddus');

  // 1. Fetch Records
  const fetchRecords = async () => {
    setLoadingRecords(true);
    try {
      const data = await certificateService.getAdminCertificates({
        search: searchQuery,
        quizId: quizFilter,
        limit: 100,
      });
      setRecords(data.certificates);
      setTotalCount(data.total);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err?.message || 'Failed to fetch issued certificates.' });
    } finally {
      setLoadingRecords(false);
    }
  };

  // 2. Fetch Settings
  const fetchSettings = async () => {
    try {
      const data = await certificateService.getAdminSettings();
      setSettings(data);
      setAntiDrugEnabled(data.antiDrug.enabled);
      setAntiDrugFontSize(data.antiDrug.fontSize);
      setAntiDrugYOffset(data.antiDrug.yOffset);
      setAntiDrugXOffset(data.antiDrug.xOffset);

      setUnityDayEnabled(data.unityDay.enabled);
      setUnityDayFontSize(data.unityDay.fontSize);
      setUnityDayYOffset(data.unityDay.yOffset);
      setUnityDayXOffset(data.unityDay.xOffset);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [searchQuery, quizFilter]);

  useEffect(() => {
    fetchSettings();
  }, []);

  // Copy Certificate ID
  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      setMessage({ type: 'error', text: 'Restricted: Super Administrator permissions required to edit certificate configurations.' });
      return;
    }

    setSavingSettings(true);
    setMessage(null);
    try {
      const updated = await certificateService.updateAdminSettings({
        antiDrugEnabled,
        antiDrugFontSize,
        antiDrugYOffset,
        antiDrugXOffset,
        unityDayEnabled,
        unityDayFontSize,
        unityDayYOffset,
        unityDayXOffset,
      });
      setSettings(updated);
      setMessage({ type: 'success', text: 'Certificate configuration and typography positioning updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save certificate parameters.' });
    } finally {
      setSavingSettings(false);
    }
  };

  const currentFontSize = selectedTemplateType === 'anti_drug_awareness' ? antiDrugFontSize : unityDayFontSize;
  const currentYOffset = selectedTemplateType === 'anti_drug_awareness' ? antiDrugYOffset : unityDayYOffset;
  const currentXOffset = selectedTemplateType === 'anti_drug_awareness' ? antiDrugXOffset : unityDayXOffset;

  const previewPdfUrl = certificateService.getAdminPreviewPdfUrl(
    selectedTemplateType,
    previewTestName,
    currentFontSize,
    currentYOffset,
    currentXOffset,
  );

  return (
    <div className="space-y-6">
      {/* =========================================================================
          TOP BANNER & OVERVIEW
          ========================================================================= */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#183153] to-[#0A192F] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-400/20 text-teal-300 border border-teal-400/30">
              Institutional Certification
            </span>
            <span className="text-xs text-slate-300">NSS MJCET Automated System</span>
          </div>
          <h1 className="text-2xl font-bold font-serif">Certificate Management &amp; Registry</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Audit generated participation certificates, search recipient records, configure name positioning, and govern issuance parameters.
          </p>
        </div>

        {/* Global Summary Metric Cards */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
            <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Total Issued</p>
            <p className="text-xl font-bold font-mono text-teal-300">{totalCount}</p>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
            <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Issuance Engine</p>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-center mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active</span>
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between animate-fadeIn ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
        >
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} className="font-bold underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#CFE3F0] dark:border-[#22416D] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'records'
              ? 'bg-[#159E9A] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-[#EAF6FC] dark:hover:bg-[#1A3459]'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Issued Certificates Registry ({totalCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'templates'
              ? 'bg-[#159E9A] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-[#EAF6FC] dark:hover:bg-[#1A3459]'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Template Configuration &amp; Positioning</span>
        </button>
      </div>

      {activeTab === 'records' ? (
        /* =========================================================================
           TAB 1: ISSUED CERTIFICATES REGISTRY
           ========================================================================= */
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#183153] border border-[#CFE3F0] dark:border-[#22416D] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, roll no, or cert ID..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={quizFilter}
                onChange={(e) => setQuizFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
              >
                <option value="all">All Certificate Types</option>
                <option value="nmba-awareness-challenge-v1">Anti-Drug Awareness Certificates</option>
                <option value="national-unity-day-quiz-v1">National Unity Day Certificates</option>
              </select>

              <button
                type="button"
                onClick={fetchRecords}
                className="p-2 rounded-xl border border-[#CFE3F0] dark:border-[#243A5E] hover:bg-[#EAF6FC] dark:hover:bg-[#1A3459] transition-colors cursor-pointer text-slate-500"
                title="Refresh Registry"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Records Table */}
          {loadingRecords ? (
            <div className="p-16 text-center bg-white dark:bg-[#183153] rounded-2xl border border-[#CFE3F0] dark:border-[#22416D]">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#159E9A] mb-2" />
              <p className="text-xs text-slate-500">Querying certificate database...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="p-16 text-center bg-white dark:bg-[#183153] rounded-2xl border border-[#CFE3F0] dark:border-[#22416D] space-y-2">
              <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-[#183153] dark:text-white">No Certificate Records Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Certificates are issued automatically as participants achieve 70% or higher in either official challenge.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#CFE3F0] dark:border-[#22416D] bg-white dark:bg-[#183153] shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#EAF5FB] dark:bg-[#12233C] text-[#183153] dark:text-slate-200 border-b border-[#CFE3F0] dark:border-[#22416D] uppercase text-[10px] font-bold">
                    <th className="py-3 px-3">Certificate ID</th>
                    <th className="py-3 px-3">Participant Name</th>
                    <th className="py-3 px-3">Contact &amp; Roll</th>
                    <th className="py-3 px-3">Challenge Initiative</th>
                    <th className="py-3 px-3 text-center">Score</th>
                    <th className="py-3 px-3">Issued On</th>
                    <th className="py-3 px-3 text-center">Downloads</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAF5FB] dark:divide-[#1F375B]">
                  {records.map((cert) => {
                    const isUnity = cert.certificateType === 'national_unity_day';

                    return (
                      <tr
                        key={cert.certificateId}
                        className="hover:bg-[#EAF6FC]/50 dark:hover:bg-[#1E3B63]/40 transition-colors"
                      >
                        <td className="py-3 px-3 font-mono font-bold">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] ${
                                isUnity
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                                  : 'bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-300'
                              }`}
                            >
                              {cert.certificateId}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(cert.certificateId)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                              title="Copy ID"
                            >
                              {copiedId === cert.certificateId ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-semibold text-[#183153] dark:text-white">
                          <div>{cert.participantName}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            {cert.participantInstitution}
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          <div>{cert.participantEmail}</div>
                          {cert.participantRollNumber && (
                            <div className="text-[10px] text-slate-400">Roll: {cert.participantRollNumber}</div>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isUnity
                                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800'
                                : 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
                            }`}
                          >
                            {cert.quizTitle}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center font-mono font-bold text-[#183153] dark:text-white">
                          <span>{cert.score}</span>
                          <span className="text-[10px] text-slate-400">/{cert.maxScore}</span>
                          <div className="text-[10px] text-emerald-600 font-semibold">{cert.percentage}%</div>
                        </td>

                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                          {new Date(cert.issuedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600 dark:text-slate-300">
                          {cert.downloadCount || 0}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={cert.downloadUrl}
                              download
                              className="p-1.5 rounded-lg border border-[#CFE3F0] dark:border-[#243A5E] hover:bg-[#EAF6FC] dark:hover:bg-[#1E3B63] transition-colors cursor-pointer text-[#159E9A]"
                              title="Download PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`${cert.downloadUrl}?view=true`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-[#CFE3F0] dark:border-[#243A5E] hover:bg-[#EAF6FC] dark:hover:bg-[#1E3B63] transition-colors cursor-pointer text-slate-500"
                              title="View in Browser"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
           TAB 2: TEMPLATE CONFIGURATION & POSITIONING
           ========================================================================= */
        <div className="space-y-6">
          {/* Certificate Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedTemplateType('anti_drug_awareness')}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                selectedTemplateType === 'anti_drug_awareness'
                  ? 'bg-gradient-to-br from-[#183153] to-[#22446E] text-white border-[#183153] shadow-lg ring-2 ring-[#159E9A]'
                  : 'bg-white dark:bg-[#183153] text-[#183153] dark:text-white border-[#CFE3F0] dark:border-[#22416D] hover:border-[#159E9A]'
              }`}
            >
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">Certificate Template A</span>
              <h3 className="text-base font-bold font-serif mt-1">Anti-Drug Awareness Programme</h3>
              <p className="text-xs opacity-75 mt-1 font-mono">
                Font: Georgia Pro (or Georgia) • Template: v{settings?.antiDrug.templateVersion || '1.0'} (A4 Landscape)
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTemplateType('national_unity_day')}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                selectedTemplateType === 'national_unity_day'
                  ? 'bg-gradient-to-br from-[#183153] to-[#22446E] text-white border-[#183153] shadow-lg ring-2 ring-[#159E9A]'
                  : 'bg-white dark:bg-[#183153] text-[#183153] dark:text-white border-[#CFE3F0] dark:border-[#22416D] hover:border-[#159E9A]'
              }`}
            >
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">Certificate Template B</span>
              <h3 className="text-base font-bold font-serif mt-1">National Unity Day Celebration</h3>
              <p className="text-xs opacity-75 mt-1 font-mono">
                Font: Yeseva One • Template: v{settings?.unityDay.templateVersion || '1.0'} (A4 Landscape)
              </p>
            </button>
          </div>

          {/* Interactive Configuration Form & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Configuration Form */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#183153] border border-[#CFE3F0] dark:border-[#22416D] shadow-sm space-y-5">
              <div className="border-b border-[#CFE3F0] dark:border-[#22416D] pb-3">
                <h3 className="text-sm font-bold text-[#183153] dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#159E9A]" />
                  <span>Typography &amp; Layout Calibration</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time coordinate offsets applied directly during PDF vector compilation.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                {/* Issuance Toggle */}
                <div className="p-3.5 rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#183153] dark:text-white">Issuance Availability</p>
                    <p className="text-[10px] text-slate-400">Allow eligible quiz participants to download this certificate</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTemplateType === 'anti_drug_awareness' ? antiDrugEnabled : unityDayEnabled}
                      onChange={(e) => {
                        if (selectedTemplateType === 'anti_drug_awareness') {
                          setAntiDrugEnabled(e.target.checked);
                        } else {
                          setUnityDayEnabled(e.target.checked);
                        }
                      }}
                      disabled={!isSuperAdmin}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#159E9A]"></div>
                  </label>
                </div>

                {/* Test Name Input */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#183153] dark:text-slate-200">
                    Preview Sample Name
                  </label>
                  <input
                    type="text"
                    value={previewTestName}
                    onChange={(e) => setPreviewTestName(e.target.value)}
                    placeholder="Enter test name..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                  />
                </div>

                {/* Font Size */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[#183153] dark:text-slate-200">
                      Font Size ({currentFontSize} pt)
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Default: {selectedTemplateType === 'anti_drug_awareness' ? '20' : '26'} pt</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="34"
                    value={currentFontSize}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (selectedTemplateType === 'anti_drug_awareness') {
                        setAntiDrugFontSize(val);
                      } else {
                        setUnityDayFontSize(val);
                      }
                    }}
                    disabled={!isSuperAdmin}
                    className="w-full accent-[#159E9A]"
                  />
                </div>

                {/* Vertical Offset (Y) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[#183153] dark:text-slate-200">
                      Vertical Offset (Y: {currentYOffset > 0 ? `+${currentYOffset}` : currentYOffset} pt)
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Shift Up / Down</span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    value={currentYOffset}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (selectedTemplateType === 'anti_drug_awareness') {
                        setAntiDrugYOffset(val);
                      } else {
                        setUnityDayYOffset(val);
                      }
                    }}
                    disabled={!isSuperAdmin}
                    className="w-full accent-[#159E9A]"
                  />
                </div>

                {/* Horizontal Offset (X) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[#183153] dark:text-slate-200">
                      Horizontal Offset (X: {currentXOffset > 0 ? `+${currentXOffset}` : currentXOffset} pt)
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Shift Left / Right</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    value={currentXOffset}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (selectedTemplateType === 'anti_drug_awareness') {
                        setAntiDrugXOffset(val);
                      } else {
                        setUnityDayXOffset(val);
                      }
                    }}
                    disabled={!isSuperAdmin}
                    className="w-full accent-[#159E9A]"
                  />
                </div>

                {isSuperAdmin && (
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="w-full py-2.5 rounded-xl bg-[#159E9A] hover:bg-[#0E8581] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Save Parameters to MongoDB</span>
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Right: Real-Time High-Res Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#183153] border border-[#CFE3F0] dark:border-[#22416D] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#CFE3F0] dark:border-[#22416D] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#183153] dark:text-white">
                      Live Certificate Visual Output
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Font: <strong>{selectedTemplateType === 'anti_drug_awareness' ? 'Georgia Pro' : 'Yeseva One'}</strong> (Vector PDF embedding)
                    </p>
                  </div>

                  <a
                    href={previewPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-[#EAF5FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] hover:bg-[#D7EEF9] dark:hover:bg-[#1E3B63] text-xs font-bold text-[#159E9A] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Full PDF</span>
                  </a>
                </div>

                {/* Simulated Certificate Preview Box */}
                <div className="rounded-xl overflow-hidden border border-[#CFE3F0] dark:border-[#243A5E] shadow-inner bg-slate-100 dark:bg-slate-900 relative aspect-[1024/723]">
                  <img
                    src={
                      selectedTemplateType === 'anti_drug_awareness'
                        ? '/assets/certificates/anti_drug_awareness_template.jpg'
                        : '/assets/certificates/national_unity_day_template.png'
                    }
                    alt="Template Canvas"
                    className="w-full h-full object-contain"
                  />

                  {/* Overlaid preview text reflecting sliders */}
                  <div className="absolute inset-0 pointer-events-none">
                    {selectedTemplateType === 'national_unity_day' ? (
                      <div
                        className="absolute text-center transition-all duration-100"
                        style={{
                          top: '55.5%',
                          left: '12%',
                          right: '12%',
                          transform: `translate(${currentXOffset}px, calc(-50% - ${currentYOffset}px))`,
                        }}
                      >
                        <span
                          className="font-serif font-bold text-[#13264B] tracking-wide"
                          style={{ fontSize: `${currentFontSize * 0.72}px` }}
                        >
                          {previewTestName}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="absolute text-center transition-all duration-100"
                        style={{
                          top: '52.5%',
                          left: '38.9%',
                          width: '39.0%',
                          transform: `translate(${currentXOffset}px, calc(-50% - ${currentYOffset}px))`,
                        }}
                      >
                        <span
                          className="font-serif font-normal text-[#23272F]"
                          style={{ fontSize: `${currentFontSize * 0.72}px` }}
                        >
                          {previewTestName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0]/60 dark:border-[#243A5E]/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Print Resolution: 300 DPI vector output. The participant's registered name automatically shrinks if it exceeds line boundaries.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
