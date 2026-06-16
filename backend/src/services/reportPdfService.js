import PDFDocument from 'pdfkit';

export function createReportPdf(report) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 54 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text(report.title, { align: 'center' });
    doc.moveDown();

    const sections = [
      ['Introduction', report.introduction],
      ['Literature Review', report.literatureReview],
      ['Methodology', report.methodology],
      ['Key Findings', report.keyFindings],
      ['Conclusion', report.conclusion]
    ];

    for (const [heading, body] of sections) {
      doc.fontSize(14).text(heading, { underline: true });
      doc.moveDown(0.4);
      doc.fontSize(11).text(body || 'Not generated.', { align: 'left' });
      doc.moveDown();
    }

    doc.end();
  });
}
