export function printOrDownloadReport(report) {
  if (!report) return;

  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (!printWindow) {
    alert("Please allow popups to download or print the PDF report.");
    return;
  }

  const verdictColor = 
    report.verdict === 'LIKELY_REAL' ? '#10b981' :
    report.verdict === 'LIKELY_FAKE' ? '#ef4444' :
    report.verdict === 'UNVERIFIED' ? '#f59e0b' : '#8b5cf6';

  const verdictLabel = report.verdict.replace(/_/g, ' ');

  const supportingHtml = (report.supporting_evidence || []).map(e => `
    <div style="background:#f8fafc; border-left:4px solid #10b981; padding:8px 12px; margin-bottom:8px; border-radius:4px;">
      <div style="font-weight:600; color:#0f172a;">${e.source} <span style="font-size:11px; color:#64748b;">${e.date || ''}</span></div>
      <div style="font-size:12px; color:#334155; margin-top:3px;">${e.snippet}</div>
      ${e.url ? `<div style="font-size:10px; color:#2563eb; margin-top:2px;">${e.url}</div>` : ''}
    </div>
  `).join('') || '<p style="color:#94a3b8; font-style:italic;">No direct supporting records found.</p>';

  const contradictingHtml = (report.contradicting_evidence || []).map(e => `
    <div style="background:#fff1f2; border-left:4px solid #ef4444; padding:8px 12px; margin-bottom:8px; border-radius:4px;">
      <div style="font-weight:600; color:#991b1b;">${e.source} <span style="font-size:11px; color:#64748b;">${e.date || ''}</span></div>
      <div style="font-size:12px; color:#334155; margin-top:3px;">${e.snippet}</div>
      ${e.url ? `<div style="font-size:10px; color:#2563eb; margin-top:2px;">${e.url}</div>` : ''}
    </div>
  `).join('') || '<p style="color:#94a3b8; font-style:italic;">No direct contradicting records found.</p>';

  const claimsHtml = (report.claims || []).map(c => `<li style="margin-bottom:4px; font-size:13px; color:#334155;">${c}</li>`).join('');
  const suspiciousHtml = (report.suspicious_phrases || []).map(p => `<span style="display:inline-block; background:#fee2e2; color:#b91c1c; font-size:11px; padding:2px 8px; border-radius:12px; margin:2px 4px 2px 0;">${p}</span>`).join('') || '<span style="color:#64748b; font-size:12px;">None detected</span>';

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>TruthGuard AI Report - ${report.title || 'Verification'}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; padding: 20px; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 20px; font-weight: 800; color: #0f172a; }
          .logo span { color: #0284c7; }
          .meta { font-size: 11px; color: #64748b; text-align: right; }
          .verdict-box { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; }
          .verdict-badge { font-size: 18px; font-weight: 800; color: white; background: ${verdictColor}; padding: 6px 16px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
          .score-box { text-align: right; }
          .score-num { font-size: 26px; font-weight: 800; color: #0f172a; }
          .section { margin-bottom: 16px; }
          .section-title { font-size: 14px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; }
          .disclaimer { font-size: 10px; color: #64748b; background: #f8fafc; border: 1px dashed #cbd5e1; padding: 8px; border-radius: 4px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">TruthGuard <span>AI</span> <span style="font-size:12px; font-weight:400; color:#64748b;">| News Verification System</span></div>
          <div class="meta">
            <div>Event: HackNova Bhopal 2K26</div>
            <div>Generated: ${new Date().toLocaleString()}</div>
            <div>AI Engine: ${report.ai_provider || 'Gemini'}</div>
          </div>
        </div>

        <div class="verdict-box">
          <div>
            <div style="font-size:11px; color:#64748b; margin-bottom:4px; text-transform:uppercase;">Verification Result</div>
            <div class="verdict-badge">${verdictLabel}</div>
            <div style="font-size:12px; color:#475569; margin-top:6px;">Evidence Coverage: <strong>${report.evidence_coverage || 'STANDARD'}</strong></div>
          </div>
          <div class="score-box">
            <div style="font-size:11px; color:#64748b;">Model-Estimated Confidence</div>
            <div class="score-num">${report.confidence_score}%</div>
            <div style="font-size:10px; color:#94a3b8;">(Algorithmically estimated)</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Analyzed Headline / Subject</div>
          <p style="font-size:15px; font-weight:600; color:#0f172a; margin:4px 0;">${report.title || 'Untitled'}</p>
        </div>

        <div class="section">
          <div class="section-title">AI Summary & Assessment</div>
          <p style="font-size:13px; color:#334155; margin:4px 0;">${report.summary || 'N/A'}</p>
          <p style="font-size:12px; color:#475569; margin-top:6px; background:#f8fafc; padding:8px; border-radius:4px;"><strong>Reasoning:</strong> ${report.reasoning || 'N/A'}</p>
        </div>

        <div class="section">
          <div class="section-title">Extracted Factual Claims</div>
          <ul style="padding-left:18px; margin:4px 0;">
            ${claimsHtml}
          </ul>
        </div>

        <div class="section">
          <div class="section-title">Flagged Suspicious Phrases & Sensationalism</div>
          <div style="margin-top:4px;">${suspiciousHtml}</div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div class="section">
            <div class="section-title" style="color:#059669;">Supporting Evidence (${(report.supporting_evidence || []).length})</div>
            ${supportingHtml}
          </div>
          <div class="section">
            <div class="section-title" style="color:#dc2626;">Contradicting Evidence (${(report.contradicting_evidence || []).length})</div>
            ${contradictingHtml}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Critical Limitations & Caution</div>
          <p style="font-size:12px; color:#64748b; margin:4px 0;">${report.limitations || 'Confidence is model-estimated and not proof of factual truth. Users should verify through official and certified primary sources.'}</p>
        </div>

        <div class="disclaimer">
          <strong>Responsible AI Notice:</strong> TruthGuard AI uses artificial intelligence and multi-source API integration to estimate news credibility. It never makes a definitive truth claim solely on writing style. This report is produced for informational and educational evaluation at HackNova Bhopal 2K26.
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
