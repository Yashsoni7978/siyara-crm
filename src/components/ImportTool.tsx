'use client';

import React, { useState } from 'react';
import { ImportSummary, Lead } from '../types/crm';
import { FilePlus, CheckCircle2, Sparkles, AlertTriangle, Table } from 'lucide-react';
import { validateImportBatch, executeImportBatch } from '../app/actions';

interface ImportToolProps {
  onImportComplete: (updatedLeads: Lead[], summary: ImportSummary) => void;
  organizationId: string;
}

export const ImportTool: React.FC<ImportToolProps> = ({ onImportComplete, organizationId }) => {
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [lastSummary, setLastSummary] = useState<ImportSummary | null>(null);

  const sampleCsvSnippet = `Business Name\tPhone\tEmail\tWebsite\tMaps Link\tRating\tReviews
Dr. Rahul Kapoor Dental Clinic\t+919876500111\tdrrahul@gmail.com\thttps://rahuldental.com\thttps://maps.google.com/?q=rahul+dental\t4.9\t140
Elite Wedding & Event Planners\t+919876500222\tinfo@eliteweddings.in\thttps://eliteweddings.in\thttps://maps.google.com/?q=elite+weddings\t4.8\t88`;

  const handleValidate = async () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    setLastSummary(null);
    try {
      const rows = await validateImportBatch(rawText, organizationId);
      setPreviewRows(rows);
      setHasValidated(true);
    } catch (e) {
      console.error(e);
      alert('Validation failed. See console.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async (skipDuplicates: boolean) => {
    setIsProcessing(true);
    try {
      const leadsToImport = skipDuplicates 
        ? previewRows.filter(r => r.status === 'New')
        : previewRows.filter(r => r.status !== 'Invalid');

      const result = await executeImportBatch(leadsToImport, organizationId);
      
      const summary = {
        pastedCount: previewRows.length,
        duplicateCount: previewRows.filter(r => r.status === 'Duplicate').length,
        addedCount: result.addedCount,
        batchLabel: 'Scraper Import'
      };
      
      setLastSummary(summary);
      onImportComplete([], summary);
      
      // Reset
      setRawText('');
      setPreviewRows([]);
      setHasValidated(false);
    } catch (e) {
      console.error(e);
      alert('Import failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setPreviewRows([]);
    setHasValidated(false);
    setRawText('');
  };

  const newCount = previewRows.filter(r => r.status === 'New').length;
  const duplicateCount = previewRows.filter(r => r.status === 'Duplicate').length;
  const invalidCount = previewRows.filter(r => r.status === 'Invalid').length;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Section */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <FilePlus size={22} color="white" />
          </div>
          Import Scraped Leads
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Seamlessly import leads from Instant Data Scraper. Our intelligent system automatically detects and prevents duplicates.
        </p>
      </div>

      <div style={{ 
        background: 'var(--bg-main)', 
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.5)', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '2rem' }}>
          {!hasValidated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your raw CSV or tab-separated data here..."
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-main)',
                    background: 'var(--bg-card)',
                    fontSize: '0.95rem',
                    fontFamily: 'monospace',
                    resize: 'vertical',
                    outline: 'none',
                    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 3px var(--primary-light)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-main)';
                    e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)';
                  }}
                />
                {!rawText && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', opacity: 0.1 }}>
                    <Table size={64} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button 
                  onClick={handleValidate} 
                  disabled={!rawText.trim() || isProcessing} 
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white',
                    border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600,
                    cursor: !rawText.trim() || isProcessing ? 'not-allowed' : 'pointer',
                    opacity: !rawText.trim() || isProcessing ? 0.7 : 1,
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                  }}
                >
                  <Sparkles size={18} />
                  {isProcessing ? 'Analyzing Data...' : 'Validate Import Data'}
                </button>
                <button 
                  onClick={() => setRawText(sampleCsvSnippet)} 
                  style={{
                    padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--text-muted)',
                    border: '1px solid var(--border-main)', borderRadius: 'var(--radius-sm)', fontWeight: 500,
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  Load Sample Data
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-main)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Validation Results</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-main)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.875rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }}></span>
                    <span style={{ fontWeight: 600, color: '#475569' }}>Total: {previewRows.length}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--success)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.875rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                    <span style={{ fontWeight: 600, color: '#047857' }}>New: {newCount}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--danger)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.875rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)' }}></span>
                    <span style={{ fontWeight: 600, color: '#b91c1c' }}>Duplicates: {duplicateCount}</span>
                  </div>
                  {invalidCount > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--warning)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.875rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
                      <span style={{ fontWeight: 600, color: '#b45309' }}>Invalid: {invalidCount}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ 
                maxHeight: '350px', 
                overflowY: 'auto', 
                border: '1px solid var(--border-main)', 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-sm)' 
              }}>
                <table style={{ width: '100%', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-main)', zIndex: 10, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                    <tr>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-main)' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-main)' }}>Business</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-main)' }}>Phone</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-main)' }}>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((r, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-main)', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-hover)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ 
                            padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px',
                            background: r.status === 'New' ? '#ecfdf5' : r.status === 'Duplicate' ? 'var(--danger)' : '#fffbeb',
                            color: r.status === 'New' ? '#059669' : r.status === 'Duplicate' ? '#dc2626' : '#d97706'
                          }}>
                            {r.status === 'Duplicate' && <AlertTriangle size={12} />}
                            {r.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-main)' }}>{r.businessName || '-'}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{r.phone || '-'}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{r.category || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '1rem' }}>
                <button 
                  onClick={() => handleImport(true)} 
                  disabled={isProcessing || newCount === 0} 
                  style={{
                    padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white',
                    border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)', opacity: isProcessing || newCount === 0 ? 0.5 : 1
                  }}
                >
                  Import {newCount} New Leads
                </button>
                <button 
                  onClick={() => handleImport(false)} 
                  disabled={isProcessing || duplicateCount === 0} 
                  style={{
                    padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--danger)',
                    border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', fontWeight: 500, cursor: 'pointer',
                    opacity: isProcessing || duplicateCount === 0 ? 0.5 : 1
                  }}
                >
                  Import All (Force Duplicates)
                </button>
                <div style={{ flex: 1 }}></div>
                <button 
                  onClick={handleCancel} 
                  disabled={isProcessing} 
                  style={{
                    padding: '0.75rem 1.5rem', background: 'var(--bg-hover)', color: 'var(--text-main)',
                    border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 500, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {lastSummary && !hasValidated && (
            <div style={{ 
              marginTop: '2rem', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', 
              background: 'linear-gradient(to right, #ecfdf5, #d1fae5)', border: '1px solid #a7f3d0', 
              display: 'flex', alignItems: 'flex-start', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)'
            }}>
              <CheckCircle2 size={24} color="#059669" style={{ marginTop: '2px' }} />
              <div>
                <h4 style={{ fontWeight: 700, color: '#047857', fontSize: '1.1rem', margin: '0 0 4px 0' }}>Import Successful!</h4>
                <p style={{ color: '#065f46', margin: 0, fontSize: '0.95rem' }}>
                  Successfully processed <strong>{lastSummary.pastedCount}</strong> leads. 
                  Added <strong style={{ color: '#047857' }}>{lastSummary.addedCount}</strong> new leads 
                  and skipped <strong style={{ color: '#dc2626' }}>{lastSummary.duplicateCount}</strong> duplicates.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
