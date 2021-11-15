function generateQR(text, element) {
  const qrcode = new QRCode(element, {
    text: text,
    width: 300,
    height: 300,
    colorDark: '#002675',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.L,
  });
}

function updateQRCodes() {
  $('#qrCodes').html('');
  const urlBase = $('#urlBase').val();
  const rangeStart = parseInt($('#rangeStart').val());
  const rangeEnd = _.trim($('#rangeEnd').val()) === '' ? rangeStart : parseInt($('#rangeEnd').val());
  const range = _.range(rangeStart, rangeEnd + 1);

  const firstQrText = range[0] === undefined ? urlBase : `${urlBase}?corr=${range[0]}`;
  $('#firstQRText').html(firstQrText);

  // si no hay ningún rango, solo genera un qr basado en la url sin parámetros
  if (range.length === 0) {
    $('#qrCodes').append(`<div id="qrCode" class="qrCode"></div>`);
    generateQR(firstQrText, 'qrCode');
  }

  range.map(function (corr) {
    const qrText = `${urlBase}?corr=${corr}`;
    $('#qrCodes').append(`<div id="qrCode${corr}" class="qrCode"></div>`);
    generateQR(qrText, `qrCode${corr}`);
  });
}

function generateQRForPDF(doc, x, y, qrId) {
  doc.setDrawColor(245, 91, 2);
  doc.rect(x, y, 40, 40);
  doc.text('¿Tienes problemas?', x + 4, y + 32);
  doc.text('¡Escanéame!', x + 10, y + 36);

  const base64Image = $(`#${qrId} img`).attr('src');
  doc.addImage(base64Image, 'png', x + 7.5, y + 3, 25, 25);
  const imageFactor = 60;
  doc.addImage('logo.png', 'png', x + 31.5, y + 35, 516 / imageFactor, 212 / imageFactor);
}

function generatePDF() {
  const doc = new jspdf.jsPDF({
    unit: 'mm',
    format: [1000, 1000],
  });

  doc.setFont('SourceSansPro', 'bold');
  doc.setFontSize(10);

  let x = 3;
  let y = -42;
  $('.qrCode').each(function (index) {
    x = index % 22 === 0 ? 3 : x + 45;
    y = index % 22 === 0 ? y + 45 : y;
    generateQRForPDF(doc, x, y, $(this).attr('id'));
  });

  doc.save('doc.pdf');
}

$(document).ready(function () {
  updateQRCodes();
  $('#urlBase, #rangeStart, #rangeEnd').on('change keydown paste input', function () {
    updateQRCodes();
  });
  $('#generatePDF').click(function () {
    generatePDF();
  });
});
