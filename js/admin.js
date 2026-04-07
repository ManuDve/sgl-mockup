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

// Utilidades de UI: carga simulada (delay) y estado de procesamiento
const UI = {
    delay(ms = 650) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    setBtnLoading(btn, loading, labelLoading = 'Procesando...') {
        if (!btn) return;
        if (loading) {
            btn.dataset.prevDisabled = String(btn.disabled);
            btn.dataset.prevHtml = btn.innerHTML;
            btn.disabled = true;
            btn.classList.add('opacity-75', 'cursor-not-allowed');
            btn.innerHTML = `
                <span class="inline-flex items-center gap-2">
                    <span class="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                    <span>${labelLoading}</span>
                </span>
            `;
        } else {
            const prev = btn.dataset.prevHtml;
            btn.disabled = (btn.dataset.prevDisabled === 'true');
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
            if (prev) btn.innerHTML = prev;
        }
    },
    showModalLoading(modalId, { titulo = 'Cargando', texto = 'Obteniendo información...' } = {}) {
        const modal = document.getElementById(modalId);
        const body = document.getElementById(modalId + 'Body');
        if (!modal || !body) return;
        modal.classList.add('active');
        body.innerHTML = `
            <div class="flex items-start justify-between gap-4">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900">${titulo}</h2>
                    <p class="text-sm text-gray-600 mt-1">${texto}</p>
                </div>
                <button class="text-gray-500 hover:text-gray-700 text-2xl leading-none" onclick="cerrarModal('${modalId}')" aria-label="Cerrar">&times;</button>
            </div>
            <div class="mt-6 flex items-center gap-3 text-sm text-gray-700">
                <span class="inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></span>
                <span>Procesando...</span>
            </div>
        `;
    }
};

