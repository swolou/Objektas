import React, { useState, useEffect, useRef } from 'react';

const DB_KEY = 'elektros_medziagu_db';

function loadMaterialsDb() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) || [];
  } catch {
    return [];
  }
}

function saveMaterialToDb(name) {
  const db = loadMaterialsDb();
  const trimmed = name.trim();
  if (!trimmed) return;
  const exists = db.some((n) => n.toLowerCase() === trimmed.toLowerCase());
  if (!exists) {
    db.push(trimmed);
    db.sort((a, b) => a.localeCompare(b, 'lt'));
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }
}

export default function MaterialForm({ editingMaterial, onSave, onBack }) {
  const [form, setForm] = useState({
    name: '',
    quantity: '',
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const wrapperRef = useRef(null);

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
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, name: val });
    setActiveSuggestion(-1);

    if (val.trim().length > 0) {
      const db = loadMaterialsDb();
      const q = val.toLowerCase();
      const filtered = db.filter((n) => n.toLowerCase().includes(q));
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
    saveMaterialToDb(form.name);
    onSave({
      name: form.name.trim(),
      quantity: parseFloat(form.quantity) || 0,
      unit: 'm',
      price: 0,
    });
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
                const db = loadMaterialsDb();
                const q = form.name.toLowerCase();
                const filtered = db.filter((n) => n.toLowerCase().includes(q));
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
            value={form.quantity} onChange={handleChange} placeholder="0" required />
        </div>
        <button type="submit" className="btn-primary btn-full">Išsaugoti medžiagą</button>
      </form>
    </div>
  );
}
