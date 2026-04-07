// Aplicación principal

function navegar(pagina) {
    appData.currentPage = pagina;
    renderizar();
    window.scrollTo(0, 0);
}

// Acceso web para reagendar/cancelar
function irGestionWeb() {
    // En vez de abrir modal, navegamos a una vista simple (misma home) y mostramos el formulario inline.
    appData.gestion = { accion: 'reagendar', id: '', otp: '', verificado: false, estado: 'idle' };
    appData.currentPage = 'gestionWeb';
    renderizar();
    window.scrollTo(0, 0);
}

// Normaliza la búsqueda de citas: permite coincidir por id numérico o por idExterno (string)
function obtenerAgendamientoPorId(id) {
    if (!id) return null;
    const s = String(id);

    // 1) совпадение directo por id
    let ag = appData.agendamientos.find(a => String(a.id) === s);
    if (ag) return ag;

    // 2) совпадение por idExterno (si existe)
    ag = appData.agendamientos.find(a => String(a.idExterno || '') === s);
    if (ag) return ag;

    // 3) Fallback demo: si viene un ID externo (ej: AG-2026-0012) y no hay match,
    // asociarlo a la primera cita existente para que el flujo sea demostrable.
    if (/^AG-\d{4}-\d+$/i.test(s)) {
        const primera = appData.agendamientos.find(() => true);
        if (primera) {
            primera.idExterno = s;
            return primera;
        }
    }

    return null;
}

// Modal de confirmación final
function abrirModalConfirmarGestion() {
    const modal = document.getElementById('modalGestion');
    if (modal) modal.classList.add('active');

    const body = document.getElementById('modalGestionBody');
    if (!body) return;

    const accion = appData.gestion?.accion || 'reagendar';
    const id = appData.gestion?.id || '-';

    const ag = obtenerAgendamientoPorId(id);

    const titulo = accion === 'cancelar' ? 'Confirmar cancelación' : 'Confirmar reagendamiento';
    const texto = accion === 'cancelar'
        ? '¿Confirmas que deseas cancelar la cita?'
        : '¿Confirmas que deseas reagendar la cita?';

    const detalleCita = ag ? `
        <div class="mt-5 bg-gray-50 border rounded-lg p-4 text-sm text-gray-700">
            <div class="font-semibold text-gray-900 mb-2">Datos de la cita</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div><span class="text-gray-500">ID:</span> <span class="font-semibold">${ag.idExterno || ag.id}</span></div>
                <div><span class="text-gray-500">Estado:</span> <span class="font-semibold">${ag.estado}</span></div>
                <div><span class="text-gray-500">Cliente:</span> <span class="font-semibold">${ag.nombre}</span></div>
                <div><span class="text-gray-500">Contacto:</span> <span class="font-semibold">${ag.email || ag.telefono || '-'}</span></div>
                <div><span class="text-gray-500">Materia:</span> <span class="font-semibold">${ag.materia}</span></div>
                <div><span class="text-gray-500">Monto:</span> <span class="font-semibold">$${(ag.monto || 0).toLocaleString()}</span></div>
                <div><span class="text-gray-500">Fecha:</span> <span class="font-semibold">${ag.fecha}</span></div>
                <div><span class="text-gray-500">Hora:</span> <span class="font-semibold">${ag.hora}</span></div>
            </div>
        </div>
    ` : `
        <div class="mt-5 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900">
            <div class="font-semibold">No se encontró la cita</div>
            <div class="mt-1 text-yellow-800">Revisa que el enlace contenga un ID válido.</div>
        </div>
    `;

    body.innerHTML = `
        <div class="flex items-start justify-between gap-4">
            <div>
                <h2 class="text-xl font-semibold text-gray-900">${titulo}</h2>
                <p class="text-sm text-gray-600 mt-1">${texto}</p>
            </div>
            <button class="text-gray-500 hover:text-gray-700 text-2xl leading-none" onclick="cerrarModalGestion()" aria-label="Cerrar">&times;</button>
        </div>

        <div class="mt-5 bg-white border rounded-lg p-4 text-sm text-gray-700">
            <div class="flex justify-between gap-4 flex-wrap">
                <div><span class="text-gray-500">ID (link):</span> <span class="font-semibold">${id}</span></div>
                <div><span class="text-gray-500">Acción:</span> <span class="font-semibold">${accion}</span></div>
            </div>
        </div>

        ${detalleCita}

        <div class="mt-6 flex gap-3 flex-wrap justify-end">
            <button class="bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition" onclick="confirmarGestion()">Confirmar</button>
            <button class="bg-white border text-gray-900 px-5 py-2 rounded-full font-medium hover:bg-gray-50 transition" onclick="cerrarModalGestion()">Cancelar</button>
        </div>
    `;
}

