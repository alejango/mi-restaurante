const formatoPrecio = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
});

function crearElemento(tag, className, text) {
    const elemento = document.createElement(tag);
    if (className) elemento.className = className;
    if (text !== undefined) elemento.textContent = text;
    return elemento;
}

function rutaFoto(foto) {
    if (/^(https?:)?\/\//i.test(foto) || foto.startsWith('/')) return foto;
    return `/img/${foto.split(/[\\/]/).pop()}`;
}

function crearProducto(producto) {
    const tarjeta = crearElemento('article', 'producto');
    const imagenContenedor = crearElemento('div', 'producto-imagen');

    if (producto.foto) {
        const imagen = document.createElement('img');
        imagen.className = 'foto-plato';
        imagen.src = rutaFoto(producto.foto);
        imagen.alt = producto.descripcion;
        imagen.loading = 'lazy';
        imagen.addEventListener('error', () => {
            imagen.remove();
            imagenContenedor.classList.add('sin-foto');
            imagenContenedor.setAttribute('aria-label', 'Imagen no disponible');
        }, { once: true });
        imagenContenedor.appendChild(imagen);
    } else {
        imagenContenedor.classList.add('sin-foto');
        imagenContenedor.setAttribute('aria-label', 'Imagen no disponible');
    }

    const detalle = crearElemento('div', 'producto-detalle');
    detalle.appendChild(crearElemento('h3', 'nombre', producto.descripcion));

    const precios = crearElemento('div', 'precios');
    if (producto.precio_total !== null && producto.precio_total !== undefined) {
        const precio = crearElemento('p', 'precio');
        precio.appendChild(crearElemento('span', 'tipo-precio', 'Ración'));
        precio.appendChild(crearElemento('strong', '', formatoPrecio.format(producto.precio_total)));
        precios.appendChild(precio);
    }
    if (producto.precio_media !== null && producto.precio_media !== undefined) {
        const precio = crearElemento('p', 'precio precio-media');
        precio.appendChild(crearElemento('span', 'tipo-precio', 'Media ración'));
        precio.appendChild(crearElemento('strong', '', formatoPrecio.format(producto.precio_media)));
        precios.appendChild(precio);
    }

    detalle.appendChild(precios);
    tarjeta.append(imagenContenedor, detalle);
    return tarjeta;
}

function mostrarCarta(categorias) {
    const carta = document.getElementById('carta');
    const navegacion = document.getElementById('menu-categorias');
    const estado = document.getElementById('estado-carta');
    carta.replaceChildren();
    navegacion.replaceChildren();

    const categoriasConProductos = categorias.filter(categoria => categoria.productos.length);
    if (!categoriasConProductos.length) {
        estado.textContent = 'Estamos preparando nuestra carta. Vuelve a visitarnos pronto.';
        return;
    }

    estado.hidden = true;
    categoriasConProductos.forEach((categoria, indice) => {
        const enlace = document.createElement('a');
        enlace.href = `#categoria-${categoria.id}`;
        enlace.textContent = categoria.nombre;
        if (indice === 0) enlace.classList.add('activo');
        navegacion.appendChild(enlace);

        const seccion = crearElemento('section', 'categoria');
        seccion.id = `categoria-${categoria.id}`;
        seccion.setAttribute('aria-labelledby', `titulo-categoria-${categoria.id}`);

        const cabecera = crearElemento('div', 'categoria-cabecera');
        cabecera.appendChild(crearElemento('p', 'sobretitulo', 'DE NUESTRA COCINA'));
        const titulo = crearElemento('h2', '', categoria.nombre);
        titulo.id = `titulo-categoria-${categoria.id}`;
        cabecera.appendChild(titulo);
        seccion.appendChild(cabecera);

        const productos = crearElemento('div', 'productos');
        categoria.productos.forEach(producto => productos.appendChild(crearProducto(producto)));
        seccion.appendChild(productos);
        carta.appendChild(seccion);
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entradas => {
            const visible = entradas.find(entrada => entrada.isIntersecting);
            if (!visible) return;
            navegacion.querySelectorAll('a').forEach(enlace => {
                enlace.classList.toggle('activo', enlace.hash === `#${visible.target.id}`);
            });
        }, { rootMargin: '-20% 0px -65% 0px' });
        carta.querySelectorAll('.categoria').forEach(seccion => observer.observe(seccion));
    }
}

async function cargarCarta() {
    const estado = document.getElementById('estado-carta');
    try {
        const respuesta = await fetch('/carta');
        if (!respuesta.ok) throw new Error('No se pudo cargar la carta.');
        const categorias = await respuesta.json();
        mostrarCarta(categorias);
    } catch (error) {
        estado.textContent = 'No hemos podido cargar la carta. Comprueba tu conexión e inténtalo de nuevo.';
        estado.classList.add('error');
        console.error('Error al cargar la carta:', error);
    }
}

cargarCarta();
