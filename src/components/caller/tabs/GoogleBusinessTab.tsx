import React from 'react';
import { Lead } from '../../../types/crm';
import { ExternalLink, Star } from 'lucide-react';

interface GoogleBusinessTabProps {
  lead: Lead;
}

export const GoogleBusinessTab: React.FC<GoogleBusinessTabProps> = ({ lead }) => {
  return (
    <div className="cw-tab-content">
      <div className="cw-grid-2">
        <div className="cw-info-block">
          <label className="label">Rating & Reviews</label>
          <div className="cw-info-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <span style={{ fontWeight: 600 }}>{lead.rating || 'N/A'}</span>
            <span className="text-muted">({lead.reviewCount || 0} reviews)</span>
          </div>
        </div>
        <div className="cw-info-block">
          <label className="label">Business Age</label>
          <div className="cw-info-value">{lead.businessAge || 'Unknown'}</div>
        </div>
        <div className="cw-info-block">
          <label className="label">Opening Hours</label>
          <div className="cw-info-value">{lead.openingHours || 'Not provided'}</div>
        </div>
        <div className="cw-info-block">
          <label className="label">Website</label>
          <div className="cw-info-value">
            {lead.website ? (
              <a href={lead.website} target="_blank" rel="noreferrer" className="text-primary flex items-center gap-1" style={{ textDecoration: 'none' }}>
                {lead.website}
                <ExternalLink size={12} />
              </a>
            ) : 'No website'}
          </div>
        </div>
        <div className="cw-info-block" style={{ gridColumn: 'span 2' }}>
          <label className="label">Latest Review</label>
          <div className="cw-quote-block">
            "{lead.latestReview || 'No reviews recorded.'}"
          </div>
        </div>
        <div className="cw-info-block" style={{ gridColumn: 'span 2' }}>
          {lead.mapsLink ? (
             <a href={lead.mapsLink} target="_blank" rel="noreferrer" className="btn btn-secondary">
               Open in Google Maps
             </a>
          ) : (
            <span className="text-muted">No Maps link available</span>
          )}
        </div>
      </div>
    </div>
  );
};
