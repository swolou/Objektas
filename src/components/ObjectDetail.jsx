import React, { useState } from 'react';
import { formatDate, formatCurrency, statusLabels } from '../utils';
import { generateInvoice, loadSellerInfo, openInvoicePdf } from '../invoiceGenerator';
import ConfirmModal from './ConfirmModal';

export default function ObjectDetail({ object, onBack, onEdit, onDelete, onAddMaterial, onEditMaterial, onDeleteMaterial, onSaveInvoice, onDeleteInvoice }) {
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [showInvoicePrompt, setShowInvoicePrompt] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');

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
    } else if (confirmTarget.type === 'invoice') {
      onDeleteInvoice(object.id, confirmTarget.invoiceId);
    }
    setConfirmTarget(null);
  };

  const handleExportInvoice = () => {
    setInvoiceNumber('');
    setShowInvoicePrompt(true);
  };

  const handleConfirmInvoice = () => {
    const seller = loadSellerInfo();
    const invoiceRecord = generateInvoice(object, seller, invoiceNumber.trim());
    onSaveInvoice(object.id, invoiceRecord);
    setShowInvoicePrompt(false);
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

      {(object.client || object.clientCompany) && (
        <>
          <div className="section-header">
            <h3>Užsakovas</h3>
          </div>
          <div className="detail-content">
            {object.clientCompany && (
              <div className="detail-row">
                <span className="detail-label">Įmonė</span>
                <span className="detail-value">{object.clientCompany}</span>
              </div>
            )}
            {object.client && (
              <div className="detail-row">
                <span className="detail-label">Kontaktas</span>
                <span className="detail-value">{object.client}</span>
              </div>
            )}
            {object.clientCode && (
              <div className="detail-row">
                <span className="detail-label">Įmonės kodas</span>
                <span className="detail-value">{object.clientCode}</span>
              </div>
            )}
            {object.clientPvm && (
              <div className="detail-row">
                <span className="detail-label">PVM kodas</span>
                <span className="detail-value">{object.clientPvm}</span>
              </div>
            )}
            {object.clientAddress && (
              <div className="detail-row">
                <span className="detail-label">Adresas</span>
                <span className="detail-value">{object.clientAddress}</span>
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
          </div>
        </>
      )}

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
                <div className="material-info" onClick={() => onEditMaterial(object.id, m)} style={{ cursor: 'pointer' }}>
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

      {materials.length > 0 && (
        <button className="btn-invoice" onClick={handleExportInvoice}>
          📄 Eksportuoti sąskaitą (PDF)
        </button>
      )}

      {(object.invoices || []).length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: 20 }}>
            <h3>Sąskaitos</h3>
          </div>
          <div className="list">
            {object.invoices.map((inv) => (
              <div className="invoice-card" key={inv.id}>
                <div className="invoice-icon" onClick={() => openInvoicePdf(inv)} title="Atsisiųsti PDF">
                  <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
                    <path d="M2 0C0.9 0 0 0.9 0 2V30C0 31.1 0.9 32 2 32H26C27.1 32 28 31.1 28 30V8L20 0H2Z" fill="#E53935"/>
                    <path d="M21 7V0L28 7H21Z" fill="#FFCDD2"/>
                    <text x="14" y="22" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">PDF</text>
                  </svg>
                </div>
                <div className="invoice-info" onClick={() => openInvoicePdf(inv)}>
                  <div className="invoice-number">{inv.number}</div>
                  <div className="invoice-date">{inv.date}</div>
                </div>
                <button
                  className="material-delete"
                  onClick={() => {
                    setConfirmTarget({ type: 'invoice', invoiceId: inv.id });
                  }}
                  title="Pašalinti"
                >✕</button>
              </div>
            ))}
          </div>
        </>
      )}

      {showInvoicePrompt && (
        <div className="modal-overlay" onClick={() => setShowInvoicePrompt(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p style={{ fontWeight: 600 }}>Sąskaitos numeris</p>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="pvz. SF-2026-001"
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowInvoicePrompt(false)}>Atšaukti</button>
              <button className="btn-primary" onClick={handleConfirmInvoice}>Eksportuoti</button>
            </div>
          </div>
        </div>
      )}

      {confirmTarget && (
        <ConfirmModal
          message={confirmTarget.type === 'object' ? 'Ar tikrai norite ištrinti šį objektą?' : confirmTarget.type === 'invoice' ? 'Pašalinti šią sąskaitą?' : 'Pašalinti šią medžiagą?'}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}
