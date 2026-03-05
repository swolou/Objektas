import React, { useState, useEffect } from 'react';

export default function MaterialForm({ editingMaterial, onSave, onBack }) {
  const [form, setForm] = useState({
    name: '',
    quantity: '',
  });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
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
        <div className="form-group">
          <label htmlFor="mat-name">Pavadinimas *</label>
          <input id="mat-name" name="name" value={form.name} onChange={handleChange}
            placeholder="pvz. Kabelis YDY 3x2.5..." required />
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
