const PDFDocument = require('pdfkit');

/**
 * Generates a PDF report from the daily orders data.
 * @param {Array} reportData - Array of order objects.
 * @returns {Promise<Buffer>} - A promise that resolves to a PDF buffer.
 */
async function generatePdfReport(reportData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];

      // Collect the PDF data as buffers
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Title
      doc.fontSize(20).text('Daily Report', { align: 'center' });
      doc.moveDown();

      // Iterate through the report data and add each order's details
      reportData.forEach((order, index) => {
        doc.fontSize(14).text(`Order ${ order.orderNumber}`, { underline: true });
        doc.moveDown(0.5);

        // Order details with labels
        doc.fontSize(12)
          .text(`Order Details ID: ${order._id}`)
          .text(`Seller: ${order.orderId.seller}`)
          .text(`Price: ${order.orderId.price}`)
          .text(`Total Amount: ${order.totalAmount}`)
          .text(`Amount Paid: ${order.amountPaid}`)
          .text(`Status: ${order.status}`)
          .text(`Created At: ${new Date(order.createdAt).toLocaleString()}`);
        doc.moveDown();
      });

      // End the document
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = generatePdfReport;
