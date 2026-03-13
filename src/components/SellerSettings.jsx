import React, { useState, useEffect } from 'react';
import { loadSellerInfo, saveSellerInfo } from '../invoiceGenerator';

export default function SellerSettings({ onBack }) {
  const [form, setForm] = useState({
    company: '',
    code: '',
    pvmCode: '',
    address: '',
    phone: '',
    email: '',
    bank: '',
    account: '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellerInfo().then(info => {
      setForm({
        company: info.company || '',
        code: info.code || '',
        pvmCode: info.pvmCode || '',
        address: info.address || '',
        phone: info.phone || '',
        email: info.email || '',
        bank: info.bank || '',
        account: info.account || '',
      });
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveSellerInfo(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="view"><p>Kraunama...</p></div>;

  return (
    <div className="view">
      <div className="toolbar">
        <button className="btn-back" onClick={onBack}>← Atgal</button>
        <h2>Mano duomenys</h2>
      </div>
      <p className="settings-hint">Šie duomenys bus naudojami sąskaitose faktūrose kaip pardavėjo informacija.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="s-company">Įmonė / Vardas Pavardė *</label>
          <input id="s-company" name="company" value={form.company} onChange={handleChange}
            placeholder="Jūsų įmonė arba vardas" />
        </div>
        <div className="form-group">
          <label htmlFor="s-code">Įmonės / Asmens kodas</label>
          <input id="s-code" name="code" value={form.code} onChange={handleChange}
            placeholder="Įmonės kodas" />
        </div>
        <div className="form-group">
          <label htmlFor="s-pvmCode">PVM kodas</label>
          <input id="s-pvmCode" name="pvmCode" value={form.pvmCode} onChange={handleChange}
            placeholder="PVM mokėtojo kodas" />
        </div>
        <div className="form-group">
          <label htmlFor="s-address">Adresas</label>
          <input id="s-address" name="address" value={form.address} onChange={handleChange}
            placeholder="Registracijos adresas" />
        </div>
        <div className="form-group">
          <label htmlFor="s-phone">Telefonas</label>
          <input id="s-phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
            placeholder="Telefono numeris" />
        </div>
        <div className="form-group">
          <label htmlFor="s-email">El. paštas</label>
          <input id="s-email" name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="El. pašto adresas" />
        </div>
        <div className="form-group">
          <label htmlFor="s-bank">Bankas</label>
          <input id="s-bank" name="bank" value={form.bank} onChange={handleChange}
            placeholder="Banko pavadinimas" />
        </div>
        <div className="form-group">
          <label htmlFor="s-account">Atsiskaitomoji sąskaita</label>
          <input id="s-account" name="account" value={form.account} onChange={handleChange}
            placeholder="IBAN numeris" />
        </div>
        <button type="submit" className="btn-primary btn-full">
          {saved ? 'Išsaugota!' : 'Išsaugoti'}
        </button>
      </form>
    </div>
  );
}
