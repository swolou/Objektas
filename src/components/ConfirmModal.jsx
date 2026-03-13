import React, { useState } from 'react';

export default function ConfirmModal({ message, onConfirm, onCancel, requireCode }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (requireCode) {
      if (code === '99') {
        onConfirm();
      } else {
        setError('Neteisingas kodas');
        setCode('');
      }
    } else {
      onConfirm();
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        {requireCode && (
          <div style={{ margin: '12px 0' }}>
            <input
              type="password"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(''); }}
              placeholder="Įveskite kodą"
              style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '8px', border: error ? '2px solid #dc2626' : '1px solid #ccc', textAlign: 'center' }}
              autoFocus
            />
            {error && <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '6px' }}>{error}</p>}
          </div>
        )}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>Atšaukti</button>
          <button className="btn-danger-fill" onClick={handleConfirm}>Ištrinti</button>
        </div>
      </div>
    </div>
  );
}
