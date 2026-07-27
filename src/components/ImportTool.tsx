'use client';

import React, { useState } from 'react';
import { ImportSummary, Lead } from '../types/crm';
import { importPastedLeads } from '../lib/storage';
import { FilePlus, CheckCircle2, Sparkles } from 'lucide-react';

interface ImportToolProps {
  onImportComplete: (updatedLeads: Lead[], summary: ImportSummary) => void;
}

export const ImportTool: React.FC<ImportToolProps> = ({ onImportComplete }) => {
  const [rawText, setRawText] = useState('');
  const [lastSummary, setLastSummary] = useState<ImportSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleCsvSnippet = `Business Name\tPhone\tEmail\tWebsite\tMaps Link\tRating\tReviews
Dr. Rahul Kapoor Dental Clinic\t+919876500111\tdrrahul@gmail.com\thttps://rahuldental.com\thttps://maps.google.com/?q=rahul+dental\t4.9\t140
Elite Wedding & Event Planners\t+919876500222\tinfo@eliteweddings.in\thttps://eliteweddings.in\thttps://maps.google.com/?q=elite+weddings\t4.8\t88`;

  const handleImport = () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const { summary, updatedLeads } = importPastedLeads(rawText);
      setLastSummary(summary);
      onImportComplete(updatedLeads, summary);
      setIsProcessing(false);
      setRawText('');
    }, 300);
  };

  const handleLoadSample = () => {
    setRawText(sampleCsvSnippet);
  };

  return (
    <div className="panel" style={{ border: '1px solid var(--border-color)' }}>
      <div className="panel-title">
        <FilePlus size={20} color="#0f172a" />
        <span>Import Scraped Batch (Instant Data Scraper)</span>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
        Paste raw export text from Instant Data Scraper. New leads will be deduplicated against phone & Google Maps links, auto-tagged with today's date, and <strong>evenly divided 50/50 between User 1 & User 2</strong>.
      </p>

      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Paste your Instant Data Scraper table / CSV here..."
        className="import-box"
      />

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={handleImport}
          disabled={!rawText.trim() || isProcessing}
          className="primary-btn"
        >
          <Sparkles size={16} />
          <span>{isProcessing ? 'Processing Batch...' : 'Process & Assign Batch'}</span>
        </button>

        <button onClick={handleLoadSample} className="secondary-btn">
          Paste Sample Format
        </button>
      </div>

      {lastSummary && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <CheckCircle2 size={20} color="#059669" />
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 700, color: '#047857' }}>
              Import Complete! ({lastSummary.batchLabel})
            </div>
            <div style={{ color: '#065f46' }}>
              <strong>{lastSummary.pastedCount}</strong> rows pasted &bull;{' '}
              <strong style={{ color: '#dc2626' }}>{lastSummary.duplicateCount}</strong> duplicates skipped &bull;{' '}
              <strong style={{ color: '#047857' }}>{lastSummary.addedCount}</strong> new leads added and assigned 50/50.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
