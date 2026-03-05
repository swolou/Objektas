import React, { useState } from 'react';

export default function MaterialForm({ onSave, onBack }) {
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    unit: 'vnt',
    price: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      name: form.name.trim(),
      quantity: parseFloat(form.quantity) || 0,
      unit: form.unit,
      price: parseFloat(form.price) || 0,
    });
  };

  return (
    <div className="view">
      <div className="toolbar">
        <button className="btn-back" onClick={onBack}>← Atgal</button>
        <h2>Nauja medžiaga</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mat-name">Pavadinimas *</label>
          <input id="mat-name" name="name" value={form.name} onChange={handleChange}
            placeholder="pvz. Kabelis YDY 3x2.5..." required />
        </div>
        <div className="form-group">
          <label htmlFor="mat-quantity">Kiekis *</label>
          <input id="mat-quantity" name="quantity" type="number" step="0.01" min="0"
            value={form.quantity} onChange={handleChange} placeholder="0" required />
        </div>
        <div className="form-group">
          <label htmlFor="mat-unit">Matavimo vienetas</label>
          <select id="mat-unit" name="unit" value={form.unit} onChange={handleChange}>
            <option value="vnt">vnt.</option>
            <option value="m">m</option>
            <option value="kg">kg</option>
            <option value="kompl">kompl.</option>
            <option value="rit">rit.</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="mat-price">Kaina (€)</label>
          <input id="mat-price" name="price" type="number" step="0.01" min="0"
            value={form.price} onChange={handleChange} placeholder="0.00" />
        </div>
        <button type="submit" className="btn-primary btn-full">Išsaugoti medžiagą</button>
      </form>
    </div>
  );
}
