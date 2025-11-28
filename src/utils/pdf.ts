export async function exportSectionToPDF(node: HTMLElement, title = 'SarantosCulculator Export') {
  const w = window.open('', 'printWindow');
  if (!w) return;
  const styles = Array.from(document.styleSheets)
    .map((s: CSSStyleSheet) => (s.href ? `<link rel="stylesheet" href="${s.href}">` : ''))
    .join('\n');
  w.document.write(`
    <html>
      <head>
        <title>${title}</title>
        ${styles}
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          body { padding: 24px; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
        </style>
      </head>
      <body>${node.outerHTML}</body>
    </html>
  `);
  w.document.close();
  w.focus();
  setTimeout(() => {
    w.print();
    w.close();
  }, 300);
}
