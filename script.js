const STORAGE_KEY = 'elektros_objektai';

function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveData(objects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(objects));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('lt-LT', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
}

function formatCurrency(val) {
  return Number(val).toFixed(2) + ' €';
}

const statusLabels = {
  naujas: 'Naujas',
  vykdomas: 'Vykdomas',
  uzbaigtas: 'Užbaigtas'
};

let objects = loadData();
let currentObjectId = null;
let editingObjectId = null;
let editingMaterialId = null;

const views = {
  objects: document.getElementById('objects-view'),
  objectForm: document.getElementById('object-form-view'),
  objectDetail: document.getElementById('object-detail-view'),
  materialForm: document.getElementById('material-form-view')
};

function showView(name) {
  Object.values(views).forEach(v => v.classList.remove('active'));
  views[name].classList.add('active');
  window.scrollTo(0, 0);
}

function renderObjectsList() {
  const list = document.getElementById('objects-list');
  const empty = document.getElementById('empty-state');

  if (objects.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  const sorted = [...objects].sort((a, b) => b.createdAt - a.createdAt);

  list.innerHTML = sorted.map(obj => {
    const matCount = (obj.materials || []).length;
    const total = (obj.materials || []).reduce((s, m) => s + (m.price || 0) * (m.quantity || 0), 0);
    return `
      <div class="card" data-id="${obj.id}">
        <div class="card-header">
          <span class="card-name">${escapeHtml(obj.name)}</span>
          <span class="badge badge-${obj.status}">${statusLabels[obj.status]}</span>
        </div>
        ${obj.address ? `<div class="card-info"><span>📍 ${escapeHtml(obj.address)}</span></div>` : ''}
        <div class="card-info">
          <span>📅 ${formatDate(obj.createdAt)}</span>
          ${matCount > 0 ? `<span>📦 ${matCount} medž.</span>` : ''}
          ${total > 0 ? `<span>💰 ${formatCurrency(total)}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderObjectDetail(obj) {
  const detail = document.getElementById('object-detail');
  detail.innerHTML = `
    <div class="detail-row">
      <span class="detail-label">Pavadinimas</span>
      <span class="detail-value">${escapeHtml(obj.name)}</span>
    </div>
    ${obj.address ? `<div class="detail-row"><span class="detail-label">Adresas</span><span class="detail-value">${escapeHtml(obj.address)}</span></div>` : ''}
    ${obj.client ? `<div class="detail-row"><span class="detail-label">Klientas</span><span class="detail-value">${escapeHtml(obj.client)}</span></div>` : ''}
    ${obj.phone ? `<div class="detail-row"><span class="detail-label">Telefonas</span><span class="detail-value"><a href="tel:${escapeHtml(obj.phone)}" style="color:var(--primary)">${escapeHtml(obj.phone)}</a></span></div>` : ''}
    <div class="detail-row">
      <span class="detail-label">Statusas</span>
      <span class="detail-value"><span class="badge badge-${obj.status}">${statusLabels[obj.status]}</span></span>
    </div>
    ${obj.notes ? `<div class="detail-row"><span class="detail-label">Pastabos</span><span class="detail-value">${escapeHtml(obj.notes)}</span></div>` : ''}
    <div class="detail-row">
      <span class="detail-label">Sukurta</span>
      <span class="detail-value">${formatDate(obj.createdAt)}</span>
    </div>
  `;

  renderMaterialsList(obj);
}

function renderMaterialsList(obj) {
  const list = document.getElementById('materials-list');
  const empty = document.getElementById('materials-empty');
  const totalEl = document.getElementById('materials-total');
  const materials = obj.materials || [];

  if (materials.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    totalEl.style.display = 'none';
    return;
  }

  empty.style.display = 'none';

  list.innerHTML = materials.map(m => `
    <div class="material-card">
      <div class="material-info">
        <div class="material-name">${escapeHtml(m.name)}</div>
        <div class="material-details">${m.quantity} ${m.unit}</div>
      </div>
      ${m.price ? `<span class="material-price">${formatCurrency(m.price * m.quantity)}</span>` : ''}
      <button class="material-delete" data-mat-id="${m.id}" title="Pašalinti">✕</button>
    </div>
  `).join('');

  const total = materials.reduce((s, m) => s + (m.price || 0) * (m.quantity || 0), 0);
  if (total > 0) {
    totalEl.style.display = 'block';
    totalEl.textContent = `Viso: ${formatCurrency(total)}`;
  } else {
    totalEl.style.display = 'none';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showConfirm(message) {
  return new Promise(resolve => {
    const modal = document.getElementById('confirm-modal');
    document.getElementById('confirm-message').textContent = message;
    modal.classList.add('active');

    const ok = document.getElementById('confirm-ok');
    const cancel = document.getElementById('confirm-cancel');

    function cleanup() {
      modal.classList.remove('active');
      ok.removeEventListener('click', onOk);
      cancel.removeEventListener('click', onCancel);
    }

    function onOk() { cleanup(); resolve(true); }
    function onCancel() { cleanup(); resolve(false); }

    ok.addEventListener('click', onOk);
    cancel.addEventListener('click', onCancel);
  });
}

document.getElementById('add-object-btn').addEventListener('click', () => {
  editingObjectId = null;
  document.getElementById('form-title').textContent = 'Naujas objektas';
  document.getElementById('object-form').reset();
  showView('objectForm');
});

document.getElementById('form-back-btn').addEventListener('click', () => {
  showView('objects');
});

document.getElementById('object-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('obj-name').value.trim(),
    address: document.getElementById('obj-address').value.trim(),
    client: document.getElementById('obj-client').value.trim(),
    phone: document.getElementById('obj-phone').value.trim(),
    status: document.getElementById('obj-status').value,
    notes: document.getElementById('obj-notes').value.trim()
  };

  if (!data.name) return;

  if (editingObjectId) {
    const idx = objects.findIndex(o => o.id === editingObjectId);
    if (idx !== -1) {
      objects[idx] = { ...objects[idx], ...data };
    }
    editingObjectId = null;
    saveData(objects);
    renderObjectsList();
    currentObjectId = objects[idx].id;
    renderObjectDetail(objects[idx]);
    showView('objectDetail');
  } else {
    const obj = {
      id: generateId(),
      ...data,
      materials: [],
      createdAt: Date.now()
    };
    objects.push(obj);
    saveData(objects);
    renderObjectsList();
    showView('objects');
  }
});

document.getElementById('objects-list').addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (!card) return;
  const id = card.dataset.id;
  const obj = objects.find(o => o.id === id);
  if (!obj) return;

  currentObjectId = id;
  renderObjectDetail(obj);
  showView('objectDetail');
});

document.getElementById('detail-back-btn').addEventListener('click', () => {
  currentObjectId = null;
  renderObjectsList();
  showView('objects');
});

document.getElementById('edit-object-btn').addEventListener('click', () => {
  const obj = objects.find(o => o.id === currentObjectId);
  if (!obj) return;

  editingObjectId = obj.id;
  document.getElementById('form-title').textContent = 'Redaguoti objektą';
  document.getElementById('obj-name').value = obj.name || '';
  document.getElementById('obj-address').value = obj.address || '';
  document.getElementById('obj-client').value = obj.client || '';
  document.getElementById('obj-phone').value = obj.phone || '';
  document.getElementById('obj-status').value = obj.status || 'naujas';
  document.getElementById('obj-notes').value = obj.notes || '';
  showView('objectForm');
});

document.getElementById('delete-object-btn').addEventListener('click', async () => {
  const confirmed = await showConfirm('Ar tikrai norite ištrinti šį objektą?');
  if (!confirmed) return;

  objects = objects.filter(o => o.id !== currentObjectId);
  saveData(objects);
  currentObjectId = null;
  renderObjectsList();
  showView('objects');
});

document.getElementById('add-material-btn').addEventListener('click', () => {
  editingMaterialId = null;
  document.getElementById('material-form-title').textContent = 'Nauja medžiaga';
  document.getElementById('material-form').reset();
  showView('materialForm');
});

document.getElementById('material-form-back-btn').addEventListener('click', () => {
  const obj = objects.find(o => o.id === currentObjectId);
  if (obj) renderObjectDetail(obj);
  showView('objectDetail');
});

document.getElementById('material-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const obj = objects.find(o => o.id === currentObjectId);
  if (!obj) return;

  if (!obj.materials) obj.materials = [];

  const mat = {
    id: generateId(),
    name: document.getElementById('mat-name').value.trim(),
    quantity: parseFloat(document.getElementById('mat-quantity').value) || 0,
    unit: document.getElementById('mat-unit').value,
    price: parseFloat(document.getElementById('mat-price').value) || 0
  };

  if (!mat.name) return;

  obj.materials.push(mat);
  saveData(objects);
  renderObjectDetail(obj);
  showView('objectDetail');
});

document.getElementById('materials-list').addEventListener('click', async (e) => {
  const btn = e.target.closest('.material-delete');
  if (!btn) return;

  const matId = btn.dataset.matId;
  const confirmed = await showConfirm('Pašalinti šią medžiagą?');
  if (!confirmed) return;

  const obj = objects.find(o => o.id === currentObjectId);
  if (!obj) return;

  obj.materials = (obj.materials || []).filter(m => m.id !== matId);
  saveData(objects);
  renderObjectDetail(obj);
});

renderObjectsList();