function cerrarModalGestion({ limpiarURL = true } = {}) {
    const modal = document.getElementById('modalGestion');
    if (modal) modal.classList.remove('active');

    if (limpiarURL) {
        window.history.replaceState({}, document.title, window.location.href.split('?')[0].split('#')[0]);
    }
}

// Lee la querystring para preparar el flujo web (sin abrir modal)
function navegarDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    const accion = params.get('accion');

    if (accion === 'reagendar' || accion === 'cancelar') {
        appData.gestion = {
            accion,
            id: params.get('id') || '',
            otp: params.get('otp') || '',
            verificado: false,
            estado: 'idle'
        };
        // Ir a la vista web de gestión
        appData.currentPage = 'gestionWeb';
    }
}

function agendar(servicioId) {
    appData.formData.materiaId = servicioId;
    navegar('agendar');
}

function actualizarPrecio() {
    const selectMateria = document.getElementById('selectMateria');
    const materiaId = parseInt(selectMateria.value);

    if (!materiaId) {
        document.getElementById('resumenMateria').textContent = '-';
        document.getElementById('resumenPrecio').textContent = '-';
        document.getElementById('resumenTotal').textContent = '-';
        return;
    }

    const servicio = appData.servicios.find(s => s.id === materiaId);
    if (servicio) {
        document.getElementById('resumenMateria').textContent = servicio.nombre;
        document.getElementById('resumenPrecio').textContent = `$${servicio.precio.toLocaleString()}`;
        document.getElementById('resumenTotal').textContent = `$${servicio.precio.toLocaleString()}`;
    }
}

function enviarFormulario(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const datos = Object.fromEntries(formData);

    const servicio = appData.servicios.find(s => s.id === parseInt(datos.materia));

    const agendamiento = {
        id: Date.now(),
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono,
        materia: servicio.nombre,
        descripcion: datos.descripcion,
        fecha: datos.fecha,
        hora: datos.hora,
        monto: servicio.precio,
        estado: 'Pendiente Pago',
        fechaCreacion: new Date()
    };

    guardarAgendamiento(agendamiento);
    appData.ultimoAgendamiento = agendamiento;

    navegar('confirmacion');
}

function mostrarConfirmacion() {
    if (appData.ultimoAgendamiento) {
        const a = appData.ultimoAgendamiento;
        document.getElementById('confNombre').textContent = a.nombre;
        document.getElementById('confEmail').textContent = a.email;
        document.getElementById('confMateria').textContent = a.materia;

        const fecha = new Date(a.fecha + 'T00:00:00');
        document.getElementById('confFecha').textContent = fecha.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
        document.getElementById('confHora').textContent = a.hora;
        document.getElementById('confMonto').textContent = `$${a.monto.toLocaleString()}`;
    }
}

// Funciones de Admin
function irAdminLogin() {
    navegar('adminLogin');
}

function loginAdmin(event) {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    if (email === 'admin@estudiojuridico.cl' && password === 'admin123') {
        adminState.logueado = true;
        adminState.adminActual = { email, nombre: 'Administrador' };
        navegar('adminDashboard');
        mostrarNotificacion('Bienvenido al panel administrativo', 'success');
    } else {
        mostrarNotificacion('Email o contraseña incorrectos', 'error');
    }
}

function cerrarSesion() {
    adminState.logueado = false;
    adminState.adminActual = null;
    navegar('home');
    mostrarNotificacion('Sesión cerrada', 'info');
}

