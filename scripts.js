async function consultar() {
  const tipoInput = document.getElementById('tipo').value.trim();
  const docInput = document.getElementById('documento').value.trim();
  const resultado = document.getElementById('resultado');
  const loading = document.getElementById('loading');

  if (!tipoInput || !docInput) {
    resultado.innerHTML = "⚠️ Por favor selecciona un tipo y escribe uno o más números de documento.";
    return;
  }

  const tipos = tipoInput.split(',').map(t => t.trim());
  const documentos = docInput.split(',').map(d => d.trim());

  if (tipos.length !== documentos.length) {
    resultado.innerHTML = "⚠️ La cantidad de tipos debe coincidir con la cantidad de documentos ingresados.";
    return;
  }

  for (let doc of documentos) {
    if (!/^\d{5,15}$/.test(doc)) {
      resultado.innerHTML = `⚠️ El número de documento "${doc}" no es válido.`;
      return;
    }
  }

  resultado.innerHTML = "";
  loading.style.display = "block";

  try {
    const url = 'https://script.google.com/macros/s/AKfycbzp-0rHj-dTUh1rbn9P5UMWmIA4qV4M7lh1tk0ReqOHLoB3keu3MuYgARjrluU13cN2Iw/exec';
    const response = await fetch(`${url}?tipo=${tipos.join(',')}&documento=${documentos.join(',')}`);
    const data = await response.json();
    loading.style.display = "none";

    if (!Array.isArray(data)) {
      resultado.innerHTML = `<div class="error-message">❌ Error inesperado en la respuesta.</div>`;
      return;
    }

    if (data.length === 0) {
      resultado.innerHTML = "ℹ️ No se encontraron certificados.";
      return;
    }

    let html = '<div class="certificados-container">';
    for (const item of data) {
      html += `
        <div class="certificado">
          <p><strong>Tipo:</strong> ${item.tipo}</p>
          <p><strong>Documento:</strong> ${item.documento}</p>
          ${item.nombre ? `<p><strong>Archivo:</strong> ${item.nombre}</p>` : ""}
          ${item.fecha ? `<p><strong>Fecha de creación:</strong> ${item.fecha}</p>` : ""}
          ${item.url 
            ? `<a href="${item.url}" class="download-btn" target="_blank">📄 Descargar certificado</a>`
            : `<div class="error-message">❌ ${item.error}</div>`}
        </div>`;
    }
    html += '</div>';
    resultado.innerHTML = html;

  } catch (err) {
    loading.style.display = "none";
    resultado.innerHTML = `<div class="error-message">❌ Error al consultar certificados.</div>`;
    console.error(err);
  }
}
