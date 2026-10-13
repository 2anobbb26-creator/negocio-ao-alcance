import jsPDF from 'jspdf';

export const generatePlanPDF = ({
  business,
  steps = [],
  completedSteps = {},
  materials = [],
  checkedMaterials = {},
  pricing = null,
  timeline = null,
  userName = null,
}) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();   // 210
  const pageH = doc.internal.pageSize.getHeight();  // 297

  const M = 14;
  const GAP = 8;
  const colW = (pageW - M * 2 - GAP) / 2;
  const colL = M;
  const colR = M + colW + GAP;

  // ─── Paleta ────────────────────────────────────────────
  const C = {
    headerBg:  [15, 23, 42],
    cardBg:    [248, 250, 253],
    pageBg:    [255, 255, 255],
    divider:   [228, 234, 245],

    azul:      [37, 99, 235],
    azulDk:    [30, 64, 175],
    azulLt:    [96, 165, 250],
    azulSoft:  [219, 234, 254],

    roxo:      [124, 58, 237],
    roxoDk:    [91, 33, 182],
    roxoLt:    [167, 139, 250],
    roxoSoft:  [237, 233, 254],

    texto:     [15, 23, 42],
    textoMed:  [71, 85, 105],
    textoLt:   [148, 163, 184],

    verde:     [22, 163, 74],
    verdeSoft: [220, 252, 231],
    branco:    [255, 255, 255],
  };

  // ─── Helpers ───────────────────────────────────────────
  const setC = (rgb) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  const setF = (rgb) => doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  const setD = (rgb) => doc.setDrawColor(rgb[0], rgb[1], rgb[2]);

  const lerp = (a, b, t) => [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];

  const formatBRL = (min, max, period = null) => {
    if (min === null && max === null) return null;
    if (min === 0 && max === 0) return 'Grátis';
    const fmt = (v) => `R$ ${v.toLocaleString('pt-BR')}`;
    const r = (min === max || max === null)
      ? fmt(min ?? 0)
      : `${fmt(min)} - ${fmt(max)}`;
    return period ? `${r}${period}` : r;
  };

  const gradH = (x, y, w, h, cA, cB) => {
    const fatias = 60;
    const wF = w / fatias;
    for (let i = 0; i < fatias; i++) {
      const t = i / (fatias - 1);
      setF(lerp(cA, cB, t));
      doc.rect(x + i * wF, y, wF + 0.1, h, 'F');
    }
  };

  const gradText = (text, x, y, cA, cB, size = 11) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    let cursor = x;
    for (let i = 0; i < text.length; i++) {
      const t = text.length > 1 ? i / (text.length - 1) : 0;
      setC(lerp(cA, cB, t));
      doc.text(text[i], cursor, y);
      cursor += doc.getTextWidth(text[i]);
    }
  };

  const sectionTitle = (x, y, w, title, badge = null, accent = C.azul) => {
    setF(accent);
    doc.roundedRect(x, y - 3.2, 1.6, 4.8, 0.5, 0.5, 'F');

    setC(C.texto);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, x + 5, y);

    if (badge) {
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      const tw = doc.getTextWidth(badge);
      const pw = tw + 8;
      const px = x + w - pw;

      setF(accent);
      doc.roundedRect(px, y - 3.4, pw, 5.4, 2.7, 2.7, 'F');

      setC(C.branco);
      doc.text(badge, px + 4, y);
    }

    setD(C.divider);
    doc.setLineWidth(0.25);
    doc.line(x, y + 2.8, x + w, y + 2.8);
  };

  const drawCategoryIcon = (cx, cy, categoria, cor = C.branco) => {
    setF(cor);
    const cat = (categoria || '').toLowerCase();

    if (cat.includes('tecnologia')) {
      doc.roundedRect(cx - 3.4, cy - 3, 6.8, 5, 0.6, 0.6, 'F');
      doc.rect(cx - 1.8, cy + 2.2, 3.6, 0.7, 'F');
      doc.rect(cx - 3, cy + 3, 6, 0.5, 'F');
    } else if (cat.includes('beleza')) {
      doc.triangle(cx, cy - 3.4, cx - 3, cy + 3, cx + 3, cy + 3, 'F');
    } else if (cat.includes('alimenta')) {
      doc.rect(cx - 2.4, cy - 3, 0.8, 6, 'F');
      doc.rect(cx - 3.4, cy - 3, 0.5, 1.8, 'F');
      doc.rect(cx - 1.4, cy - 3, 0.5, 1.8, 'F');
      doc.rect(cx + 1.7, cy - 3, 0.8, 6, 'F');
    } else if (cat.includes('servi')) {
      doc.roundedRect(cx - 3, cy - 3, 6, 6, 0.6, 0.6, 'F');
      setF(C.headerBg);
      doc.circle(cx, cy, 1.2, 'F');
    } else if (cat.includes('educa')) {
      doc.rect(cx - 3.4, cy - 2.5, 3.2, 5, 'F');
      doc.rect(cx + 0.2, cy - 2.5, 3.2, 5, 'F');
    } else if (cat.includes('agro')) {
      doc.triangle(cx, cy - 3.4, cx - 3, cy + 3, cx + 3, cy + 3, 'F');
    } else if (cat.includes('artesanato')) {
      doc.triangle(cx, cy - 3.4, cx - 3, cy, cx + 3, cy, 'F');
      doc.triangle(cx, cy + 3.4, cx - 3, cy, cx + 3, cy, 'F');
    } else if (cat.includes('automotivo')) {
      doc.circle(cx, cy, 3.2, 'F');
      setF(C.headerBg);
      doc.circle(cx, cy, 1.2, 'F');
    } else {
      doc.roundedRect(cx - 3, cy - 3, 6, 6, 0.6, 0.6, 'F');
      setF(C.headerBg);
      doc.circle(cx, cy, 1.2, 'F');
    }
  };

  const drawTarget = (cx, cy, cor) => {
    setD(cor);
    doc.setLineWidth(0.6);
    doc.circle(cx, cy, 3.4, 'S');
    doc.setLineWidth(0.6);
    doc.circle(cx, cy, 1.8, 'S');
    setF(cor);
    doc.circle(cx, cy, 0.8, 'F');
  };

  const drawCheckbox = (x, y, checked, size = 4.5) => {
    if (checked) {
      setF(C.verde);
      doc.roundedRect(x, y, size, size, 1.3, 1.3, 'F');
      setD(C.branco);
      doc.setLineWidth(0.7);
      doc.line(x + size * 0.25, y + size * 0.55, x + size * 0.45, y + size * 0.75);
      doc.line(x + size * 0.45, y + size * 0.75, x + size * 0.78, y + size * 0.28);
    } else {
      setD([200, 210, 226]);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, y, size, size, 1.3, 1.3, 'S');
    }
  };

  // Helper pra renderizar tabela de preços (reusado em 2 lugares)
  const renderPricingTable = (x, y, w) => {
    if (!pricing || pricing.length === 0) return y;

    sectionTitle(x, y, w, 'Preços sugeridos', null, C.roxo);
    let cy = y + 11;

    setF(C.roxoSoft);
    doc.roundedRect(x, cy - 4, w, 6.5, 1, 1, 'F');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    setC(C.roxoDk);
    doc.text('NÍVEL', x + 3, cy);
    doc.text('VALOR', x + w * 0.42, cy);
    doc.text('PRAZO', x + w, cy, { align: 'right' });

    cy += 7.5;

    pricing.forEach((row) => {
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      setC(C.texto);
      doc.text(row.level, x + 3, cy);

      setC(C.azulDk);
      doc.text(formatBRL(row.min, row.max) || '-', x + w * 0.42, cy);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      setC(C.textoMed);
      doc.text(row.time || '', x + w, cy, { align: 'right' });

      setD(C.divider);
      doc.setLineWidth(0.2);
      doc.line(x, cy + 2.4, x + w, cy + 2.4);

      cy += 7;
    });

    return cy;
  };

  // ═══════════════════════════════════════════════════════
  // HEADER
  // ═══════════════════════════════════════════════════════
  const headerH = 56;

  setF(C.headerBg);
  doc.rect(0, 0, pageW, headerH, 'F');

  gradH(0, 0, pageW, 2, C.azul, C.roxo);

  const logoCx = pageW - M - 9;
  const logoCy = 16;
  const logoR = 8.5;

  const fatiasLogo = 30;
  for (let i = 0; i < fatiasLogo; i++) {
    const t = i / fatiasLogo;
    setF(lerp(C.azul, C.roxo, t));
    const a1 = (i / fatiasLogo) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / fatiasLogo) * Math.PI * 2 - Math.PI / 2;
    doc.triangle(
      logoCx, logoCy,
      logoCx + Math.cos(a1) * logoR, logoCy + Math.sin(a1) * logoR,
      logoCx + Math.cos(a2) * logoR, logoCy + Math.sin(a2) * logoR,
      'F'
    );
  }
  setF(C.headerBg);
  doc.circle(logoCx, logoCy, logoR * 0.62, 'F');
  drawCategoryIcon(logoCx, logoCy, business.category, C.branco);

  gradText('Negócio ao Alcance', M, 15, C.branco, C.roxoLt, 13);

  setF(C.azulLt);
  doc.roundedRect(M, 18.5, 1.2, 3.6, 0.4, 0.4, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  setC(C.azulLt);
  doc.text((business.category || '').toUpperCase(), M + 3.5, 21.3);

  const nomeMaxW = pageW - M * 2 - 70;
  let nomeFontSize = 21;

  doc.setFontSize(nomeFontSize);
  doc.setFont('helvetica', 'bold');
  let nameLines = doc.splitTextToSize(business.name || '', nomeMaxW);

  if (nameLines.length > 1) {
    nomeFontSize = 18;
    doc.setFontSize(nomeFontSize);
    nameLines = doc.splitTextToSize(business.name || '', nomeMaxW);
  }

  doc.setFontSize(nomeFontSize);
  doc.setFont('helvetica', 'bold');
  setC(C.branco);
  doc.text(nameLines.slice(0, 2), M, 30);

  const dateStr = new Date().toLocaleDateString('pt-BR');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  setC(C.azulLt);
  doc.text(dateStr, pageW - M, 28, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  setC([148, 163, 184]);
  doc.text('Gerado automaticamente', pageW - M, 32, { align: 'right' });

  const totalSteps = steps.length;
  const doneSteps = Object.values(completedSteps).filter(Boolean).length;
  const pct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

  const progressoY = 42;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  setC([200, 216, 240]);
  doc.text(`${doneSteps} de ${totalSteps} etapas concluídas`, M, progressoY);

  setC(C.branco);
  doc.setFontSize(9);
  doc.text(`${pct}%`, pageW - M, progressoY, { align: 'right' });

  const barraY = headerH - 6;
  const barraW = pageW - M * 2;
  const barraH = 3.5;

  setF([50, 68, 105]);
  doc.roundedRect(M, barraY, barraW, barraH, 1.75, 1.75, 'F');

  setD([80, 100, 145]);
  doc.setLineWidth(0.2);
  doc.roundedRect(M, barraY, barraW, barraH, 1.75, 1.75, 'S');

  if (pct > 0) {
    setF(C.azulLt);
    doc.roundedRect(M, barraY, (barraW * pct) / 100, barraH, 1.75, 1.75, 'F');
  }

  setF(C.pageBg);
  doc.rect(0, headerH, pageW, pageH - headerH, 'F');

  // ═══════════════════════════════════════════════════════
  // PRÓXIMO PASSO
  // ═══════════════════════════════════════════════════════
  let y = headerH + 7;

  const proximoIndex = steps.findIndex((_, i) => !completedSteps[i]);
  const proximoPasso = proximoIndex >= 0 ? steps[proximoIndex] : null;

  if (proximoPasso && pct < 100) {
    const cardH = 20;

    setF(C.azulSoft);
    setD(C.azul);
    doc.setLineWidth(0.5);
    doc.roundedRect(M, y, pageW - M * 2, cardH, 2.5, 2.5, 'FD');

    setF(C.azul);
    doc.roundedRect(M + 2, y + 2.5, 1.6, cardH - 5, 0.8, 0.8, 'F');

    drawTarget(M + 10, y + cardH / 2, C.azul);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    setC(C.azulDk);
    doc.text('PRÓXIMO PASSO', M + 17, y + 6);

    doc.setFontSize(11.5);
    doc.setFont('helvetica', 'bold');
    setC(C.texto);
    const passoLines = doc.splitTextToSize(proximoPasso.title, pageW - M * 2 - 60);
    doc.text(passoLines.slice(0, 2), M + 17, y + 12.5);

    if (proximoPasso.estimatedTime) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      setC(C.azulDk);
      doc.text(proximoPasso.estimatedTime, pageW - M - 4, y + 7, { align: 'right' });
    }

    y += cardH + 5;   // ⬅️ reduzido de 8
  }

  // ═══════════════════════════════════════════════════════
  // SOBRE O NEGÓCIO
  // ═══════════════════════════════════════════════════════
  if (business.description) {
    sectionTitle(M, y, pageW - M * 2, 'Sobre o negócio', null, C.azul);
    y += 9;   // ⬅️ reduzido de 10

    setF(C.cardBg);
    setD(C.divider);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, y, pageW - M * 2, 15, 2, 2, 'FD');

    setF(C.azul);
    doc.roundedRect(M, y + 1.5, 1.5, 12, 0.75, 0.75, 'F');

    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'normal');
    setC(C.texto);
    const descLines = doc.splitTextToSize(business.description, pageW - M * 2 - 12);
    doc.text(descLines.slice(0, 2), M + 6, y + 7);

    y += 20;   // ⬅️ reduzido de 23
  }

  // ═══════════════════════════════════════════════════════
  // CARDS DE RESUMO
  // ═══════════════════════════════════════════════════════
  const resumo = [];
  if (business.minInvestment != null) {
    resumo.push({
      label: 'INVESTIMENTO',
      value: formatBRL(business.minInvestment, business.maxInvestment),
      accent: C.azul,
    });
  }
  if (business.profitMargin) {
    resumo.push({
      label: 'MARGEM DE LUCRO',
      value: business.profitMargin,
      accent: C.roxo,
    });
  }
  if (business.payback) {
    resumo.push({
      label: 'RETORNO',
      value: business.payback,
      accent: C.azulLt,
    });
  }

  if (resumo.length > 0) {
    const cardW = (pageW - M * 2 - (resumo.length - 1) * 5) / resumo.length;

    resumo.forEach((item, i) => {
      const x = M + i * (cardW + 5);

      setF(C.pageBg);
      setD(C.divider);
      doc.setLineWidth(0.35);
      doc.roundedRect(x, y, cardW, 21, 2.5, 2.5, 'FD');

      setF(item.accent);
      doc.roundedRect(x, y + 3, 1.4, 15, 0.7, 0.7, 'F');

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      setC(C.textoLt);
      doc.text(item.label, x + 5, y + 7);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      setC(C.texto);
      const valLines = doc.splitTextToSize(item.value, cardW - 8);
      doc.text(valLines[0], x + 5, y + 15.5);
    });

    y += 25;   // ⬅️ reduzido de 27
  }

  // ═══════════════════════════════════════════════════════
  // COLUNAS
  // ═══════════════════════════════════════════════════════
  let yL = y;
  let yR = y;

  // ─── ESQUERDA: ROTEIRO ─────────────────────────────────
  if (steps.length > 0) {
    sectionTitle(colL, yL, colW, 'Roteiro de ação', `${steps.length} etapas`, C.azul);
    yL += 11;

    steps.slice(0, 8).forEach((step, i) => {
      const isDone = !!completedSteps[i];

      drawCheckbox(colL, yL - 3.5, isDone, 4.5);

      doc.setFontSize(10.5);
      doc.setFont('helvetica', isDone ? 'normal' : 'bold');
      setC(isDone ? C.textoLt : C.texto);
      const lines = doc.splitTextToSize(step.title, colW - 9);
      lines.forEach((line, li) => {
        doc.text(line, colL + 7, yL + li * 5);
      });

      yL += lines.length * 5 + 3.2;
    });

    yL += 6;
  }

  // ─── DIREITA: MATERIAIS ────────────────────────────────
  if (materials.length > 0) {
    sectionTitle(colR, yR, colW, 'Materiais', `${materials.length} itens`, C.roxo);
    yR += 11;

    let totalAll = 0;
    let totalLeft = 0;
    let hasPrice = false;

    materials.slice(0, 8).forEach((m, i) => {
      const isChecked = !!checkedMaterials[i];
      const priceText = formatBRL(m.priceMin, m.priceMax, m.period);

      drawCheckbox(colR, yR - 3.5, isChecked, 4.5);

      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      setC(isChecked ? C.textoLt : C.texto);

      const priceW = priceText ? 35 : 0;
      const nameLines = doc.splitTextToSize(m.name, colW - 9 - priceW);
      nameLines.slice(0, 2).forEach((line, li) => {
        doc.text(line, colR + 7, yR + li * 5);
      });

      if (priceText) {
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        setC(isChecked ? C.textoLt : C.azulDk);
        doc.text(priceText, colR + colW, yR, { align: 'right' });
      }

      yR += nameLines.length > 1 ? 10 : 6;

      if (m.priceMin != null) {
        hasPrice = true;
        totalAll += m.priceMin;
        if (!isChecked) totalLeft += m.priceMin;
      }
    });

    if (hasPrice) {
      yR += 4;

      setF(C.azulSoft);
      setD(C.azul);
      doc.setLineWidth(0.35);
      doc.roundedRect(colR, yR, colW, 18, 2, 2, 'FD');

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      setC(C.azulDk);
      doc.text('INVESTIMENTO TOTAL', colR + 4, yR + 5.5);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      setC(C.texto);
      doc.text(`Total: ${formatBRL(totalAll, totalAll)}`, colR + 4, yR + 10.5);

      doc.setFont('helvetica', 'bold');
      setC(C.azulDk);
      doc.text(`Faltam: ${formatBRL(totalLeft, totalLeft)}`, colR + 4, yR + 15.5);

      yR += 22;
    }

    yR += 6;

    // ⭐ Preços na mesma coluna se ainda tiver espaço
    if (pricing && pricing.length > 0 && yR < yL - 30) {
      yR += 4;
      yR = renderPricingTable(colR, yR, colW);
      yR += 4;
    }
  }

  // ─── ESQUERDA: CLIENTES ────────────────────────────────
  if (business.potentialClients?.length > 0) {
    sectionTitle(
      colL, yL, colW,
      'Clientes potenciais',
      `${business.potentialClients.length} perfis`,
      C.azul
    );
    yL += 11;

    business.potentialClients.slice(0, 8).forEach((client) => {
      const text = typeof client === 'string' ? client : client.name;

      setF(C.azul);
      doc.circle(colL + 1.7, yL - 1, 1, 'F');

      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'normal');
      setC(C.texto);
      const lines = doc.splitTextToSize(text, colW - 7);
      doc.text(lines[0], colL + 6, yL);

      yL += 6;
    });

    yL += 6;
  }

  // ─── DIREITA: PREÇOS (só se não foi renderizado ainda) ─
  if (pricing && pricing.length > 0 && yR < yL - 20) {
    yR += 4;
    yR = renderPricingTable(colR, yR, colW);
    yR += 4;
  }

  // ═══════════════════════════════════════════════════════
  // ERROS COMUNS (condição permissiva)
  // ═══════════════════════════════════════════════════════
  const maxY = Math.max(yL, yR);
  const espacoRestante = pageH - 60 - maxY;

  if (espacoRestante > 30) {   // ⬅️ era 60
    const dy = maxY + 8;

    sectionTitle(M, dy, pageW - M * 2, 'Erros comuns', 'evite', C.roxo);

    const erros = [
      'Cobrar barato demais pra atrair cliente: desvaloriza seu trabalho e atrai quem não valoriza.',
      'Não documentar o trabalho: sem portfólio você não consegue cobrar mais caro depois.',
      'Deixar de pedir feedback: 90% dos clientes satisfeitos voltam se você perguntar.',
    ];

    let dy2 = dy + 13;
    erros.forEach((erro) => {
      const xr = M + 1.4;
      const yr = dy2 - 1.2;

      setD(C.roxo);
      doc.setLineWidth(0.8);
      doc.line(xr - 1.3, yr - 1.3, xr + 1.3, yr + 1.3);
      doc.line(xr + 1.3, yr - 1.3, xr - 1.3, yr + 1.3);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      setC(C.texto);

      const lines = doc.splitTextToSize(erro, pageW - M * 2 - 8);
      doc.text(lines[0], M + 6, dy2);
      dy2 += 4.8;

      if (lines[1]) {
        doc.text(lines[1], M + 6, dy2);
        dy2 += 4.8;
      }

      dy2 += 2;
    });
  }

  // ═══════════════════════════════════════════════════════
  // CHECKLIST "ANTES DE COMEÇAR" (permissiva)
  // ═══════════════════════════════════════════════════════
  const maxY2 = Math.max(yL, yR, y);

  if (pageH - 60 - maxY2 > 35) {   // ⬅️ era 55
    const dy = maxY2 + 40;   // ⬅️ era 48

    sectionTitle(M, dy, pageW - M * 2, 'Antes de começar', 'checklist', C.azul);

    const checks = [
      'Reservei tempo na semana para me dedicar',
      'Tenho acesso à internet e aos equipamentos básicos',
      'Separei o valor do investimento inicial',
      'Escolhi um espaço adequado para trabalhar',
      'Estou disposto a aprender e ajustar o plano',
    ];

    let dy2 = dy + 12;
    checks.forEach((check) => {
      drawCheckbox(M, dy2 - 2.8, false, 4);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      setC(C.texto);
      doc.text(check, M + 6.5, dy2);

      dy2 += 6.5;
    });
  }

  // ═══════════════════════════════════════════════════════
  // PERGUNTAS FREQUENTES (condição MUITO permissiva)
  // ═══════════════════════════════════════════════════════
  const maxY3 = Math.max(yL, yR, y, maxY2);
  const espacoFAQ = pageH - 60 - maxY3;

  if (espacoFAQ > 25) {   // ⬅️ era 50
    const dy = maxY3 + 50;   // ⬅️ era 58

    if (dy < pageH - 42) {
      sectionTitle(M, dy, pageW - M * 2, 'Perguntas frequentes', 'FAQ', C.roxo);

      const faqs = [
        {
          q: 'Preciso de CNPJ pra começar?',
          a: 'Não. Você pode começar como pessoa física. O CNPJ (MEI) só é necessário quando você passar a faturar acima de R$ 3.000 por mês ou precisar emitir nota fiscal.',
        },
        {
          q: 'Quanto tempo leva pra ter o primeiro cliente?',
          a: 'Depende do seu esforço, mas em média leva de 2 a 4 semanas. Foque em divulgar todos os dias e oferecer um serviço de teste pra 3 pessoas próximas.',
        },
        {
          q: 'Posso começar sozinho ou preciso de sócio?',
          a: 'Comece sozinho. Um sócio só é bom quando você já tem clientes e precisa dividir tarefas. No início, menos gente = menos dor de cabeça.',
        },
        {
          q: 'O que faço se não der certo nos primeiros meses?',
          a: 'Ajuste o plano. Veja em qual etapa você parou, o que faltou e recomece. Muitos negócios só decolam depois de 2-3 tentativas.',
        },
      ];

      let dy2 = dy + 13;
      faqs.forEach((faq) => {
        setF(C.roxo);
        doc.circle(M + 1.5, dy2 - 1, 1, 'F');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        setC(C.roxoDk);
        const qLines = doc.splitTextToSize(faq.q, pageW - M * 2 - 8);
        doc.text(qLines[0], M + 6, dy2);
        dy2 += 5.5;

        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        setC(C.textoMed);
        const aLines = doc.splitTextToSize(faq.a, pageW - M * 2 - 8);
        aLines.slice(0, 3).forEach((line) => {
          doc.text(line, M + 6, dy2);
          dy2 += 4.5;
        });

        dy2 += 3.5;
      });
    }
  }

  // ═══════════════════════════════════════════════════════
  // RODAPÉ
  // ═══════════════════════════════════════════════════════
  const footerY = pageH - 10;

  gradH(M, footerY - 0.5, 40, 0.5, C.azul, C.roxo);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  setC(C.texto);
  doc.text('Negócio ao Alcance', M, footerY + 4.5);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  setC(C.textoLt);
  doc.text('Página 1 de 1', pageW / 2, footerY + 4.5, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  setC(C.azul);
  doc.text(dateStr, pageW - M, footerY + 4.5, { align: 'right' });

  if (userName) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    setC(C.textoLt);
    doc.text(
      `Gerado por ${userName}`,
      pageW / 2,
      footerY + 8,
      { align: 'center' }
    );
  }

  // ═══════════════════════════════════════════════════════
  // SALVAR
  // ═══════════════════════════════════════════════════════
  const safeName = (business.name || 'plano')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  doc.save(`plano-${safeName}.pdf`);
};