function mostrarDetallesAgendamiento(agendamientoId) {
    const agendamiento = appData.agendamientos.find(a => a.id === agendamientoId);
    if (agendamiento) {
        alert(`Detalles del Agendamiento:\n\nCliente: ${agendamiento.nombre}\nEmail: ${agendamiento.email}\nTeléfono: ${agendamiento.telefono}\nMateria: ${agendamiento.materia}\nFecha: ${agendamiento.fecha}\nHora: ${agendamiento.hora}\nMonto: $${agendamiento.monto.toLocaleString()}\nEstado: ${agendamiento.estado}`);
    }
}

function mostrarFormularioServicio() {
    document.getElementById('formularioServicio').classList.remove('hidden');
}

function ocultarFormularioServicio() {
    document.getElementById('formularioServicio').classList.add('hidden');
}

function agregarServicio(event) {
    event.preventDefault();
    const nombre = document.getElementById('nuevoServicioNombre').value;
    const precio = parseInt(document.getElementById('nuevoServicioPrecio').value);
    const descripcion = document.getElementById('nuevoServicioDescripcion').value;

    const nuevoServicio = {
        id: appData.servicios.length + 1,
        nombre,
        precio,
        descripcion,
        solicitudes: 0
    };

    appData.servicios.push(nuevoServicio);
    ocultarFormularioServicio();
    mostrarNotificacion('Servicio agregado exitosamente', 'success');
    navegar('adminServicios');
}

function mostrarEditarServicio(servicioId) {
    const servicio = appData.servicios.find(s => s.id === servicioId);
    if (servicio) {
        const nuevoPrecio = prompt(`Nuevo precio para ${servicio.nombre}:`, servicio.precio);
        if (nuevoPrecio && !isNaN(nuevoPrecio)) {
            actualizarPrecioMateria(servicioId, nuevoPrecio);
        }
    }
}

// Flujo web (mock) para reagendar/cancelar con verificación
function verificarGestion(event) {
    event.preventDefault();

    if (!appData.gestion) appData.gestion = {};

    // Captura una vez antes de re-renderizar (evita perder valores al refrescar el DOM)
    const codigoIngresado = (document.getElementById('gestionOtp')?.value || '').trim();
    const contactoIngresado = (document.getElementById('gestionContacto')?.value || '').trim();

    // Persistir lo que el usuario ingresó en el estado
    appData.gestion.otpIngresado = codigoIngresado;
    appData.gestion.contacto = contactoIngresado;

    appData.gestion.estado = 'loading';
    renderizar();

    setTimeout(() => {
        const codigo = (appData.gestion?.otpIngresado || '').trim();
        const contacto = (appData.gestion?.contacto || '').trim();

        if (!codigo || !contacto) {
            appData.gestion.estado = 'idle';
            renderizar();
            mostrarNotificacion('Completa el código y tu email o teléfono', 'error');
            return;
        }

        const otpEsperado = (appData.gestion?.otp || '').trim();

        // Si se ingresa desde el enlace (WhatsApp/correo) viene otp esperado.
        // Si se inicia desde el sitio (botón Inicio) puede no existir otp esperado; aceptamos cualquier código para avanzar.
        const ok = otpEsperado ? (codigo === otpEsperado) : true;

        appData.gestion.estado = 'idle';

        if (ok) {
            appData.gestion.verificado = true;
            renderizar();
            mostrarNotificacion('Verificación exitosa', 'success');
            abrirModalConfirmarGestion();
        } else {
            renderizar();
            mostrarNotificacion('Código inválido', 'error');
        }
    }, 650);
}

function confirmarGestion() {
    if (!appData.gestion?.verificado) {
        mostrarNotificacion('Debes verificar tu identidad antes de continuar', 'error');
        return;
    }

    const accion = appData.gestion.accion;
    const id = appData.gestion.id;

    const ag = obtenerAgendamientoPorId(id);

    if (accion === 'cancelar') {
        if (ag) ag.estado = 'Cancelado';
        mostrarNotificacion('Cancelación registrada', 'success');
        cerrarModalGestion();
        navegar('home');
        return;
    }

    if (accion === 'reagendar') {
        if (ag) ag.estado = 'Pendiente Reagendamiento';
        cerrarModalGestion({ limpiarURL: false });
        navegar('reagendar');
        return;
    }

    cerrarModalGestion();
    navegar('home');
}

