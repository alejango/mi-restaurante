// 🔐 1) Comprobar si hay token. Si no, redirigir al login.
const token = localStorage.getItem("token");
if (!token) {
    window.location = "login.html";
}

let categoriasDisponibles = [];
let productosParaUrls = [];

function escaparHTML(valor) {
    return String(valor).replace(/[&<>"']/g, caracter => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caracter]);
}

async function enviarSolicitud(url, opciones = {}) {
    const res = await fetch(url, {
        ...opciones,
        headers: {
            ...(opciones.headers || {}),
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'No se pudo completar la operación.');
    return data;
}

function mostrarMensajeCategorias(texto, esError = false) {
    const mensaje = document.getElementById('mensaje-categorias');
    mensaje.textContent = texto;
    mensaje.classList.toggle('error', esError);
}

function rutaFotoAdmin(foto) {
    if (!foto) return '';
    if (/^(https?:)?\/\//i.test(foto) || foto.startsWith('/')) return foto;
    return `/img/${foto.split(/[\\/]/).pop()}`;
}

function buscarEnUnsplash(id) {
    const producto = productosParaUrls.find(item => item.id === id);
    if (!producto) return;
    window.open(
        `https://unsplash.com/s/photos/${encodeURIComponent(producto.descripcion)}`,
        '_blank',
        'noopener,noreferrer'
    );
}

function alternarEditorUrlsFotos() {
    const panel = document.getElementById('urls-fotos-panel');
    const boton = document.getElementById('boton-urls-fotos');
    const mostrar = panel.hidden;
    panel.hidden = !mostrar;
    boton.setAttribute('aria-expanded', String(mostrar));
    if (mostrar) cargarEditorUrlsFotos();
}

async function cargarEditorUrlsFotos() {
    const contenedor = document.getElementById('urls-fotos-productos');
    const mensaje = document.getElementById('mensaje-urls-fotos');
    mensaje.textContent = 'Cargando productos…';
    mensaje.classList.remove('error');

    try {
        productosParaUrls = await enviarSolicitud('/productos');
        contenedor.innerHTML = productosParaUrls.map(producto => `
            <article class="url-foto-producto">
                <div class="url-foto-vista">
                    ${producto.foto
                        ? `<img src="${escaparHTML(rutaFotoAdmin(producto.foto))}" alt="" onerror="this.hidden=true; this.nextElementSibling.hidden=false">`
                        : ''}
                    <span ${producto.foto ? 'hidden' : ''}>Sin foto</span>
                </div>
                <div class="url-foto-campos">
                    <strong>${escaparHTML(producto.descripcion)}</strong>
                    <label class="campo-admin" for="url-foto-${producto.id}">URL o nombre de archivo
                        <input id="url-foto-${producto.id}" value="${escaparHTML(producto.foto || '')}" placeholder="https://… o foto.jpg">
                    </label>
                    <div class="url-foto-acciones">
                        <button type="button" onclick="buscarEnUnsplash(${producto.id})">Buscar en Unsplash</button>
                        <button type="button" onclick="guardarUrlFoto(${producto.id})">Guardar URL</button>
                    </div>
                </div>
            </article>
        `).join('');
        mensaje.textContent = productosParaUrls.length ? '' : 'No hay productos para mostrar.';
    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.classList.add('error');
    }
}

async function guardarUrlFoto(id) {
    const producto = productosParaUrls.find(item => item.id === id);
    const mensaje = document.getElementById('mensaje-urls-fotos');
    if (!producto) {
        mensaje.textContent = 'No se encontró el producto. Vuelve a cargar el editor.';
        mensaje.classList.add('error');
        return;
    }

    const foto = document.getElementById(`url-foto-${id}`).value.trim();
    try {
        await enviarSolicitud(`/productos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                descripcion: producto.descripcion,
                idcategoria: producto.idcategoria,
                precio_total: producto.precio_total,
                precio_media: producto.precio_media,
                foto
            })
        });
        producto.foto = foto;
        mensaje.textContent = `URL guardada para «${producto.descripcion}».`;
        mensaje.classList.remove('error');
        await cargarEditorUrlsFotos();
    } catch (error) {
        mensaje.textContent = error.message;
        mensaje.classList.add('error');
    }
}

async function cargarCategorias() {
    try {
        categoriasDisponibles = await enviarSolicitud('/categorias');
        const contenedor = document.getElementById('categorias-admin');
        contenedor.innerHTML = categoriasDisponibles.map(categoria => `
            <div class="categoria-admin">
                <label class="campo-admin">Código (solo lectura)
                    <input value="${categoria.id}" readonly>
                </label>
                <label class="campo-admin">Categoría
                    <input id="categoria-${categoria.id}" value="${escaparHTML(categoria.nombre)}" aria-label="Nombre de la categoría">
                </label>
                <button onclick="guardarCategoria(${categoria.id})">Guardar</button>
                <button class="boton-eliminar" onclick="borrarCategoria(${categoria.id})">Eliminar</button>
            </div>
        `).join('');
        actualizarOpcionesCategorias();
    } catch (error) {
        mostrarMensajeCategorias(error.message, true);
    }
}

function actualizarOpcionesCategorias() {
    const selectores = [
        document.getElementById('nuevo-idcat'),
        ...document.querySelectorAll('.producto-categoria')
    ];

    selectores.forEach(selector => {
        const seleccionado = selector.value;
        selector.innerHTML = categoriasDisponibles.map(categoria => `
            <option value="${categoria.id}">${escaparHTML(categoria.nombre)} (código ${categoria.id})</option>
        `).join('');
        if (categoriasDisponibles.some(categoria => String(categoria.id) === seleccionado)) {
            selector.value = seleccionado;
        }
    });
}

async function crearCategoria() {
    const campo = document.getElementById('nueva-categoria-nombre');
    const nombre = campo.value.trim();
    if (!nombre) {
        mostrarMensajeCategorias('Escribe el nombre de la categoría.', true);
        return;
    }

    try {
        await enviarSolicitud('/categorias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        });
        campo.value = '';
        mostrarMensajeCategorias('Categoría añadida.');
        await cargarCategorias();
    } catch (error) {
        mostrarMensajeCategorias(error.message, true);
    }
}

async function guardarCategoria(id) {
    const nombre = document.getElementById(`categoria-${id}`).value.trim();
    if (!nombre) {
        mostrarMensajeCategorias('El nombre de la categoría no puede estar vacío.', true);
        return;
    }

    try {
        await enviarSolicitud(`/categorias/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        });
        mostrarMensajeCategorias('Categoría actualizada.');
        await cargarCategorias();
    } catch (error) {
        mostrarMensajeCategorias(error.message, true);
    }
}

async function borrarCategoria(id) {
    if (!window.confirm('¿Seguro que quieres eliminar esta categoría?')) return;

    try {
        await enviarSolicitud(`/categorias/${id}`, { method: 'DELETE' });
        mostrarMensajeCategorias('Categoría eliminada.');
        await cargarCategorias();
    } catch (error) {
        mostrarMensajeCategorias(error.message, true);
    }
}

// 🔐 2) Función para cargar productos con token
async function cargarProductos() {
    try {
        const productos = await enviarSolicitud('/productos');
        const admin = document.getElementById('admin');
        admin.innerHTML = productos.map(p => `
                <div class="producto-admin">
                    ${p.foto ? `<img src="${escaparHTML(p.foto)}" class="foto-admin" alt="">` : ''}
                    <label class="campo-admin">Producto
                        <input id="desc-${p.id}" value="${escaparHTML(p.descripcion)}">
                    </label>
                    <label class="campo-admin">Precio total
                        <input id="precio-${p.id}" type="number" step="0.01" value="${p.precio_total ?? ''}">
                    </label>
                    <label class="campo-admin">Precio media ración
                        <input id="media-${p.id}" type="number" step="0.01" value="${p.precio_media ?? ''}">
                    </label>
                    <label class="campo-admin">Categoría
                        <select id="cat-${p.id}" class="producto-categoria" aria-label="Categoría de ${escaparHTML(p.descripcion)}">
                            ${categoriasDisponibles.map(categoria => `
                                <option value="${categoria.id}" ${categoria.id === p.idcategoria ? 'selected' : ''}>
                                    ${escaparHTML(categoria.nombre)} (código ${categoria.id})
                                </option>
                            `).join('')}
                        </select>
                    </label>
                    <label class="campo-admin">Foto
                        <input id="foto-${p.id}" value="${escaparHTML(p.foto || '')}">
                    </label>

                    <button onclick="guardar(${p.id})">Guardar</button>
                    <button onclick="borrar(${p.id})">Eliminar</button>
                </div>
            `).join('');
    } catch (error) {
        const admin = document.getElementById('admin');
        admin.textContent = error.message;
        admin.classList.add('error');
    }
}

// 🔐 3) Guardar producto con token
function guardar(id) {
    const descripcion = document.getElementById(`desc-${id}`).value;
    const precio_total = document.getElementById(`precio-${id}`).value;
    const precio_media = document.getElementById(`media-${id}`).value;
    const idcategoria = document.getElementById(`cat-${id}`).value;
    const foto = document.getElementById(`foto-${id}`).value;

    fetch(`/productos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ descripcion, precio_total, precio_media, idcategoria, foto })
    }).then(() => cargarProductos());
}

// 🔐 4) Borrar producto con token
function borrar(id) {
    fetch(`/productos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(() => cargarProductos());
}

// 🔐 5) Crear producto con token
function crearProducto() {
    const descripcion = document.getElementById('nuevo-desc').value;
    const precio_total = document.getElementById('nuevo-precio').value;
    const precio_media = document.getElementById('nuevo-media').value;
    const idcategoria = document.getElementById('nuevo-idcat').value;
    const foto = document.getElementById('nuevo-foto').value;

    fetch('/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            descripcion,
            precio_total,
            precio_media,
            idcategoria,
            foto
        })
    }).then(() => cargarProductos());
}

// 🔐 6) Cargar categorías antes de los productos para preparar sus selectores
(async function iniciarPanel() {
    await cargarCategorias();
    await cargarProductos();
})();
