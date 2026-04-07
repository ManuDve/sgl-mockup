// Lógica del Panel Administrativo

// Estado del administrador
const adminState = {
    logueado: false,
    adminActual: null,
    agendamientoSeleccionado: null,
    preciosEditables: {}
};

// Credenciales de prueba
const adminCredenciales = {
    email: 'admin@estudiojuridico.cl',
    password: 'admin123'
};

// Función de login
function loginAdmin(event) {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    if (email === adminCredenciales.email && password === adminCredenciales.password) {
        adminState.logueado = true;
        adminState.adminActual = { email, nombre: 'Administrador' };
        navegar('adminDashboard');
        mostrarNotificacion('Bienvenido al panel administrativo', 'success');
    } else {
        mostrarNotificacion('Email o contraseña incorrectos', 'error');
    }
}

// Función de logout
function logoutAdmin() {
    adminState.logueado = false;
    adminState.adminActual = null;
    navegar('home');
    mostrarNotificacion('Sesión cerrada', 'info');
}

// Alias para compatibilidad con app.js
function cerrarSesion() {
    logoutAdmin();
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notif = document.createElement('div');
    notif.className = `fixed top-4 right-4 p-4 rounded-lg text-white ${
        tipo === 'success' ? 'bg-green-600' : 
        tipo === 'error' ? 'bg-red-600' : 
        'bg-blue-600'
    } shadow-lg z-50 fade-in`;
    notif.textContent = mensaje;
    document.body.appendChild(notif);

    setTimeout(() => notif.remove(), 3000);
}

// Abrir modal de confirmación de pago
function abrirModalPago(agendamientoId) {
    const agendamiento = appData.agendamientos.find(a => a.id === agendamientoId);
    if (agendamiento) {
        adminState.agendamientoSeleccionado = agendamiento;
        document.getElementById('modalAgendamientoId').textContent = agendamientoId;
        document.getElementById('modalClienteNombre').textContent = agendamiento.nombre;
        document.getElementById('inputMontoConfirmado').value = agendamiento.monto;
        abrirModal('modalPago');
    }
}

// Procesar confirmación de pago
function procesarConfirmacionPago(event) {
    event.preventDefault();

    const transaccion = document.getElementById('inputTransaccion').value;
    const monto = parseInt(document.getElementById('inputMontoConfirmado').value);

    if (adminState.agendamientoSeleccionado) {
        adminState.agendamientoSeleccionado.estado = 'Confirmado';
        adminState.agendamientoSeleccionado.transaccion = transaccion;
        adminState.agendamientoSeleccionado.montoConfirmado = monto;
        adminState.agendamientoSeleccionado.fechaConfirmacion = new Date();

        cerrarModal('modalPago');
        navegar('adminAgendamientos');
        mostrarNotificacion('Pago confirmado exitosamente', 'success');
    }
}

// Abrir modal de cotización
function abrirModalCotizacion(agendamientoId) {
    const agendamiento = appData.agendamientos.find(a => a.id === agendamientoId);
    if (agendamiento) {
        adminState.agendamientoSeleccionado = agendamiento;
        document.getElementById('cotClienteNombre').value = agendamiento.nombre;
        document.getElementById('cotClienteEmail').value = agendamiento.email;
        document.getElementById('cotDescripcion').value = '';
        document.getElementById('cotCosto').value = agendamiento.monto;
        document.getElementById('cotPlazo').value = '15 días hábiles';
        abrirModal('modalCotizacion');
    }
}

// Generar cotización (simular descarga PDF)
function generarCotizacion(event) {
    event.preventDefault();

    if (adminState.agendamientoSeleccionado) {
        const cotizacion = {
            id: 'COT-' + Date.now(),
            agendamiento: adminState.agendamientoSeleccionado.id,
            cliente: document.getElementById('cotClienteNombre').value,
            email: document.getElementById('cotClienteEmail').value,
            descripcion: document.getElementById('cotDescripcion').value,
            costo: parseInt(document.getElementById('cotCosto').value),
            plazo: document.getElementById('cotPlazo').value,
            fecha: new Date()
        };

        // Guardar cotización
        if (!appData.cotizaciones) appData.cotizaciones = [];
        appData.cotizaciones.push(cotizacion);

        // Marcar agendamiento como con cotización
        adminState.agendamientoSeleccionado.cotizacion = cotizacion.id;

        cerrarModal('modalCotizacion');
        mostrarNotificacion('Cotización generada y descargada', 'success');
        navegar('adminAgendamientos');
    }
}

// Cambiar estado de agendamiento
function cambiarEstadoAgendamiento(agendamientoId, nuevoEstado) {
    const agendamiento = appData.agendamientos.find(a => a.id === agendamientoId);
    if (agendamiento) {
        agendamiento.estado = nuevoEstado;
        mostrarNotificacion(`Estado actualizado a: ${nuevoEstado}`, 'success');
        navegar('adminAgendamientos');
    }
}

// Actualizar precio de materia
function actualizarPrecioMateria(servicioId, nuevoPrecio) {
    const servicio = appData.servicios.find(s => s.id === parseInt(servicioId));
    if (servicio) {
        const precioAnterior = servicio.precio;
        servicio.precio = parseInt(nuevoPrecio);

        // Guardar en historial
        if (!appData.historialPrecios) appData.historialPrecios = [];
        appData.historialPrecios.push({
            servicio: servicio.nombre,
            precioAnterior,
            precioNuevo: nuevoPrecio,
            fecha: new Date()
        });

        mostrarNotificacion(`Precio actualizado: ${servicio.nombre}`, 'success');
        navegar('adminServicios');
    }
}

// Abrir/cerrar modal
function abrirModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function cerrarModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Calcular estadísticas del dashboard
function calcularEstadisticas() {
    const total = appData.agendamientos.length;
    const pendientes = appData.agendamientos.filter(a => a.estado === 'Pendiente Pago').length;
    const confirmados = appData.agendamientos.filter(a => a.estado === 'Confirmado').length;
    const cancelados = appData.agendamientos.filter(a => a.estado === 'Cancelado').length;

    const ingresoTotal = appData.agendamientos
        .filter(a => a.estado === 'Confirmado')
        .reduce((sum, a) => sum + (a.monto || 0), 0);

    return { total, pendientes, confirmados, cancelados, ingresoTotal };
}

// Formatear fecha
function formatearFecha(fecha) {
    if (typeof fecha === 'string') fecha = new Date(fecha);
    return fecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Formatear hora
function formatearHora(fecha) {
    if (typeof fecha === 'string') fecha = new Date(fecha);
    return fecha.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
}
