import React, { useState, useEffect } from 'react';

export default function ObjectForm({ editingObject, onSave, onBack }) {
  const [form, setForm] = useState({
    name: '',
    address: '',
    client: '',
    phone: '',
    status: 'naujas',
    notes: '',
  });

  useEffect(() => {
    if (editingObject) {
      setForm({
        name: editingObject.name || '',
        address: editingObject.address || '',
        client: editingObject.client || '',
        phone: editingObject.phone || '',
        status: editingObject.status || 'naujas',
        notes: editingObject.notes || '',
      });
    } else {
      setForm({ name: '', address: '', client: '', phone: '', status: 'naujas', notes: '' });
    }
  }, [editingObject]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      name: form.name.trim(),
      address: form.address.trim(),
      client: form.client.trim(),
      phone: form.phone.trim(),
      status: form.status,
      notes: form.notes.trim(),
    });
  };

  return (
    <div className="view">
      <div className="toolbar">
        <button className="btn-back" onClick={onBack}>← Atgal</button>
        <h2>{editingObject ? 'Redaguoti objektą' : 'Naujas objektas'}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Pavadinimas *</label>
          <input id="name" name="name" value={form.name} onChange={handleChange}
            placeholder="pvz. Namo elektra, Biuro remontas..." required />
        </div>
        <div className="form-group">
          <label htmlFor="address">Adresas</label>
          <input id="address" name="address" value={form.address} onChange={handleChange}
            placeholder="Adresas arba vieta" />
        </div>
        <div className="form-group">
          <label htmlFor="client">Klientas</label>
          <input id="client" name="client" value={form.client} onChange={handleChange}
            placeholder="Kliento vardas / įmonė" />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Telefonas</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
            placeholder="Telefono numeris" />
        </div>
        <div className="form-group">
          <label htmlFor="status">Statusas</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            <option value="naujas">Naujas</option>
            <option value="vykdomas">Vykdomas</option>
            <option value="uzbaigtas">Užbaigtas</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="notes">Pastabos</label>
          <textarea id="notes" name="notes" rows="3" value={form.notes} onChange={handleChange}
            placeholder="Papildoma informacija..." />
        </div>
        <button type="submit" className="btn-primary btn-full">Išsaugoti</button>
      </form>
    </div>
  );
}
