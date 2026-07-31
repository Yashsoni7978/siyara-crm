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
    <div className="panel" style={{ border: '1px solid var(--border-color)' }}>
      <div className="panel-title">
        <FilePlus size={20} color="#0f172a" />
        <span>Import Scraped Batch (Instant Data Scraper)</span>
      </div>

      {!hasValidated ? (
        <>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
            Paste raw export text from Instant Data Scraper. We will automatically detect duplicates against existing phone numbers.
          </p>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste your Instant Data Scraper table / CSV here..."
            className="import-box"
          />

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleValidate} disabled={!rawText.trim() || isProcessing} className="primary-btn">
              <Sparkles size={16} />
              <span>{isProcessing ? 'Validating...' : 'Validate Import'}</span>
            </button>
            <button onClick={() => setRawText(sampleCsvSnippet)} className="secondary-btn">
              Paste Sample Format
            </button>
          </div>
        </>
      ) : (
        <div className="import-preview-container" style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>Total: {previewRows.length}</div>
            <div style={{ color: '#059669', fontWeight: 600 }}>New: {newCount}</div>
            <div style={{ color: '#dc2626', fontWeight: 600 }}>Duplicates: {duplicateCount}</div>
            <div style={{ color: '#d97706', fontWeight: 600 }}>Invalid: {invalidCount}</div>
          </div>
          
          <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--border-main)', borderRadius: '4px', marginBottom: '1rem' }}>
            <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-main)', borderBottom: '1px solid var(--border-main)' }}>
                <tr>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Business</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Phone</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Message</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px' }}>
                      <span style={{ 
                        padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                        background: r.status === 'New' ? '#ecfdf5' : r.status === 'Duplicate' ? '#fee2e2' : '#fef3c7',
                        color: r.status === 'New' ? '#059669' : r.status === 'Duplicate' ? '#dc2626' : '#d97706'
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '8px', fontWeight: 500 }}>{r.businessName || '-'}</td>
                    <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{r.phone || '-'}</td>
                    <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{r.category || '-'}</td>
                    <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{r.validationMessage || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={() => handleImport(true)} disabled={isProcessing || newCount === 0} className="primary-btn">
              Import {newCount} New Leads
            </button>
            <button onClick={() => handleImport(false)} disabled={isProcessing || duplicateCount === 0} className="secondary-btn" style={{ borderColor: '#dc2626', color: '#dc2626' }}>
              Import All (Force Duplicates)
            </button>
            <button onClick={handleCancel} disabled={isProcessing} className="secondary-btn">
              Cancel
            </button>
          </div>
        </div>
      )}

      {lastSummary && !hasValidated && (
        <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={20} color="#059669" />
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 700, color: '#047857' }}>Import Complete!</div>
            <div style={{ color: '#065f46' }}>
              <strong>{lastSummary.pastedCount}</strong> parsed &bull; <strong style={{ color: '#dc2626' }}>{lastSummary.duplicateCount}</strong> duplicates &bull; <strong style={{ color: '#047857' }}>{lastSummary.addedCount}</strong> leads added.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
