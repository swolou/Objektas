import React, { useState, useEffect } from 'react';

export default function ObjectForm({ editingObject, onSave, onBack }) {
  const [form, setForm] = useState({
    name: '',
    address: '',
    client: '',
    clientCompany: '',
    clientCode: '',
    clientPvm: '',
    clientAddress: '',
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
        clientCompany: editingObject.clientCompany || '',
        clientCode: editingObject.clientCode || '',
        clientPvm: editingObject.clientPvm || '',
        clientAddress: editingObject.clientAddress || '',
        phone: editingObject.phone || '',
        status: editingObject.status || 'naujas',
        notes: editingObject.notes || '',
      });
    } else {
      setForm({
        name: '', address: '', client: '', clientCompany: '', clientCode: '',
        clientPvm: '', clientAddress: '', phone: '', status: 'naujas', notes: '',
      });
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
      clientCompany: form.clientCompany.trim(),
      clientCode: form.clientCode.trim(),
      clientPvm: form.clientPvm.trim(),
      clientAddress: form.clientAddress.trim(),
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
          <label htmlFor="address">Objekto adresas</label>
          <input id="address" name="address" value={form.address} onChange={handleChange}
            placeholder="Adresas arba vieta" />
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

        <h3 className="form-section-title">Užsakovas</h3>
        <div className="form-group">
          <label htmlFor="client">Kontaktinis asmuo</label>
          <input id="client" name="client" value={form.client} onChange={handleChange}
            placeholder="Vardas Pavardė" />
        </div>
        <div className="form-group">
          <label htmlFor="clientCompany">Įmonė / Asmuo</label>
          <input id="clientCompany" name="clientCompany" value={form.clientCompany} onChange={handleChange}
            placeholder="Įmonės pavadinimas arba fizinis asmuo" />
        </div>
        <div className="form-group">
          <label htmlFor="clientCode">Įmonės kodas</label>
          <input id="clientCode" name="clientCode" value={form.clientCode} onChange={handleChange}
            placeholder="Įmonės kodas" />
        </div>
        <div className="form-group">
          <label htmlFor="clientPvm">PVM kodas</label>
          <input id="clientPvm" name="clientPvm" value={form.clientPvm} onChange={handleChange}
            placeholder="PVM mokėtojo kodas" />
        </div>
        <div className="form-group">
          <label htmlFor="clientAddress">Užsakovo adresas</label>
          <input id="clientAddress" name="clientAddress" value={form.clientAddress} onChange={handleChange}
            placeholder="Užsakovo adresas" />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Telefonas</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
            placeholder="Telefono numeris" />
        </div>

        <button type="submit" className="btn-primary btn-full">Išsaugoti</button>
      </form>
    </div>
  );
}
