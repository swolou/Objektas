import React, { useState, useEffect, useRef } from 'react';
import {
  apiGetKameros, apiAddKamera, apiDeleteKamera,
  apiGetLaidai, apiAddLaidas, apiDeleteLaidas,
} from '../hooks/useApi';

export default function MaterialForm({ editingMaterial, onSave, onBack }) {
  const [form, setForm] = useState({
    name: '',
    quantity: '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [kameros, setKameros] = useState([]);
  const [laidai, setLaidai] = useState([]);
  const [newKamera, setNewKamera] = useState('');
  const [newLaidas, setNewLaidas] = useState('');
  const wrapperRef = useRef(null);
  const quantityRef = useRef(null);

  useEffect(() => {
    if (editingMaterial) {
      setForm({
        name: editingMaterial.name || '',
        quantity: editingMaterial.quantity !== undefined ? String(editingMaterial.quantity) : '',
      });
    } else {
      setForm({ name: '', quantity: '' });
    }
  }, [editingMaterial]);

  useEffect(() => {
    loadDbData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadDbData = async () => {
    try {
      const [k, l] = await Promise.all([apiGetKameros(), apiGetLaidai()]);
      setKameros(k);
      setLaidai(l);
    } catch (err) {
      console.error(err);
    }
  };

  const getAllNames = () => {
    const names = [];
    kameros.forEach((k) => names.push(k.kameros));
    laidai.forEach((l) => names.push(l.laidai));
    return names;
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, name: val });
    setActiveSuggestion(-1);

    if (val.trim().length > 0) {
      const q = val.toLowerCase();
      const filtered = getAllNames().filter((n) => n.toLowerCase().includes(q));
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (name) => {
    setForm({ ...form, name });
    setShowSuggestions(false);
    setSuggestions([]);
    setTimeout(() => quantityRef.current?.focus(), 50);
  };

  const handleQuickSelect = (name) => {
    setForm({ ...form, name });
    setShowSuggestions(false);
    setSuggestions([]);
    setTimeout(() => quantityRef.current?.focus(), 50);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeSuggestion]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      name: form.name.trim(),
      quantity: parseFloat(form.quantity) || 0,
    });
  };

  const handleAddKamera = async () => {
    if (!newKamera.trim()) return;
    await apiAddKamera(newKamera.trim());
    setNewKamera('');
    await loadDbData();
  };

  const handleDeleteKamera = async (id) => {
    await apiDeleteKamera(id);
    await loadDbData();
  };

  const handleAddLaidas = async () => {
    if (!newLaidas.trim()) return;
    await apiAddLaidas(newLaidas.trim());
    setNewLaidas('');
    await loadDbData();
  };

  const handleDeleteLaidas = async (id) => {
    await apiDeleteLaidas(id);
    await loadDbData();
  };

  return (
    <div className="view">
      <div className="toolbar">
        <button className="btn-back" onClick={onBack}>← Atgal</button>
        <h2>{editingMaterial ? 'Redaguoti medžiagą' : 'Nauja medžiaga'}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group" ref={wrapperRef} style={{ position: 'relative' }}>
          <label htmlFor="mat-name">Pavadinimas *</label>
          <input id="mat-name" name="name" value={form.name} onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (form.name.trim().length > 0) {
                const q = form.name.toLowerCase();
                const filtered = getAllNames().filter((n) => n.toLowerCase().includes(q));
                if (filtered.length > 0) {
                  setSuggestions(filtered);
                  setShowSuggestions(true);
                }
              }
            }}
            placeholder="pvz. Kabelis YDY 3x2.5..."
            autoComplete="off"
            required />
          {showSuggestions && suggestions.length > 0 && (
            <div className="autocomplete-dropdown">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className={`autocomplete-item${i === activeSuggestion ? ' active' : ''}`}
                  onMouseDown={() => handleSelectSuggestion(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="mat-quantity">Kiekis (m) *</label>
          <input id="mat-quantity" name="quantity" type="number" step="0.01" min="0"
            ref={quantityRef} value={form.quantity} onChange={handleChange} placeholder="0" required />
        </div>
        <button type="submit" className="btn-primary btn-full">Išsaugoti medžiagą</button>
      </form>

      <div className="db-section">
        <div className="section-header">
          <h3>Kameros</h3>
        </div>
        <div className="db-add-row">
          <input
            type="text"
            value={newKamera}
            onChange={(e) => setNewKamera(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddKamera(); } }}
            placeholder="Naujos kameros pavadinimas..."
          />
          <button type="button" className="btn-small" onClick={handleAddKamera}>+</button>
        </div>
        {kameros.length === 0 ? (
          <div className="db-empty">Nėra kamerų</div>
        ) : (
          <div className="db-list">
            {kameros.map((item) => (
              <div className="db-item" key={item.id}>
                <span className="db-item-name" onClick={() => handleQuickSelect(item.kameros)}>{item.kameros}</span>
                <button className="material-delete" onClick={() => handleDeleteKamera(item.id)} title="Pašalinti">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="db-section">
        <div className="section-header">
          <h3>Laidai</h3>
        </div>
        <div className="db-add-row">
          <input
            type="text"
            value={newLaidas}
            onChange={(e) => setNewLaidas(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLaidas(); } }}
            placeholder="Naujo laido pavadinimas..."
          />
          <button type="button" className="btn-small" onClick={handleAddLaidas}>+</button>
        </div>
        {laidai.length === 0 ? (
          <div className="db-empty">Nėra laidų</div>
        ) : (
          <div className="db-list">
            {laidai.map((item) => (
              <div className="db-item" key={item.id}>
                <span className="db-item-name" onClick={() => handleQuickSelect(item.laidai)}>{item.laidai}</span>
                <button className="material-delete" onClick={() => handleDeleteLaidas(item.id)} title="Pašalinti">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
