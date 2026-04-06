// Aplicación principal

function navegar(pagina) {
    appData.currentPage = pagina;
    renderizar();
    window.scrollTo(0, 0);
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
                <section class="py-20 bg-gray-100 min-h-screen flex items-center">
                    <div class="max-w-md mx-auto w-full px-4">
                        <div class="bg-white rounded-lg shadow-lg p-8">
                            <h2 class="text-3xl font-bold text-blue-900 mb-6 text-center">Panel Administrativo</h2>
                            <form onsubmit="loginAdmin(event)" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input type="email" id="adminEmail" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="admin@estudiojuridico.cl">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                                    <input type="password" id="adminPassword" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="••••••••">
                                </div>
                                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                                    Ingresar
                                </button>
                            </form>
                            <div class="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
                                <p class="font-bold mb-2">Credenciales de Prueba:</p>
                                <p>Email: admin@estudiojuridico.cl</p>
                                <p>Contraseña: admin123</p>
                            </div>
                            <button onclick="navegar('home')" class="w-full mt-4 bg-gray-300 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-400 transition">
                                Volver al Inicio
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

        case 'adminUsuarios':
            contenido += Components.adminUsuarios();
            break;

        case 'home':
            contenido += Components.hero();
            contenido += `<section class="py-12 bg-white"><div class="max-w-6xl mx-auto px-4">
                <h2 class="text-3xl font-bold text-blue-900 mb-8 text-center">¿Por qué elegir nuestro estudio?</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="text-center">
                        <i class="fas fa-check-circle text-green-600 text-4xl mb-4"></i>
                        <h3 class="font-bold text-lg mb-2">Rápido y Fácil</h3>
                        <p class="text-gray-600">Agenda tu consulta sin registro en segundos</p>
                    </div>
                    <div class="text-center">
                        <i class="fas fa-shield-alt text-blue-600 text-4xl mb-4"></i>
                        <h3 class="font-bold text-lg mb-2">Seguro y Confidencial</h3>
                        <p class="text-gray-600">Tu información está protegida y es 100% confidencial</p>
                    </div>
                    <div class="text-center">
                        <i class="fas fa-clock text-yellow-600 text-4xl mb-4"></i>
                        <h3 class="font-bold text-lg mb-2">Disponible 24/7</h3>
                        <p class="text-gray-600">Elige el horario que mejor se adapte a ti</p>
                    </div>
                </div>
                <div class="text-center mt-8">
                    <button onclick="irAdminLogin()" class="text-blue-600 hover:text-blue-700 font-bold text-sm">
                        <i class="fas fa-lock"></i>
                        Acceso Administrador
                    </button>
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
    renderizar();
});