// Confirmar reagendamiento (selección nueva fecha/hora)
function confirmarReagendamiento(event) {
    event.preventDefault();

    const id = appData.gestion?.id;
    const ag = obtenerAgendamientoPorId(id);

    const nuevaFecha = (document.getElementById('reagendarFecha')?.value || '').trim();
    const nuevaHora = (document.getElementById('reagendarHora')?.value || '').trim();

    if (!nuevaFecha || !nuevaHora) {
        mostrarNotificacion('Selecciona una nueva fecha y hora', 'error');
        return;
    }

    if (ag) {
        ag.fecha = nuevaFecha;
        ag.hora = nuevaHora;
        ag.estado = 'Reagendado';
    }

    mostrarNotificacion('Cita reagendada', 'success');

    // Limpieza mínima del estado del flujo
    if (appData.gestion) {
        appData.gestion.verificado = false;
        appData.gestion.estado = 'idle';
        appData.gestion.otpIngresado = '';
        appData.gestion.contacto = '';
    }

    navegar('home');
}

// Función auxiliar para renderizar
function renderizar() {
    const app = document.getElementById('app');

    // Si está en admin, validar que esté logueado
    if (appData.currentPage.startsWith('admin') && !adminState.logueado) {
        appData.currentPage = 'adminLogin';
    }

    let contenido = '';

    // Header
    if (appData.currentPage.startsWith('admin')) {
        contenido += Components.adminHeader();
    } else {
        contenido += Components.header();
    }

    // Contenido según página
    switch(appData.currentPage) {
        case 'adminLogin':
            contenido += `
                <section class="py-20 bg-gray-50 min-h-screen flex items-center">
                    <div class="max-w-md mx-auto w-full px-4">
                        <div class="bg-white rounded-lg shadow-lg p-8 border">
                            <h2 class="text-3xl font-semibold text-gray-900 mb-6 text-center">Panel Administrativo</h2>
                            <form onsubmit="loginAdmin(event)" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input type="email" id="adminEmail" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="admin@estudiojuridico.cl">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                                    <input type="password" id="adminPassword" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="••••••••">
                                </div>
                                <button type="submit" class="w-full bg-gray-900 text-white py-2 rounded-full font-medium hover:bg-gray-800 transition">
                                    Ingresar
                                </button>
                            </form>
                            <div class="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 border">
                                <p class="font-semibold mb-2">Credenciales de prueba</p>
                                <p>Email: admin@estudiojuridico.cl</p>
                                <p>Contraseña: admin123</p>
                            </div>
                            <button onclick="navegar('home')" class="w-full mt-4 bg-white text-gray-800 py-2 rounded-full font-medium border hover:bg-gray-50 transition">
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </section>
            `;
            break;

        case 'adminDashboard':
            contenido += Components.adminDashboard();
            break;

        case 'adminServicios':
            contenido += Components.adminServicios();
            break;

        case 'adminAgendamientos':
            contenido += Components.adminAgendamientos();
            break;

        case 'adminCalendario':
            contenido += Components.adminCalendario();
            break;

        case 'adminUsuarios':
            contenido += Components.adminUsuarios();
            break;

        case 'whatsapp':
            contenido += Components.whatsappMockup();
            // Inicializar conversación cuando el DOM ya exista
            setTimeout(() => {
                if (typeof waInitIfVisible === 'function') waInitIfVisible();
            }, 50);
            break;

        case 'home':
            contenido += Components.hero();
            contenido += `<section class="py-12 bg-white border-b"><div class="max-w-6xl mx-auto px-4">
                <h2 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center">¿Por qué elegir nuestro estudio?</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div class="text-center">
                        <i class="fas fa-check-circle text-4xl mb-4 text-gray-600"></i>
                        <h3 class="font-semibold text-lg mb-2">Rápido y fácil</h3>
                        <p class="text-gray-600">Agenda tu consulta sin registro en segundos.</p>
                    </div>
                    <div class="text-center">
                        <i class="fas fa-shield-alt text-4xl mb-4 text-gray-600"></i>
                        <h3 class="font-semibold text-lg mb-2">Seguro y confidencial</h3>
                        <p class="text-gray-600">Tu información es tratada con confidencialidad.</p>
                    </div>
                    <div class="text-center">
                        <i class="fas fa-clock text-4xl mb-4 text-gray-600"></i>
                        <h3 class="font-semibold text-lg mb-2">Disponible 24/7</h3>
                        <p class="text-gray-600">Elige el horario que mejor se adapte a ti.</p>
                    </div>
                </div>

                <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-gray-50 border rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900">¿Necesitas cambiar tu cita?</h3>
                        <p class="text-sm text-gray-600 mt-1">Reagenda o cancela tu consulta usando el enlace que recibiste por WhatsApp o correo.</p>
                        <div class="mt-4 flex gap-3 flex-wrap">
                            <button onclick="irGestionWeb()" class="bg-white border text-gray-900 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition">
                                Reagendar o cancelar
                            </button>
                            <button onclick="irAdminLogin()" class="text-gray-700 hover:text-gray-900 font-medium text-sm">
                                <i class="fas fa-lock"></i>
                                Acceso administrador
                            </button>
                        </div>
                    </div>
                    <div class="bg-white border rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900">Canal de atención</h3>
                        <p class="text-sm text-gray-600 mt-1">Puedes escribirnos por WhatsApp para orientación y seguimiento.</p>
                        <div class="mt-4">
                            <button onclick="navegar('whatsapp')" class="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
                                Abrir WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div></section>`;
            break;

        case 'servicios':
            contenido += Components.servicios();
            break;

        case 'agendar':
            contenido += `<section class="py-12 bg-white"><div class="max-w-6xl mx-auto px-4">`;
            contenido += Components.formularioAgendar();
            contenido += `</div></section>`;
            break;

        case 'confirmacion':
            contenido += `<section class="py-12 bg-white"><div class="max-w-6xl mx-auto px-4">`;
            contenido += Components.confirmacion();
            contenido += `</div></section>`;
            setTimeout(mostrarConfirmacion, 100);
            break;

        case 'gestionWeb':
            contenido += `
                <section class="py-12">
                    <div class="max-w-2xl mx-auto px-4">
                        <div class="bg-white rounded-lg shadow-lg p-8 border">
                            <h2 class="text-3xl font-semibold text-gray-900">Gestión de cita</h2>
                            <p class="text-gray-600 mt-2">Ingresa el código de verificación y tu contacto para continuar.</p>

                            ${appData.gestion?.id ? `
                            <div class="mt-6 bg-gray-50 border rounded-lg p-4 text-sm text-gray-700">
                                <div class="flex justify-between gap-4 flex-wrap">
                                    <div><span class="text-gray-500">ID de cita:</span> <span class="font-semibold">${appData.gestion?.id || '-'}</span></div>
                                    <div><span class="text-gray-500">Acción:</span> <span class="font-semibold">${appData.gestion?.accion || '-'}</span></div>
                                </div>
                            </div>
                            ` : `
                            <div class="mt-6 bg-gray-50 border rounded-lg p-4 text-sm text-gray-700">
                                <p class="font-medium text-gray-900">Demo web</p>
                                <p class="mt-1 text-gray-600">En producción, esta página suele abrirse desde un enlace enviado por WhatsApp/correo con el <span class="font-semibold">ID</span> de la cita y el <span class="font-semibold">código (OTP)</span> prellenados.</p>
                            </div>
                            `}

                            <div class="mt-6 flex gap-2">
                                <button type="button" class="px-4 py-2 rounded-full border ${appData.gestion?.accion !== 'cancelar' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900'} transition" onclick="appData.gestion.accion='reagendar'; renderizar();">Reagendar</button>
                                <button type="button" class="px-4 py-2 rounded-full border ${appData.gestion?.accion === 'cancelar' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900'} transition" onclick="appData.gestion.accion='cancelar'; renderizar();">Cancelar</button>
                            </div>

                            <form class="mt-6 space-y-4" onsubmit="verificarGestion(event)">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Código de verificación</label>
                                    <input id="gestionOtp" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="Ingresa el código" value="${appData.gestion?.otpIngresado || appData.gestion?.otp || ''}" oninput="appData.gestion.otpIngresado=this.value;" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Email o teléfono</label>
                                    <input id="gestionContacto" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="Tu email o teléfono" value="${appData.gestion?.contacto || ''}" oninput="appData.gestion.contacto=this.value;" />
                                </div>
                                <div class="flex gap-3 pt-1 flex-wrap">
                                    <button type="submit" class="bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition flex items-center gap-2" ${appData.gestion?.estado === 'loading' ? 'disabled' : ''}>
                                        ${appData.gestion?.estado === 'loading' ? '<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Validando...' : 'Continuar'}
                                    </button>
                                    <button type="button" class="bg-white border text-gray-900 px-5 py-2 rounded-full font-medium hover:bg-gray-50 transition" onclick="navegar('home')">Volver</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            `;
            break;

        case 'reagendar': {
            const id = appData.gestion?.id || '-';
            const ag = obtenerAgendamientoPorId(id);

            contenido += `
                <section class="py-12">
                    <div class="max-w-2xl mx-auto px-4">
                        <div class="bg-white rounded-lg shadow-lg p-8 border">
                            <h2 class="text-3xl font-semibold text-gray-900">Reagendar cita</h2>
                            <p class="text-gray-600 mt-2">Selecciona una nueva fecha y hora para tu consulta.</p>

                            ${ag ? `
                            <div class="mt-6 bg-gray-50 border rounded-lg p-4 text-sm text-gray-700">
                                <div class="font-semibold text-gray-900 mb-2">Cita actual</div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div><span class="text-gray-500">ID:</span> <span class="font-semibold">${ag.idExterno || ag.id}</span></div>
                                    <div><span class="text-gray-500">Materia:</span> <span class="font-semibold">${ag.materia}</span></div>
                                    <div><span class="text-gray-500">Fecha:</span> <span class="font-semibold">${ag.fecha}</span></div>
                                    <div><span class="text-gray-500">Hora:</span> <span class="font-semibold">${ag.hora}</span></div>
                                </div>
                            </div>
                            ` : `
                            <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900">
                                <div class="font-semibold">No se encontró la cita</div>
                                <div class="mt-1 text-yellow-800">Vuelve a abrir el enlace de WhatsApp/correo para reagendar con tu ID.</div>
                            </div>
                            `}

                            <form class="mt-6 space-y-4" onsubmit="confirmarReagendamiento(event)">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nueva fecha</label>
                                    <select id="reagendarFecha" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900">
                                        <option value="">-- Selecciona una fecha --</option>
                                        ${obtenerFechasDisponibles().map(f => `<option value="${f.fecha}">${f.dia}</option>`).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nueva hora</label>
                                    <select id="reagendarHora" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900">
                                        <option value="">-- Selecciona una hora --</option>
                                        ${appData.horarios.map(h => `<option value="${h}">${h}</option>`).join('')}
                                    </select>
                                </div>

                                <div class="flex gap-3 pt-1 flex-wrap justify-end">
                                    <button type="submit" class="bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition">Confirmar reagendamiento</button>
                                    <button type="button" class="bg-white border text-gray-900 px-5 py-2 rounded-full font-medium hover:bg-gray-50 transition" onclick="navegar('home')">Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            `;
            break;
        }

        default:
            contenido += Components.hero();
    }

    // Footer
    if (!appData.currentPage.startsWith('admin')) {
        contenido += Components.footer();
    }

    app.innerHTML = contenido;

    if (appData.currentPage === 'agendar' && appData.formData.materiaId) {
        const select = document.getElementById('selectMateria');
        if (select) {
            select.value = appData.formData.materiaId;
            actualizarPrecio();
        }
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    navegarDesdeURL();
    renderizar();
});
