import React, { useState } from 'react';
import { formatDate, statusLabels } from '../utils';
import { generateMaterialsSummaryPdf } from '../invoiceGenerator';
import ConfirmModal from './ConfirmModal';

export default function ObjectDetail({
  object, onBack, onEdit, onDelete,
  onAddDay, onDeleteDay,
  onAddMaterial, onEditMaterial, onDeleteMaterial,
  onSaveRezultatas, onDeleteRezultatas
}) {
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [collapsedDays, setCollapsedDays] = useState({});
  const days = (object.days || []).sort((a, b) => b.date.localeCompare(a.date));
  const allMaterials = days.flatMap((d) => d.materials || []);
  const hasAnyMaterials = allMaterials.length > 0;

  const aggregatedMaterials = () => {
    const map = {};
    allMaterials.forEach((m) => {
      const key = m.name.trim().toLowerCase();
      if (map[key]) {
        map[key].quantity += m.quantity || 0;
      } else {
        map[key] = { name: m.name.trim(), quantity: m.quantity || 0, unit: m.unit || 'm' };
      }
    });
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  };

  const toggleDay = (dayId) => {
    setCollapsedDays((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const handleDeleteObject = () => {
    setConfirmTarget({ type: 'object' });
  };

  const handleConfirm = () => {
    if (confirmTarget.type === 'object') {
      onDelete(object.id);
    } else if (confirmTarget.type === 'material') {
      onDeleteMaterial(object.id, confirmTarget.dayId, confirmTarget.matId);
    } else if (confirmTarget.type === 'day') {
      onDeleteDay(object.id, confirmTarget.dayId);
    } else if (confirmTarget.type === 'rezultatas') {
      if (onDeleteRezultatas) onDeleteRezultatas(confirmTarget.rezId);
    }
    setConfirmTarget(null);
  };

  const handleAddDay = () => {
    const today = new Date().toISOString().split('T')[0];
    setNewDate(today);
    setShowDatePicker(true);
  };

  const handleConfirmAddDay = () => {
    if (newDate) {
      onAddDay(object.id, newDate);
    }
    setShowDatePicker(false);
  };

  const getConfirmMessage = () => {
    if (!confirmTarget) return '';
    if (confirmTarget.type === 'object') return 'Ar tikrai norite ištrinti šį objektą?';
    if (confirmTarget.type === 'day') return 'Pašalinti šią dieną su visomis medžiagomis?';
    if (confirmTarget.type === 'rezultatas') return 'Pašalinti šį rezultatą?';
    return 'Pašalinti šią medžiagą?';
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
            {object.clientEmail && (
              <div className="detail-row">
                <span className="detail-label">El. paštas</span>
                <span className="detail-value">
                  <a href={`mailto:${object.clientEmail}`} style={{ color: 'var(--primary)' }}>{object.clientEmail}</a>
                </span>
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
        <h3>Dienos</h3>
        <button className="btn-small" onClick={handleAddDay}>+ Pridėti dieną</button>
      </div>

      {days.length === 0 ? (
        <div className="empty-state small">
          <p>Nėra dienų</p>
          <p className="hint">Pridėkite dieną, kad galėtumėte registruoti medžiagas</p>
        </div>
      ) : (
        <div className="days-list">
          {days.map((day) => {
            const dayMaterials = day.materials || [];
            const isCollapsed = collapsedDays[day.id];
            return (
              <div className="day-card" key={day.id}>
                <div className="day-header" onClick={() => toggleDay(day.id)}>
                  <div className="day-title">
                    <span className="day-arrow">{isCollapsed ? '▶' : '▼'}</span>
                    <span className="day-date">📅 {day.date}</span>
                    <span className="day-count">{dayMaterials.length} medž.</span>
                  </div>
                  <div className="day-actions">
                    <button
                      className="btn-small"
                      onClick={(e) => { e.stopPropagation(); onAddMaterial(day.id); }}
                    >+</button>
                    <button
                      className="material-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmTarget({ type: 'day', dayId: day.id });
                      }}
                      title="Pašalinti dieną"
                    >✕</button>
                  </div>
                </div>
                {!isCollapsed && (
                  <div className="day-materials">
                    {dayMaterials.length === 0 ? (
                      <div className="day-empty">Nėra medžiagų</div>
                    ) : (
                      dayMaterials.map((m) => (
                        <div className="material-card-compact" key={m.id}>
                          <div className="material-info" onClick={() => onEditMaterial(day.id, m)} style={{ cursor: 'pointer' }}>
                            <span className="material-name">{m.name}</span>
                            <span className="material-qty">{m.quantity} {m.unit || 'm'}</span>
                          </div>
                          <button
                            className="material-delete"
                            onClick={() => setConfirmTarget({ type: 'material', dayId: day.id, matId: m.id })}
                            title="Pašalinti"
                          >✕</button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {hasAnyMaterials && (
        <>
          <button className="btn-summary" onClick={() => {
            const agg = aggregatedMaterials();
            const totalQty = agg.reduce((s, m) => s + m.quantity, 0);
            generateMaterialsSummaryPdf(object, agg);
            if (onSaveRezultatas) {
              onSaveRezultatas(object.id, {
                data: new Date().toISOString().split('T')[0],
                suma: totalQty,
              });
            }
          }}>
            📋 Formuoti bendrą medžiagų kiekį
          </button>
        </>
      )}

      {(object.rezultatai || []).length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: 20 }}>
            <h3>Rezultatai</h3>
          </div>
          <div className="list">
            {object.rezultatai.map((rez) => (
              <div className="db-item" key={rez.id} style={{ marginBottom: 4 }}>
                <span>📊 {rez.data ? rez.data.split('T')[0] : ''} — {parseFloat(rez.suma)} m</span>
                <button
                  className="material-delete"
                  onClick={() => setConfirmTarget({ type: 'rezultatas', rezId: rez.id })}
                  title="Pašalinti"
                >✕</button>
              </div>
            ))}
          </div>
        </>
      )}

      {showDatePicker && (
        <div className="modal-overlay" onClick={() => setShowDatePicker(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p style={{ fontWeight: 600 }}>Pasirinkite datą</p>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDatePicker(false)}>Atšaukti</button>
              <button className="btn-primary" onClick={handleConfirmAddDay}>Pridėti</button>
            </div>
          </div>
        </div>
      )}

      {confirmTarget && (
        <ConfirmModal
          message={getConfirmMessage()}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmTarget(null)}
          requireCode={confirmTarget.type === 'object'}
        />
      )}
    </div>
  );
}