// Modal decente para detalle de agendamiento (dashboard/calendario/historial)
async function adminAbrirDetalleAgendamiento(agendamientoId) {
    const modalId = 'modalDetalleAgendamiento';
    const modal = document.getElementById(modalId);
    const body = document.getElementById('modalDetalleAgendamientoBody');

    if (!modal || !body) {
        mostrarNotificacion('No se pudo abrir el detalle (modal no disponible)', 'error');
        return;
    }

    // Loading
    modal.classList.add('active');
    body.innerHTML = `
        <div class="flex items-start justify-between gap-4">
            <div>
                <h2 class="text-xl font-semibold text-gray-900">Detalle de agendamiento</h2>
                <p class="text-sm text-gray-600 mt-1">Cargando información...</p>
            </div>
            <button class="text-gray-500 hover:text-gray-700 text-2xl leading-none" onclick="cerrarModalDetalleAgendamiento()" aria-label="Cerrar">&times;</button>
        </div>
        <div class="mt-6 flex items-center gap-3 text-sm text-gray-700">
            <span class="inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></span>
            <span>Obteniendo datos del agendamiento...</span>
        </div>
    `;

    await UI.delay(650);

    const ag = appData.agendamientos.find(a => a.id === agendamientoId);

    if (!ag) {
        body.innerHTML = `
            <div class="flex items-start justify-between gap-4">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900">Detalle de agendamiento</h2>
                    <p class="text-sm text-gray-600 mt-1">No se encontró el registro.</p>
                </div>
                <button class="text-gray-500 hover:text-gray-700 text-2xl leading-none" onclick="cerrarModalDetalleAgendamiento()" aria-label="Cerrar">&times;</button>
            </div>
            <div class="mt-6 bg-gray-50 border rounded-lg p-4 text-sm text-gray-700">
                Verifica el ID y vuelve a intentar.
            </div>
            <div class="mt-6 flex justify-end">
                <button class="bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition" onclick="cerrarModalDetalleAgendamiento()">Cerrar</button>
            </div>
        `;
        return;
    }

    const estadoStyle = {
        'Pendiente Pago': 'bg-white border text-gray-700',
        'Confirmado': 'bg-gray-900 text-white border border-gray-900',
        'Cancelado': 'bg-gray-100 border text-gray-700',
        'Pendiente Reagendamiento': 'bg-gray-100 border text-gray-700'
    }[ag.estado] || 'bg-gray-50 border text-gray-700';

    body.innerHTML = `
        <div class="flex items-start justify-between gap-4">
            <div>
                <h2 class="text-xl font-semibold text-gray-900">Detalle de agendamiento</h2>
                <p class="text-sm text-gray-600 mt-1">Información registrada en el sistema.</p>
            </div>
            <button class="text-gray-500 hover:text-gray-700 text-2xl leading-none" onclick="cerrarModalDetalleAgendamiento()" aria-label="Cerrar">&times;</button>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-4">
            <div class="bg-white border rounded-lg p-4">
                <div class="flex items-center justify-between gap-3 flex-wrap">
                    <div class="text-sm text-gray-500">ID</div>
                    <div class="text-sm font-semibold text-gray-900">${ag.idExterno || ag.id}</div>
                </div>
                <div class="mt-3 flex items-center justify-between gap-3 flex-wrap">
                    <div class="text-sm text-gray-500">Estado</div>
                    <span class="text-xs px-3 py-1 rounded-full ${estadoStyle}">${ag.estado}</span>
                </div>
            </div>

            <div class="bg-gray-50 border rounded-lg p-4">
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</div>
                <div class="mt-1 font-semibold text-gray-900">${ag.nombre}</div>
                <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                    <div><span class="text-gray-500">Email:</span> <span class="font-medium">${ag.email || '-'}</span></div>
                    <div><span class="text-gray-500">Teléfono:</span> <span class="font-medium">${ag.telefono || '-'}</span></div>
                </div>
            </div>

            <div class="bg-gray-50 border rounded-lg p-4">
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Consulta</div>
                <div class="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                    <div><span class="text-gray-500">Materia:</span> <span class="font-medium">${ag.materia}</span></div>
                    <div><span class="text-gray-500">Monto:</span> <span class="font-semibold text-gray-900">$${(ag.monto || 0).toLocaleString()}</span></div>
                    <div><span class="text-gray-500">Fecha:</span> <span class="font-medium">${ag.fecha}</span></div>
                    <div><span class="text-gray-500">Hora:</span> <span class="font-medium">${ag.hora || '-'}</span></div>
                    <div><span class="text-gray-500">Transacción:</span> <span class="font-medium">${ag.transaccion || '-'}</span></div>
                    <div><span class="text-gray-500">Confirmación:</span> <span class="font-medium">${ag.fechaConfirmacion ? formatearFecha(ag.fechaConfirmacion) : '-'}</span></div>
                </div>

                ${ag.descripcion ? `
                    <div class="mt-4">
                        <div class="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Descripción</div>
                        <div class="bg-white border rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">${ag.descripcion}</div>
                    </div>
                ` : ''}
            </div>
        </div>

        <div class="mt-6 flex gap-2 justify-end flex-wrap">
            ${ag.estado === 'Pendiente Pago' ? `
                <button class="bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition" onclick="abrirModalPago(${ag.id})">Confirmar pago</button>
            ` : ''}
            ${ag.estado === 'Confirmado' ? `
                <button class="bg-white border text-gray-900 px-5 py-2 rounded-full font-medium hover:bg-gray-50 transition" onclick="abrirModalCotizacion(${ag.id})">Cotizar</button>
            ` : ''}
            ${ag.estado !== 'Cancelado' ? `
                <button class="bg-white border text-gray-900 px-5 py-2 rounded-full font-medium hover:bg-gray-50 transition" onclick="adminIniciarReagendar(${ag.id})">Reagendar</button>
                <button class="bg-white border text-gray-900 px-5 py-2 rounded-full font-medium hover:bg-gray-50 transition" onclick="adminCancelarAgendamiento(${ag.id})">Cancelar</button>
            ` : ''}
            <button class="bg-white border text-gray-900 px-5 py-2 rounded-full font-medium hover:bg-gray-50 transition" onclick="cerrarModalDetalleAgendamiento()">Cerrar</button>
        </div>
    `;
}

