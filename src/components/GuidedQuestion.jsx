import { useState } from 'react';

const S = {
  wrap: {
    border: '1.5px solid var(--gold)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  finalBlock: {
    background: 'var(--white)',
    borderTop: '1px solid var(--gold)',
    padding: '16px 20px',
  },
  draftBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '8px', gap: '10px',
  },
  draftBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'var(--navy)', color: 'var(--white)',
    border: 'none', borderRadius: 'var(--radius)',
    padding: '6px 14px', fontSize: '12px', fontWeight: 700,
    cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
  },
  draftWarning: {
    background: '#FFF3CD', border: '1px solid #FFC107',
    borderRadius: 'var(--radius)', padding: '7px 11px',
    fontSize: '11.5px', color: '#856404', lineHeight: 1.4,
    marginBottom: '8px',
  },
  finalLabel: {
    fontWeight: 700, fontSize: '13.5px', color: 'var(--navy)',
    marginBottom: '5px', display: 'block',
  },
  finalSub: { fontSize: '12.5px', color: 'var(--gray-500)', marginBottom: '8px', lineHeight: 1.5 },
  finalInput: {
    width: '100%', padding: '10px 12px',
    border: '1.5px solid var(--gray-300)',
    borderRadius: 'var(--radius)',
    fontSize: '13.5px', fontFamily: 'inherit', lineHeight: 1.6,
    resize: 'vertical', outline: 'none', background: 'var(--white)',
  },
  toggle: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#FFFDF5',
    padding: '10px 20px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  toggleLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  badge: {
    display: 'inline-flex', alignItems: 'center',
    background: 'var(--gold)', color: 'var(--navy)',
    fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
    padding: '2px 9px', borderRadius: '20px',
  },
  toggleText: { fontSize: '13px', fontWeight: 600, color: 'var(--gold-dark)' },
  toggleHint: { fontSize: '11.5px', color: 'var(--gray-400)' },
  toggleChevron: (open) => ({
    fontSize: '12px', color: 'var(--gold-dark)',
    transition: 'transform 0.2s',
    transform: open ? 'rotate(180deg)' : 'none',
  }),
  coachPanel: {
    background: '#FFFDF5',
    borderTop: '1px solid rgba(245,168,0,0.3)',
    padding: '16px 20px 4px',
  },
  qBlock: { marginBottom: '14px' },
  qRow: { display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '5px' },
  qNum: {
    width: '22px', height: '22px', borderRadius: '50%',
    background: 'var(--navy)', color: 'var(--white)',
    fontSize: '11px', fontWeight: 700, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px',
  },
  qText: { fontSize: '13.5px', fontWeight: 600, color: 'var(--gray-800)', lineHeight: 1.5 },
  qHint: {
    fontSize: '11.5px', color: 'var(--gray-500)', lineHeight: 1.5,
    marginBottom: '6px', paddingLeft: '32px', fontStyle: 'italic',
  },
  qInput: {
    width: 'calc(100% - 32px)', marginLeft: '32px',
    padding: '8px 11px',
    border: '1.5px solid var(--gray-300)',
    borderRadius: 'var(--radius)',
    fontSize: '13px', fontFamily: 'inherit', lineHeight: 1.6,
    resize: 'vertical', outline: 'none', background: 'var(--white)',
    display: 'block',
  },
};

export default function GuidedQuestion({
  title, subtitle, questions,
  answers, onAnswerChange,
  finalLabel, finalValue, onFinalChange,
  finalPlaceholder, finalRows = 4, finalSublabel,
  required,
  aiAssist, onGenerateDraft,
}) {
  const [open, setOpen] = useState(false);
  const isDraft = finalValue && finalValue.startsWith('⚠ DRAFT ONLY');

  return (
    <div style={S.wrap}>
      {/* Collapsible coaching toggle — always on top */}
      {questions && questions.length > 0 && (
        <>
          <div style={S.toggle} onClick={() => setOpen(o => !o)}>
            <div style={S.toggleLeft}>
              <span style={S.badge}>Coach</span>
              <span style={S.toggleText}>{title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {!open && <span style={S.toggleHint}>Click to think through this →</span>}
              <span style={S.toggleChevron(open)}>▼</span>
            </div>
          </div>

          {open && (
            <div style={S.coachPanel}>
              {subtitle && (
                <div style={{ fontSize: '12.5px', color: 'var(--gray-600)', marginBottom: '12px', lineHeight: 1.5 }}>
                  {subtitle}
                </div>
              )}

              {questions.map((q, i) => (
                <div key={q.id} style={S.qBlock}>
                  <div style={S.qRow}>
                    <div style={S.qNum}>{i + 1}</div>
                    <div style={S.qText}>{q.text}</div>
                  </div>
                  {q.hint && <div style={S.qHint}>{q.hint}</div>}
                  <textarea
                    style={S.qInput}
                    rows={q.rows || 2}
                    value={answers[q.id] || ''}
                    onChange={e => onAnswerChange(q.id, e.target.value)}
                    placeholder={q.placeholder || 'Your thoughts…'}
                  />
                </div>
              ))}

              {/* When finalLabel exists but no onFinalChange, show the "fill in below" prompt */}
              {finalLabel && !onFinalChange && (
                <div style={{ fontSize: '12px', color: 'var(--gold-dark)', fontWeight: 600, paddingBottom: '12px' }}>
                  ↓ Use your answers above to fill in the section below
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Answer field — always visible, below coaching */}
      {(finalLabel && onFinalChange) && (
        <div style={S.finalBlock}>
          <div style={S.draftBar}>
            <label style={S.finalLabel}>
              {finalLabel}{required && <span style={{ color: 'var(--red)', marginLeft: 2 }}>*</span>}
            </label>
            {aiAssist && onGenerateDraft && (
              <button style={S.draftBtn} onClick={() => onGenerateDraft()}>
                ✦ Generate draft from my answers
              </button>
            )}
          </div>
          {isDraft && (
            <div style={S.draftWarning}>
              ⚠ <strong>DRAFT ONLY — PLEASE REVIEW AND EDIT BEFORE SUBMITTING.</strong> This was assembled from your coaching answers. It may be incomplete or need significant revision.
            </div>
          )}
          {finalSublabel && <div style={S.finalSub}>{finalSublabel}</div>}
          <textarea
            style={{ ...S.finalInput, borderColor: isDraft ? '#FFC107' : undefined }}
            rows={finalRows}
            value={finalValue}
            onChange={e => onFinalChange(e.target.value)}
            placeholder={finalPlaceholder}
          />
        </div>
      )}
    </div>
  );
}
