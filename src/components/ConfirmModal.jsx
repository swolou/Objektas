import React from 'react';

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>Atšaukti</button>
          <button className="btn-danger-fill" onClick={onConfirm}>Ištrinti</button>
        </div>
      </div>
    </div>
  );
}
