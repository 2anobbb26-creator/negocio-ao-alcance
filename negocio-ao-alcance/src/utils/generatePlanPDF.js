import jsPDF from 'jspdf';

/**
 * Gera um PDF do plano do negócio.
 *
 * @param {Object} business      - Dados do negócio (businessData)
 * @param {Array}  steps         - Passos normalizados
 * @param {Object} completedSteps - Mapa { index: true }
 * @param {Array}  materials     - Materiais normalizados
 * @param {Object} checkedMaterials - Mapa { index: true }
 * @param {Array}  pricing       - Tabela de preços (opcional)
 * @param {Array}  timeline      - Cronograma (opcional)
 */
export const generatePlanPDF = ({
  business,
  steps = [],
  completedSteps = {},
  materials = [],
  checkedMaterials = {},
  pricing = null,
  timeline = null,
}) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  // ─── HELPERS ────────────────────────────────────────────
  const checkNewPage = (neededSpace = 12) => {
    if (y + neededSpace > pageHeight - margin) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  const drawText = (text, opts = {}) => {
    const {
      size = 11,
      color = '#333333',
      style = 'normal',
      x = margin,
      maxWidth = contentWidth,
      lineHeight = 5.5,
      spacing = 2,
    } = opts;

    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.setTextColor(color);

    const lines = doc.splitTextToSize(text, maxWidth);

    lines.forEach((line) => {
      checkNewPage(lineHeight + 2);
      doc.text(line, x, y);
      y += lineHeight;
    });

    y += spacing;
  };

  const drawDivider = () => {
    checkNewPage(8);
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  const drawSectionTitle = (emoji, title) => {
    checkNewPage(14);
    y += 4;

    doc.setFillColor(240, 245, 255);
    doc.roundedRect(margin, y - 4, contentWidth, 10, 2, 2, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#1e3a8a');
    doc.text(`${emoji}  ${title}`, margin + 4, y + 2.5);

    y += 12;
  };

  const drawCheckRow = (text, done, subText = null) => {
    checkNewPage(10);

    // caixa
    const boxX = margin;
    const boxY = y - 3.5;
    const boxSize = 4.5;

    if (done) {
      doc.setFillColor(34, 197, 94);
      doc.roundedRect(boxX, boxY, boxSize, boxSize, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text('✓', boxX + 1.1, boxY + 3.4);
    } else {
      doc.setDrawColor(180, 190, 210);
      doc.setLineWidth(0.4);
      doc.roundedRect(boxX, boxY, boxSize, boxSize, 1, 1, 'S');
    }

    // título
    doc.setFontSize(10.5);
    doc.setFont('helvetica', done ? 'normal' : 'bold');
    doc.setTextColor(done ? '#94a3b8' : '#1a2336');

    const titleLines = doc.splitTextToSize(text, contentWidth - 10);
    titleLines.forEach((line, i) => {
      checkNewPage(6);
      doc.text(line, boxX + 8, y + i * 5);
    });

    y += titleLines.length * 5;

    // subtítulo
    if (subText) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#6b7280');
      const subLines = doc.splitTextToSize(subText, contentWidth - 10);
      subLines.forEach((line) => {
        checkNewPage(5);
        doc.text(line, boxX + 8, y);
        y += 4.5;
      });
    }

    y += 3;
  };

  const formatBRL = (min, max, period = null) => {
    if (min === null && max === null) return null;
    if (min === 0 && max === 0) return 'Grátis';

    const fmt = (v) => `R$ ${v.toLocaleString('pt-BR')}`;
    let result = (min === max || max === null) ? fmt(min ?? 0) : `${fmt(min)} - ${fmt(max)}`;
    return period ? `${result}${period}` : result;
  };

  // ═══════════════════════════════════════════════════════
  // CAPA / HEADER
  // ═══════════════════════════════════════════════════════
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 200, 255);
  doc.text('NEGÓCIO AO ALCANCE', margin, 14);

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Meu plano de negócio', margin, 24);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(210, 225, 255);
  const dateStr = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  doc.text(`Gerado em ${dateStr}`, margin, 33);

  y = 50;

  // ─── NEGÓCIO ────────────────────────────────────────────
  doc.setFillColor(245, 248, 255);
  doc.roundedRect(margin, y - 4, contentWidth, 22, 3, 3, 'F');

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#1e3a8a');
  doc.text(business.name || '', margin + 4, y + 3);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#4b5563');
  doc.text(`Categoria: ${business.category || '-'}`, margin + 4, y + 10);

  if (business.description) {
    const desc = doc.splitTextToSize(business.description, contentWidth - 8);
    desc.slice(0, 2).forEach((line, i) => {
      doc.text(line, margin + 4, y + 15 + i * 4.5);
    });
  }

  y += 28;

  // ─── RESUMO ─────────────────────────────────────────────
  drawSectionTitle('📊', 'Resumo do plano');

  const totalSteps = steps.length;
  const doneSteps = Object.values(completedSteps).filter(Boolean).length;
  const pct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor('#1a2336');
  doc.text(`Progresso do roteiro: ${doneSteps} de ${totalSteps} etapas (${pct}%)`, margin, y);
  y += 6;

  if (business.minInvestment != null) {
    doc.text(
      `Investimento estimado: ${formatBRL(business.minInvestment, business.maxInvestment)}`,
      margin, y
    );
    y += 6;
  }

  if (business.profitMargin) {
    doc.text(`Margem de lucro: ${business.profitMargin}`, margin, y);
    y += 6;
  }

  if (business.payback) {
    doc.text(`Retorno estimado: ${business.payback}`, margin, y);
    y += 6;
  }

  y += 2;

  // ─── ROTEIRO ────────────────────────────────────────────
  if (steps.length > 0) {
    drawDivider();
    drawSectionTitle('🎯', 'Roteiro de ação');

    steps.forEach((step, i) => {
      drawCheckRow(step.title, !!completedSteps[i], step.description || null);
    });
  }

  // ─── MATERIAIS ──────────────────────────────────────────
  if (materials.length > 0) {
    drawDivider();
    drawSectionTitle('📦', 'Materiais necessários');

    let totalAll = 0;
    let totalLeft = 0;
    let hasPrice = false;

    materials.forEach((m, i) => {
      const isChecked = !!checkedMaterials[i];
      const price = formatBRL(m.priceMin, m.priceMax, m.period);
      const subtitle = price ? `Valor: ${price}` : null;

      drawCheckRow(m.name, isChecked, subtitle);

      if (m.priceMin != null) {
        hasPrice = true;
        totalAll += m.priceMin;
        if (!isChecked) totalLeft += m.priceMin;
      }
    });

    if (hasPrice) {
      y += 4;
      checkNewPage(20);

      doc.setFillColor(240, 253, 244);
      doc.roundedRect(margin, y - 4, contentWidth, 20, 2, 2, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor('#166534');
      doc.text('💰 Investimento em materiais', margin + 4, y + 3);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#166534');
      doc.text(`Total estimado: ${formatBRL(totalAll, totalAll)}`, margin + 4, y + 9);
      doc.text(`Falta investir: ${formatBRL(totalLeft, totalLeft)}`, margin + 4, y + 14);

      y += 24;
    }
  }

  // ─── CLIENTES ───────────────────────────────────────────
  if (business.potentialClients?.length > 0) {
    drawDivider();
    drawSectionTitle('👥', 'Potenciais clientes');

    business.potentialClients.forEach((client) => {
      const text = typeof client === 'string' ? client : client.name;
      checkNewPage(6);
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#1a2336');
      doc.text(`• ${text}`, margin + 2, y);
      y += 5.5;
    });

    y += 2;
  }

  // ─── PRICING ────────────────────────────────────────────
  if (pricing && pricing.length > 0) {
    drawDivider();
    drawSectionTitle('📊', 'Quanto cobrar');

    const colWidths = [contentWidth * 0.4, contentWidth * 0.35, contentWidth * 0.25];
    const startX = margin;

    // header
    checkNewPage(10);
    doc.setFillColor(230, 240, 255);
    doc.rect(startX, y - 4, contentWidth, 8, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#1e3a8a');

    let x = startX + 2;
    doc.text('Nível', x, y + 1);
    x += colWidths[0];
    doc.text('Preço', x, y + 1);
    x += colWidths[1];
    doc.text('Prazo', x, y + 1);
    y += 8;

    pricing.forEach((row) => {
      checkNewPage(7);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#1a2336');

      let cx = startX + 2;
      doc.text(row.level || '-', cx, y);
      cx += colWidths[0];
      doc.text(formatBRL(row.min, row.max) || '-', cx, y);
      cx += colWidths[1];
      doc.text(row.time || '-', cx, y);

      y += 6;
      doc.setDrawColor(240, 243, 250);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
    });

    y += 2;
  }

  // ─── TIMELINE ───────────────────────────────────────────
  if (timeline && timeline.length > 0) {
    drawDivider();
    drawSectionTitle('🗓️', 'Cronograma sugerido');

    timeline.forEach((item) => {
      checkNewPage(8);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor('#1e3a8a');
      doc.text(`${item.week}:`, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#1a2336');
      doc.text(item.task || '', margin + 25, y);
      y += 6;
    });
  }

  // ─── RODAPÉ ─────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#94a3b8');
    doc.text(
      `Negócio ao Alcance · Página ${p} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // ─── SALVAR ─────────────────────────────────────────────
  const safeName = (business.name || 'plano')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  doc.save(`plano-${safeName}.pdf`);
};