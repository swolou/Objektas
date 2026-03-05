import jsPDF from 'jspdf';
import { formatCurrency } from './utils';

const SELLER_STORAGE_KEY = 'elektros_pardavejas';

export function loadSellerInfo() {
  try {
    return JSON.parse(localStorage.getItem(SELLER_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveSellerInfo(info) {
  localStorage.setItem(SELLER_STORAGE_KEY, JSON.stringify(info));
}

export function generateInvoice(object, seller, customInvoiceNumber) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SASKAITA FAKTURA', pageWidth / 2, y, { align: 'center' });
  y += 8;

  const invoiceNumber = customInvoiceNumber || `SF-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  const invoiceDate = new Date().toLocaleDateString('lt-LT');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Serija ir Nr.: ${invoiceNumber}`, pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text(`Data: ${invoiceDate}`, pageWidth / 2, y, { align: 'center' });
  y += 12;

  const colMid = pageWidth / 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PARDAVEJAS', margin, y);
  doc.text('PIRKEJAS', colMid + 5, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  const sellerLines = [];
  if (seller.company) sellerLines.push(seller.company);
  if (seller.code) sellerLines.push(`Im. kodas: ${seller.code}`);
  if (seller.pvmCode) sellerLines.push(`PVM kodas: ${seller.pvmCode}`);
  if (seller.address) sellerLines.push(`Adresas: ${seller.address}`);
  if (seller.phone) sellerLines.push(`Tel.: ${seller.phone}`);
  if (seller.email) sellerLines.push(`El. pastas: ${seller.email}`);
  if (seller.bank) sellerLines.push(`Bankas: ${seller.bank}`);
  if (seller.account) sellerLines.push(`A/S: ${seller.account}`);

  const buyerLines = [];
  if (object.clientCompany) buyerLines.push(object.clientCompany);
  if (object.client) buyerLines.push(`Kontaktas: ${object.client}`);
  if (object.clientCode) buyerLines.push(`Im. kodas: ${object.clientCode}`);
  if (object.clientPvm) buyerLines.push(`PVM kodas: ${object.clientPvm}`);
  if (object.clientAddress) buyerLines.push(`Adresas: ${object.clientAddress}`);
  if (object.phone) buyerLines.push(`Tel.: ${object.phone}`);

  const maxLines = Math.max(sellerLines.length, buyerLines.length);
  for (let i = 0; i < maxLines; i++) {
    if (sellerLines[i]) doc.text(sellerLines[i], margin, y);
    if (buyerLines[i]) doc.text(buyerLines[i], colMid + 5, y);
    y += 5;
  }

  y += 5;

  if (object.name || object.address) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    let objText = `Objektas: ${object.name || ''}`;
    if (object.address) objText += `, ${object.address}`;
    doc.text(objText, margin, y);
    y += 8;
  }

  const materials = object.materials || [];

  const colNr = margin;
  const colName = margin + 10;
  const colUnit = margin + 100;
  const colQty = margin + 115;
  const colPrice = margin + 135;
  const colSum = margin + 155;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setDrawColor(100);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  doc.text('Nr.', colNr, y);
  doc.text('Pavadinimas', colName, y);
  doc.text('Vnt.', colUnit, y);
  doc.text('Kiekis', colQty, y);
  doc.text('Kaina', colPrice, y);
  doc.text('Suma', colSum, y);
  y += 2;
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  let grandTotal = 0;

  materials.forEach((m, idx) => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }
    const lineTotal = (m.price || 0) * (m.quantity || 0);
    grandTotal += lineTotal;

    doc.text(String(idx + 1), colNr, y);

    const nameLines = doc.splitTextToSize(m.name || '', 85);
    nameLines.forEach((line, li) => {
      doc.text(line, colName, y + li * 4);
    });

    doc.text(m.unit || 'vnt', colUnit, y);
    doc.text(String(m.quantity || 0), colQty, y);
    doc.text(m.price ? m.price.toFixed(2) : '0.00', colPrice, y);
    doc.text(lineTotal.toFixed(2), colSum, y);

    y += Math.max(nameLines.length * 4, 5) + 2;
  });

  doc.line(margin, y, margin + contentWidth, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Viso: ${grandTotal.toFixed(2)} EUR`, margin + contentWidth, y, { align: 'right' });
  y += 12;

  const pvmRate = 0.21;
  const pvmSum = grandTotal * pvmRate;
  const totalWithPvm = grandTotal + pvmSum;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Suma be PVM: ${grandTotal.toFixed(2)} EUR`, margin + contentWidth, y, { align: 'right' });
  y += 5;
  doc.text(`PVM (21%): ${pvmSum.toFixed(2)} EUR`, margin + contentWidth, y, { align: 'right' });
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text(`Bendra suma su PVM: ${totalWithPvm.toFixed(2)} EUR`, margin + contentWidth, y, { align: 'right' });
  y += 20;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Saskaita israse:', margin, y);
  doc.text('Saskaita gavo:', colMid + 5, y);
  y += 15;

  doc.line(margin, y, margin + 60, y);
  doc.line(colMid + 5, y, colMid + 65, y);
  y += 4;
  doc.setFontSize(8);
  doc.text('(parasas, vardas, pavarde)', margin, y);
  doc.text('(parasas, vardas, pavarde)', colMid + 5, y);

  const fileName = `Saskaita_${object.name || 'objektas'}_${invoiceDate.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);

  const pdfData = doc.output('datauristring');
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    number: invoiceNumber,
    date: invoiceDate,
    pdfData,
    fileName,
  };
}

export function openInvoicePdf(invoice) {
  const link = document.createElement('a');
  link.href = invoice.pdfData;
  link.download = invoice.fileName || `Saskaita_${invoice.number}.pdf`;
  link.click();
}
