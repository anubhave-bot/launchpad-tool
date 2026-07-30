import CoachingTip from './CoachingTip';

const styles = {
  field: { marginBottom: '24px' },
  label: { display: 'block', fontWeight: 600, marginBottom: '4px', fontSize: '14px', color: 'var(--gray-700)' },
  sublabel: { display: 'block', fontSize: '13px', color: 'var(--gray-500)', marginBottom: '8px', lineHeight: '1.5' },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid var(--gray-300)',
    borderRadius: 'var(--radius)',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: 'var(--gray-900)',
    background: 'var(--white)',
    transition: 'border-color 0.15s',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid var(--gray-300)',
    borderRadius: 'var(--radius)',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: 'var(--gray-900)',
    background: 'var(--white)',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'border-color 0.15s',
    outline: 'none',
    lineHeight: '1.6',
  },
  warning: {
    marginTop: '6px',
    fontSize: '12.5px',
    color: 'var(--red)',
    display: 'flex',
    gap: '5px',
    alignItems: 'flex-start',
  },
  required: { color: 'var(--red)', marginLeft: '2px' },
};

function getFocusStyle(el) {
  if (el) el.style.borderColor = 'var(--gold)';
}
function getBlurStyle(el) {
  if (el) el.style.borderColor = 'var(--gray-300)';
}

export default function Field({
  label, sublabel, value, onChange, type = 'text',
  rows = 4, placeholder = '', required = false,
  tip, tipExample, tipDefaultOpen, warning,
}) {
  const commonProps = {
    value: value || '',
    onChange: e => onChange(e.target.value),
    placeholder,
    onFocus: e => getFocusStyle(e.target),
    onBlur: e => getBlurStyle(e.target),
  };

  return (
    <div style={styles.field}>
      {label && (
        <label style={styles.label}>
          {label}
          {required && <span style={styles.required}>*</span>}
        </label>
      )}
      {sublabel && <span style={styles.sublabel}>{sublabel}</span>}
      {tip && <CoachingTip tip={tip} example={tipExample} defaultOpen={tipDefaultOpen} />}
      {type === 'textarea' ? (
        <textarea style={styles.textarea} rows={rows} {...commonProps} />
      ) : (
        <input type={type} style={styles.input} {...commonProps} />
      )}
      {warning && value && value.length > 10 && (
        <div style={styles.warning}>⚠ {warning}</div>
      )}
    </div>
  );
}
