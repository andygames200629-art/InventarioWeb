// ===== CONFIGURACIÓN =====
const API_URL = 'http://localhost:8081/api/productos';

// ===== VARIABLES GLOBALES =====
let productos = [];
let idEditando = null; // null = modo registrar, con valor = modo editar

// ===== AL CARGAR LA PÁGINA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Página cargada');
    cargarProductos();       // ahora trae datos reales del backend
    activarFormulario();
    revisarModoEdicion();    // ✅ NUEVO: revisa si venimos a editar
});

// ===== CARGAR PRODUCTOS DESDE LA API =====
function cargarProductos() {
    fetch(API_URL)
        .then(respuesta => {
            if (!respuesta.ok) throw new Error('Error al consultar la API: ' + respuesta.status);
            return respuesta.json();
        })
        .then(datos => {
            productos = datos;
            console.log('✅ Productos cargados:', productos.length, productos);
            actualizarContadores();
            dibujarTablaProductos();
            cargarOpcionesCategorias();
            conectarEventosConsultas(); // ⚠️ ESTA LÍNEA ES LA CLAVE
        })
        .catch(error => {
            console.error('❌ No se pudo conectar con la API:', error);
        });
}

// ===== CONTADORES ===
function actualizarContadores() {
    const elTotal = document.getElementById("totalProductos");
    const elDisp = document.getElementById("totalDisponibles");
    const elAgot = document.getElementById("totalAgotados");

    if (elTotal) elTotal.textContent = productos.length;
    if (elDisp) elDisp.textContent = productos.filter(p => p.cantidad > 0).length;
    if (elAgot) elAgot.textContent = productos.filter(p => p.cantidad === 0).length;
    console.log('📊 Contadores actualizados ✅');
}

