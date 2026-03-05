import React from 'react';
import { formatDate, formatCurrency, statusLabels } from '../utils';

const statusOrder = ['naujas', 'vykdomas', 'uzbaigtas'];

export default function ObjectsList({ objects, onAdd, onSelect, onChangeStatus }) {
  const sorted = [...objects].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="view">
      <div className="toolbar">
        <h2>Mano objektai</h2>
        <button className="btn-primary" onClick={onAdd}>+ Naujas objektas</button>
      </div>

      {objects.length === 0 ? (
        <div className="empty-state">
          <p>Dar nėra objektų</p>
          <p className="hint">Paspauskite „+ Naujas objektas" norėdami pradėti</p>
        </div>
      ) : (
        <div className="list">
          {sorted.map((obj) => {
            const matCount = (obj.materials || []).length;
            const total = (obj.materials || []).reduce(
              (s, m) => s + (m.price || 0) * (m.quantity || 0), 0
            );
            return (
              <div className="card" key={obj.id} onClick={() => onSelect(obj.id)}>
                <div className="card-header">
                  <span className="card-name">{obj.name}</span>
                  <button
                    className={`badge badge-${obj.status} badge-clickable`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextIndex = (statusOrder.indexOf(obj.status) + 1) % statusOrder.length;
                      onChangeStatus(obj.id, statusOrder[nextIndex]);
                    }}
                  >
                    {statusLabels[obj.status]}
                  </button>
                </div>
                {obj.address && (
                  <div className="card-info"><span>📍 {obj.address}</span></div>
                )}
                <div className="card-info">
                  <span>📅 {formatDate(obj.createdAt)}</span>
                  {matCount > 0 && <span>📦 {matCount} medž.</span>}
                  {total > 0 && <span>💰 {formatCurrency(total)}</span>}
                  {(obj.invoices || []).length > 0 && (
                    <span className="card-pdf-badge">
                      <svg width="14" height="16" viewBox="0 0 28 32" fill="none" style={{ verticalAlign: 'middle', marginRight: 3 }}>
                        <path d="M2 0C0.9 0 0 0.9 0 2V30C0 31.1 0.9 32 2 32H26C27.1 32 28 31.1 28 30V8L20 0H2Z" fill="#E53935"/>
                        <path d="M21 7V0L28 7H21Z" fill="#FFCDD2"/>
                        <text x="14" y="22" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">PDF</text>
                      </svg>
                      {obj.invoices.length} sąsk.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
