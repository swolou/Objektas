import React, { useState } from 'react';
import { formatDate, formatCurrency, statusLabels } from '../utils';
import ConfirmModal from './ConfirmModal';

export default function ObjectDetail({ object, onBack, onEdit, onDelete, onAddMaterial, onDeleteMaterial }) {
  const [confirmTarget, setConfirmTarget] = useState(null);

  const materials = object.materials || [];
  const total = materials.reduce((s, m) => s + (m.price || 0) * (m.quantity || 0), 0);

  const handleDeleteObject = () => {
    setConfirmTarget({ type: 'object' });
  };

  const handleDeleteMaterial = (matId) => {
    setConfirmTarget({ type: 'material', matId });
  };

  const handleConfirm = () => {
    if (confirmTarget.type === 'object') {
      onDelete(object.id);
    } else if (confirmTarget.type === 'material') {
      onDeleteMaterial(object.id, confirmTarget.matId);
    }
    setConfirmTarget(null);
  };

  return (
    <div className="view">
      <div className="toolbar">
        <button className="btn-back" onClick={onBack}>← Atgal</button>
        <div className="toolbar-actions">
          <button className="btn-icon" onClick={() => onEdit(object)} title="Redaguoti">✏️</button>
          <button className="btn-icon btn-danger" onClick={handleDeleteObject} title="Ištrinti">🗑️</button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-row">
          <span className="detail-label">Pavadinimas</span>
          <span className="detail-value">{object.name}</span>
        </div>
        {object.address && (
          <div className="detail-row">
            <span className="detail-label">Adresas</span>
            <span className="detail-value">{object.address}</span>
          </div>
        )}
        {object.client && (
          <div className="detail-row">
            <span className="detail-label">Klientas</span>
            <span className="detail-value">{object.client}</span>
          </div>
        )}
        {object.phone && (
          <div className="detail-row">
            <span className="detail-label">Telefonas</span>
            <span className="detail-value">
              <a href={`tel:${object.phone}`} style={{ color: 'var(--primary)' }}>{object.phone}</a>
            </span>
          </div>
        )}
        <div className="detail-row">
          <span className="detail-label">Statusas</span>
          <span className="detail-value">
            <span className={`badge badge-${object.status}`}>{statusLabels[object.status]}</span>
          </span>
        </div>
        {object.notes && (
          <div className="detail-row">
            <span className="detail-label">Pastabos</span>
            <span className="detail-value">{object.notes}</span>
          </div>
        )}
        <div className="detail-row">
          <span className="detail-label">Sukurta</span>
          <span className="detail-value">{formatDate(object.createdAt)}</span>
        </div>
      </div>

      <div className="section-header">
        <h3>Medžiagos</h3>
        <button className="btn-small" onClick={() => onAddMaterial(object.id)}>+ Pridėti</button>
      </div>

      {materials.length === 0 ? (
        <div className="empty-state small">
          <p>Nėra medžiagų</p>
        </div>
      ) : (
        <>
          <div className="list">
            {materials.map((m) => (
              <div className="material-card" key={m.id}>
                <div className="material-info">
                  <div className="material-name">{m.name}</div>
                  <div className="material-details">{m.quantity} {m.unit}</div>
                </div>
                {m.price > 0 && (
                  <span className="material-price">{formatCurrency(m.price * m.quantity)}</span>
                )}
                <button className="material-delete" onClick={() => handleDeleteMaterial(m.id)} title="Pašalinti">✕</button>
              </div>
            ))}
          </div>
          {total > 0 && (
            <div className="materials-total">Viso: {formatCurrency(total)}</div>
          )}
        </>
      )}

      {confirmTarget && (
        <ConfirmModal
          message={confirmTarget.type === 'object' ? 'Ar tikrai norite ištrinti šį objektą?' : 'Pašalinti šią medžiagą?'}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}