// Alias para que los botones "Ver" (historial/calendario) abran el modal decente
function mostrarDetallesAgendamiento(agendamientoId) {
    return adminAbrirDetalleAgendamiento(agendamientoId);
}

// Función de login
async function loginAdmin(event) {
    event.preventDefault();
    const btn = event?.submitter || event?.target?.querySelector('button[type="submit"]');

    UI.setBtnLoading(btn, true, 'Validando...');
    await UI.delay(650);

    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    UI.setBtnLoading(btn, false);

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
async function logoutAdmin() {
    // Feedback simple
    mostrarNotificacion('Cerrando sesión...', 'info');
    await UI.delay(450);

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
    // Asegurar que no haya 2 modales apilados
    try {
        if (typeof cerrarModalDetalleAgendamiento === 'function') cerrarModalDetalleAgendamiento();
    } catch (_) {}

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
async function procesarConfirmacionPago(event) {
    event.preventDefault();
    const btn = event?.submitter || event?.target?.querySelector('button[type="submit"]');

    UI.setBtnLoading(btn, true, 'Confirmando...');
    await UI.delay(650);

    const transaccion = document.getElementById('inputTransaccion').value;
    const monto = parseInt(document.getElementById('inputMontoConfirmado').value);

    UI.setBtnLoading(btn, false);

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

// Abrir modal de cotización (solo para agendamientos pagados/confirmados)
function abrirModalCotizacion(agendamientoId) {
    const agendamiento = appData.agendamientos.find(a => a.id === agendamientoId);
    if (!agendamiento) return;

    if (agendamiento.estado !== 'Confirmado') {
        mostrarNotificacion('Solo puedes cotizar después del pago (agendamiento confirmado)', 'error');
        return;
    }

    adminState.agendamientoSeleccionado = agendamiento;

    const nombreEl = document.getElementById('cotClienteNombre');
    const emailEl = document.getElementById('cotClienteEmail');

    if (nombreEl) {
        nombreEl.value = agendamiento.nombre;
        nombreEl.readOnly = true;
        nombreEl.classList.add('bg-gray-100');
    }

    if (emailEl) {
        emailEl.value = agendamiento.email;
        emailEl.readOnly = true;
        emailEl.classList.add('bg-gray-100');
    }

    document.getElementById('cotDescripcion').value = '';
    document.getElementById('cotCosto').value = agendamiento.monto;
    document.getElementById('cotPlazo').value = '15 días hábiles';

    abrirModal('modalCotizacion');
}

// Abrir cotización libre (no cliente): permite ingresar nombre/email manualmente
function abrirModalCotizacionLibre() {
    adminState.agendamientoSeleccionado = null;

    const nombreEl = document.getElementById('cotClienteNombre');
    const emailEl = document.getElementById('cotClienteEmail');

    if (nombreEl) {
        nombreEl.value = '';
        nombreEl.readOnly = false;
        nombreEl.classList.remove('bg-gray-100');
    }

    if (emailEl) {
        emailEl.value = '';
        emailEl.readOnly = false;
        emailEl.classList.remove('bg-gray-100');
    }

    document.getElementById('cotDescripcion').value = '';
    document.getElementById('cotCosto').value = '';
    document.getElementById('cotPlazo').value = '15 días hábiles';

    abrirModal('modalCotizacion');
}

// Generar cotización (simular descarga PDF)
async function generarCotizacion(event) {
    event.preventDefault();
    const btn = event?.submitter || event?.target?.querySelector('button[type="submit"]');

    UI.setBtnLoading(btn, true, 'Generando...');
    await UI.delay(850);

    const cotizacion = {
        id: 'COT-' + Date.now(),
        agendamiento: adminState.agendamientoSeleccionado ? adminState.agendamientoSeleccionado.id : null,
        cliente: document.getElementById('cotClienteNombre').value,
        email: document.getElementById('cotClienteEmail').value,
        descripcion: document.getElementById('cotDescripcion').value,
        costo: parseInt(document.getElementById('cotCosto').value),
        plazo: document.getElementById('cotPlazo').value,
        fecha: new Date()
    };

    if (!appData.cotizaciones) appData.cotizaciones = [];
    appData.cotizaciones.push(cotizacion);

    if (adminState.agendamientoSeleccionado) {
        adminState.agendamientoSeleccionado.cotizacion = cotizacion.id;
    }

    UI.setBtnLoading(btn, false);

    cerrarModal('modalCotizacion');
    mostrarNotificacion('Cotización enviada al email', 'success');
    navegar('adminAgendamientos');
}

// Cambiar estado de agendamiento
async function cambiarEstadoAgendamiento(agendamientoId, nuevoEstado) {
    // Feedback simple (no hay botón directo aquí)
    mostrarNotificacion('Actualizando estado...', 'info');
    await UI.delay(450);

    const agendamiento = appData.agendamientos.find(a => a.id === agendamientoId);
    if (agendamiento) {
        agendamiento.estado = nuevoEstado;
        mostrarNotificacion(`Estado actualizado a: ${nuevoEstado}`, 'success');
        navegar('adminAgendamientos');
    }
}

// Actualizar precio de materia
async function actualizarPrecioMateria(servicioId, nuevoPrecio) {
    mostrarNotificacion('Guardando cambios...', 'info');
    await UI.delay(650);

    const servicio = appData.servicios.find(s => s.id === parseInt(servicioId));
    if (servicio) {
        const precioAnterior = servicio.precio;
        servicio.precio = parseInt(nuevoPrecio);

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

// Cancelar agendamiento (acción admin)
async function adminCancelarAgendamiento(agendamientoId) {
    const ag = appData.agendamientos.find(a => a.id === agendamientoId);
    if (!ag) {
        mostrarNotificacion('No se encontró el agendamiento', 'error');
        return;
    }

    if (ag.estado === 'Cancelado') {
        mostrarNotificacion('La cita ya está cancelada', 'info');
        return;
    }

    // Confirmación antes de cancelar
    const ok = window.confirm(`¿Cancelar la cita ${ag.idExterno || ag.id} de ${ag.nombre}?\n\nEsta acción marcará la cita como cancelada.`);
    if (!ok) return;

    mostrarNotificacion('Cancelando cita...', 'info');
    await UI.delay(450);

    ag.estado = 'Cancelado';
    ag.fechaCancelacion = new Date();

    try { cerrarModalDetalleAgendamiento(); } catch (_) {}
    mostrarNotificacion('Cita cancelada', 'success');
    navegar('adminAgendamientos');
}

// Iniciar reagendamiento manual (acción admin): usa el mismo flujo de reagendar del cliente, pero sin OTP
function adminIniciarReagendar(agendamientoId) {
    const ag = appData.agendamientos.find(a => a.id === agendamientoId);
    if (!ag) {
        mostrarNotificacion('No se encontró el agendamiento', 'error');
        return;
    }

    if (ag.estado === 'Cancelado') {
        mostrarNotificacion('No puedes reagendar una cita cancelada', 'error');
        return;
    }

    // Reutiliza flujo existente en app.js (pantalla "reagendar")
    appData.gestion = {
        accion: 'reagendar',
        id: String(ag.idExterno || ag.id),
        otp: '',
        verificado: true,
        estado: 'idle',
        otpIngresado: '',
        contacto: ''
    };

    // Marcar estado si estaba confirmada o pendiente, para auditabilidad visual
    ag.estado = 'Pendiente Reagendamiento';

    try { cerrarModalDetalleAgendamiento(); } catch (_) {}
    navegar('reagendar');
}

// Abrir/cerrar modal
function abrirModal(modalId) {
    // Cerrar cualquier otro modal activo para evitar solapamiento
    document.querySelectorAll('.modal.active').forEach(m => {
        if (m?.id && m.id !== modalId) m.classList.remove('active');
    });

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