// ===== DIBUJAR TABLA =====
function dibujarTablaProductos() {
    const cuerpo = document.getElementById('tablaProductos');
    const totalElemento = document.getElementById('valorTotalGeneral');

    if (!cuerpo) {
        console.log('ℹ️ No hay tabla aquí (página de Inicio)');
        return;
    }

    console.log('🎯 Dibujando tabla... Productos:', productos);
    cuerpo.innerHTML = '';
    let sumaTotal = 0;

    productos.forEach((prod) => {
        const subtotal = prod.precio * prod.cantidad;
        sumaTotal += subtotal;

        let estado, clase;
        if (prod.cantidad === 0) {
            estado = 'Agotado'; clase = 'text-danger';
        } else if (prod.cantidad < 5) {
            estado = 'Bajo stock'; clase = 'text-warning';
        } else {
            estado = 'Disponible'; clase = 'text-success';
        }

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${prod.codigo}</td>
            <td>${prod.nombre}</td>
            <td>${prod.categoria}</td>
            <td>$${prod.precio.toLocaleString('es-CO')}</td>
            <td>${prod.cantidad}</td>
            <td class="${clase} fw-bold">${estado}</td>
            <td>$${subtotal.toLocaleString('es-CO')}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editarProducto(${prod.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${prod.id})">Eliminar</button>
            </td>
        `;
        cuerpo.appendChild(fila);
    });

    if (totalElemento) {
        totalElemento.textContent = `Valor Total del Inventario: $${sumaTotal.toLocaleString('es-CO')}`;
    }
    console.log('✅ Tabla dibujada. Filas:', productos.length);
}

// ===== IR A EDITAR (desde productos.html) =====
function editarProducto(id) {
    window.location.href = `registrar.html?id=${id}`;
}

// ===== REVISAR SI VENIMOS EN MODO EDICIÓN (en registrar.html) =====
function revisarModoEdicion() {
    const formulario = document.getElementById('formProducto');
    if (!formulario) return; // esta función solo aplica en registrar.html

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');

    if (!id) return; // no hay id → modo registrar normal

    idEditando = id;
    console.log('✏️ Modo edición activado para ID:', id);

    // Traer los datos del producto y llenar el formulario
    fetch(`${API_URL}/${id}`)
        .then(respuesta => {
            if (!respuesta.ok) throw new Error('Error al buscar el producto: ' + respuesta.status);
            return respuesta.json();
        })
        .then(prod => {
            document.getElementById('codigo').value = prod.codigo;
            document.getElementById('nombre').value = prod.nombre;
            document.getElementById('categoria').value = prod.categoria;
            document.getElementById('precio').value = prod.precio;
            document.getElementById('cantidad').value = prod.cantidad;

            // Cambiar textos para que se note que estamos editando
            const boton = formulario.querySelector('button[type="submit"]');
            if (boton) boton.textContent = '💾 Actualizar Producto';

            const titulo = document.querySelector('h1');
            if (titulo) titulo.textContent = 'Editar Producto';
        })
        .catch(error => {
            console.error('❌ No se pudo cargar el producto a editar:', error);
            alert('❌ No se encontró el producto solicitado.');
        });
}

// ===== FORMULARIO DE REGISTRO / EDICIÓN =====
function activarFormulario() {
    const formulario = document.getElementById('formProducto');
    if (!formulario) return;

    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        const codigo = document.getElementById('codigo').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const categoria = document.getElementById('categoria').value;
        const precio = parseFloat(document.getElementById('precio').value);
        const cantidad = parseInt(document.getElementById('cantidad').value);

        if (!codigo || !nombre || !categoria || isNaN(precio) || isNaN(cantidad)) {
            alert('⚠️ Completa todos los campos.');
            return;
        }

        const datosProducto = { codigo, nombre, categoria, precio, cantidad };

        // ✅ Si idEditando tiene valor → PUT (actualizar). Si no → POST (crear)
        const url = idEditando ? `${API_URL}/${idEditando}` : API_URL;
        const metodo = idEditando ? 'PUT' : 'POST';

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosProducto)
        })
            .then(respuesta => {
                if (!respuesta.ok) throw new Error('Error al guardar: ' + respuesta.status);
                return respuesta.json();
            })
            .then(guardado => {
                if (idEditando) {
                    console.log('✅ Producto actualizado en la BD:', guardado);
                    alert('✅ Producto actualizado: ' + guardado.nombre);
                } else {
                    console.log('✅ Producto guardado en la BD:', guardado);
                    alert('✅ Producto guardado: ' + guardado.nombre);
                }
                window.location.href = 'productos.html'; // regresa al listado
            })
            .catch(error => {
                console.error('❌ Error al guardar:', error);
                alert('❌ No se pudo guardar el producto.');
            });
    });
}

// ===== ELIMINAR PRODUCTO =====
function eliminarProducto(id) {
    if (!confirm('¿Eliminar este producto?')) return;

    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(respuesta => {
            if (!respuesta.ok) throw new Error('Error al eliminar: ' + respuesta.status);
            console.log('✅ Producto eliminado, ID:', id);
            cargarProductos(); // recarga la lista real
        })
        .catch(error => {
            console.error('❌ Error al eliminar:', error);
            alert('❌ No se pudo eliminar el producto.');
        });
}
// =====================================================
// ✅ FUNCIONES QUE FALTABAN
// =====================================================

// Cargar categorías en el desplegable
function cargarOpcionesCategorias() {
    const select = document.getElementById('filtroCategoria');
    if (!select) return;
    
    const categorias = [...new Set(productos.map(p => p.categoria))];
    select.innerHTML = '<option value="">-- Todas las categorías --</option>';
    categorias.forEach(cat => {
        select.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
    console.log('📂 Categorías cargadas:', categorias);
}

// Mostrar resultados en la tabla de consultas
function mostrarResultados(lista) {
    const tabla = document.getElementById('tablaResultados');
    if (!tabla) return;

    console.log('📋 Mostrando:', lista.length, 'resultados');

    if (lista.length === 0) {
        tabla.innerHTML = `<tr><td colspan="7" class="text-center text-muted fst-italic">
            ❌ No se encontraron productos
        </td></tr>`;
        return;
    }

    tabla.innerHTML = lista.map(p => {
        const estado = p.cantidad === 0 ? '❌ Agotado' : p.cantidad < 5 ? '⚠️ Bajo stock' : '✅ Disponible';
        const clase = p.cantidad === 0 ? 'text-danger' : p.cantidad < 5 ? 'text-warning' : 'text-success';
        return `
        <tr>
            <td>${p.codigo}</td>
            <td>${p.nombre}</td>
            <td>${p.categoria}</td>
            <td>$${p.precio.toLocaleString('es-CO')}</td>
            <td>${p.cantidad}</td>
            <td class="${clase} fw-bold">${estado}</td>
            <td>$${(p.precio * p.cantidad).toLocaleString('es-CO')}</td>
        </tr>`;
    }).join('');
}

// ===== EXPORTAR A EXCEL =====
function exportarExcel() {
    if (!productos || productos.length === 0) {
        alert('⚠️ No hay productos para exportar.');
        return;
    }

    // Preparamos los datos con encabezados en español
    const datosExcel = productos.map(p => {
        let estado;
        if (p.cantidad === 0) estado = 'Agotado';
        else if (p.cantidad < 5) estado = 'Bajo stock';
        else estado = 'Disponible';

        return {
            'Código': p.codigo,
            'Nombre': p.nombre,
            'Categoría': p.categoria,
            'Precio': p.precio,
            'Cantidad': p.cantidad,
            'Estado': estado,
            'Valor Total': p.precio * p.cantidad
        };
    });

    // Creamos la hoja y el libro
    const hoja = XLSX.utils.json_to_sheet(datosExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Inventario');

    // Ajustamos ancho de columnas automáticamente
    hoja['!cols'] = [
        { wch: 10 }, // Código
        { wch: 25 }, // Nombre
        { wch: 15 }, // Categoría
        { wch: 12 }, // Precio
        { wch: 10 }, // Cantidad
        { wch: 12 }, // Estado
        { wch: 14 }  // Valor Total
    ];

    // Generamos el archivo con fecha en el nombre
    const fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(libro, `inventario_${fecha}.xlsx`);

    console.log('✅ Excel exportado:', productos.length, 'productos');
}

// Conectar todos los botones de búsqueda
function conectarEventosConsultas() {
    console.log('🔗 Eventos de búsqueda listos ✅ Total productos:', productos.length);

    // Buscar por NOMBRE
    document.getElementById('btnBuscarNombre')?.addEventListener('click', () => {
        const texto = document.getElementById('buscarNombre').value.trim().toLowerCase();
        console.log('🔍 Buscando por nombre:', texto);
        const res = productos.filter(p => p.nombre.toLowerCase().includes(texto));
        console.log('✅ Encontrados:', res.length);
        mostrarResultados(res);
    });

    // Buscar por CÓDIGO
    document.getElementById('btnBuscarCodigo')?.addEventListener('click', () => {
        const cod = document.getElementById('buscarCodigo').value.trim();
        console.log('🔍 Buscando por código:', cod);
        const res = productos.filter(p => p.codigo === cod);
        mostrarResultados(res);
    });

    // Filtrar por CATEGORÍA
    document.getElementById('btnFiltrarCategoria')?.addEventListener('click', () => {
        const cat = document.getElementById('filtroCategoria').value;
        console.log('📂 Filtrar por categoría:', cat);
        const res = cat ? productos.filter(p => p.categoria === cat) : productos;
        mostrarResultados(res);
    });

    // Filtrar por ESTADO
    document.getElementById('btnFiltrarEstado')?.addEventListener('click', () => {
        const estado = document.getElementById('filtroEstado').value;
        console.log('🔘 Filtrar por estado:', estado);
        let res = productos;
        if (estado === 'Disponible') res = productos.filter(p => p.cantidad > 0);
        else if (estado === 'Agotado') res = productos.filter(p => p.cantidad === 0);
        else if (estado === 'Bajo stock') res = productos.filter(p => p.cantidad > 0 && p.cantidad < 5);
        mostrarResultados(res);
    });

    // Stock BAJO
    document.getElementById('btnStockBajo')?.addEventListener('click', () => {
        const res = productos.filter(p => p.cantidad > 0 && p.cantidad <= 5);
        mostrarResultados(res);
    });

    // Mostrar TODOS
    document.getElementById('btnMostrarTodos')?.addEventListener('click', () => {
        mostrarResultados(productos);
    });

    // RESTABLECER
    document.getElementById('btnRestablecer')?.addEventListener('click', () => {
        document.getElementById('buscarNombre').value = '';
        document.getElementById('buscarCodigo').value = '';
        document.getElementById('filtroCategoria').value = '';
        document.getElementById('filtroEstado').value = '';
        document.getElementById('tablaResultados').innerHTML = `<tr><td colspan="7" class="text-center text-muted fst-italic">
            🔎 Realiza una búsqueda para ver resultados...
        </td></tr>`;
    });

    // Exportar a Excel
    document.getElementById('btnExportarExcel')?.addEventListener('click', () => {
        exportarExcel();
    });
}