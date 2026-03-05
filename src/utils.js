export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString('lt-LT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatCurrency(val) {
  return Number(val).toFixed(2) + ' €';
}

export const statusLabels = {
  naujas: 'Naujas',
  vykdomas: 'Vykdomas',
  uzbaigtas: 'Užbaigtas',
};
