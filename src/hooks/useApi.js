import { useState, useEffect, useCallback } from 'react';

export function useApi() {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchObjects = useCallback(async () => {
    try {
      const res = await fetch('/api/objektai');
      const data = await res.json();
      const mapped = data.map(mapObjectFromDb);
      setObjects(mapped);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObjects();
  }, [fetchObjects]);

  return [objects, fetchObjects, loading];
}

function mapObjectFromDb(obj) {
  return {
    id: obj.id,
    name: obj.name || '',
    address: obj.address || '',
    status: obj.status || 'naujas',
    notes: obj.notes || '',
    client: obj.client || '',
    clientCompany: obj.client_company || '',
    clientCode: obj.client_code || '',
    clientPvm: obj.client_pvm || '',
    clientAddress: obj.client_address || '',
    clientEmail: obj.client_email || '',
    phone: obj.phone || '',
    createdAt: obj.created_at ? new Date(obj.created_at).getTime() : Date.now(),
    days: (obj.days || []).map((d) => ({
      id: d.id,
      date: d.date ? d.date.split('T')[0] : d.date,
      materials: (d.materials || []).map((m) => ({
        id: m.id,
        name: m.name || '',
        quantity: parseFloat(m.quantity) || 0,
        unit: m.unit || 'm',
        price: 0,
      })),
    })),
    rezultatai: obj.rezultatai || [],
    invoices: JSON.parse(localStorage.getItem(`invoices_${obj.id}`) || '[]'),
  };
}

export async function apiCreateObject(data) {
  const res = await fetch('/api/objektai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiUpdateObject(id, data) {
  const res = await fetch(`/api/objektai/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiDeleteObject(id) {
  await fetch(`/api/objektai/${id}`, { method: 'DELETE' });
  localStorage.removeItem(`invoices_${id}`);
}

export async function apiChangeStatus(id, status) {
  const res = await fetch(`/api/objektai/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function apiAddDay(objId, date) {
  const res = await fetch(`/api/objektai/${objId}/dienos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date }),
  });
  return res.json();
}

export async function apiDeleteDay(dayId) {
  await fetch(`/api/dienos/${dayId}`, { method: 'DELETE' });
}

export async function apiAddMaterial(dayId, data) {
  const res = await fetch(`/api/dienos/${dayId}/medziagos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiUpdateMaterial(matId, data) {
  const res = await fetch(`/api/medziagos/${matId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiDeleteMaterial(matId) {
  await fetch(`/api/medziagos/${matId}`, { method: 'DELETE' });
}

export async function apiSaveRezultatas(objId, data) {
  const res = await fetch(`/api/objektai/${objId}/rezultatai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiDeleteRezultatas(rezId) {
  await fetch(`/api/rezultatai/${rezId}`, { method: 'DELETE' });
}

export async function apiGetKameros() {
  const res = await fetch('/api/kameros');
  return res.json();
}

export async function apiAddKamera(name) {
  const res = await fetch('/api/kameros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function apiUpdateKamera(id, name) {
  const res = await fetch(`/api/kameros/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function apiDeleteKamera(id) {
  await fetch(`/api/kameros/${id}`, { method: 'DELETE' });
}

export async function apiGetLaidai() {
  const res = await fetch('/api/laidai');
  return res.json();
}

export async function apiAddLaidas(name) {
  const res = await fetch('/api/laidai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function apiUpdateLaidas(id, name) {
  const res = await fetch(`/api/laidai/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function apiDeleteLaidas(id) {
  await fetch(`/api/laidai/${id}`, { method: 'DELETE' });
}

export function saveInvoiceLocal(objId, invoiceRecord) {
  const invoices = JSON.parse(localStorage.getItem(`invoices_${objId}`) || '[]');
  invoices.push(invoiceRecord);
  localStorage.setItem(`invoices_${objId}`, JSON.stringify(invoices));
}

export function deleteInvoiceLocal(objId, invoiceId) {
  let invoices = JSON.parse(localStorage.getItem(`invoices_${objId}`) || '[]');
  invoices = invoices.filter((inv) => inv.id !== invoiceId);
  localStorage.setItem(`invoices_${objId}`, JSON.stringify(invoices));
}
