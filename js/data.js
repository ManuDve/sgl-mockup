// Datos de configuración y estado de la aplicación
const appData = {
    servicios: [
        { id: 1, nombre: 'Derecho Civil', descripcion: 'Contratos, herencias, propiedad', precio: 25000, solicitudes: 12 },
        { id: 2, nombre: 'Derecho Laboral', descripcion: 'Despidos, contratos, conflictos laborales', precio: 30000, solicitudes: 18 },
        { id: 3, nombre: 'Derecho de Familia', descripcion: 'Divorcios, custodia, pensiones', precio: 40000, solicitudes: 24 },
        { id: 4, nombre: 'Derecho Tributario', descripcion: 'Impuestos, declaraciones, auditorías', precio: 45000, solicitudes: 8 }
    ],

    horarios: [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ],

    estudioInfo: {
        nombre: 'Estudio Jurídico Profesional',
        email: 'contacto@estudiojuridico.cl',
        telefono: '+56 2 2345 6789',
        direccion: 'Avenida Providencia 1234, Santiago',
        whatsapp: '+56 9 8765 4321'
    },

    // Fuente única (array) de agendamientos
    _agendamientos: [
        { id: 1, nombre: 'Carlos Sánchez', email: 'carlos@email.com', telefono: '+56 9 1111 1111', materia: 'Derecho Civil', descripcion: 'Consulta sobre contrato', fecha: '2026-03-25', hora: '10:00', monto: 25000, estado: 'Pendiente Pago', fechaCreacion: new Date() },
        { id: 2, nombre: 'María González', email: 'maria@email.com', telefono: '+56 9 2222 2222', materia: 'Derecho de Familia', descripcion: 'Consulta sobre divorcio', fecha: '2026-03-26', hora: '14:00', monto: 40000, estado: 'Confirmado', fechaCreacion: new Date() }
    ],

    resumenAgendamientos: {
        total: 2,
        pendientes: 1,
        confirmados: 1,
        cancelados: 0,
        ingresoTotal: 40000
    },

    usuarios: {
        total: 1,
        activos: 1,
        lista: [
            { id: 1, nombre: 'Abogado Principal', email: 'abogado@estudiojuridico.cl', telefono: '+56 9 9999 9999', estado: 'Activo' }
        ]
    },

    cotizaciones: [],
    historialPrecios: [],

    currentPage: 'home',
    formData: {},
    usuario: { nombre: 'Administrador', email: 'admin@estudiojuridico.cl' }
};

// Agendamientos (array) + vistas derivadas
Object.defineProperty(appData, 'agendamientos', {
    get() {
        return this._agendamientos;
    },
    set(value) {
        this._agendamientos = Array.isArray(value) ? value : [];
    }
});

Object.defineProperty(appData, 'agendamientosPendientes', {
    get() {
        return (this._agendamientos || []).filter(a => a.estado === 'Pendiente Pago');
    }
});

Object.defineProperty(appData, 'agendamientosHistorial', {
    get() {
        return (this._agendamientos || []).filter(a => a.estado !== 'Pendiente Pago');
    }
});

// Función para guardar agendamiento
function guardarAgendamiento(datos) {
    // Asegurar array
    if (!Array.isArray(appData._agendamientos)) appData._agendamientos = [];

    appData._agendamientos.push(datos);

    // Contar solicitudes por materia
    const materia = appData.servicios.find(s => s.nombre === datos.materia);
    if (materia) {
        materia.solicitudes = (materia.solicitudes || 0) + 1;
    }

    console.log('Agendamiento guardado:', datos);
    return true;
}

// Función para obtener fechas disponibles (próximos 14 días)
function obtenerFechasDisponibles() {
    const fechas = [];
    const hoy = new Date();

    for (let i = 1; i <= 14; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(fecha.getDate() + i);

        // Solo días de lunes a viernes
        if (fecha.getDay() !== 0 && fecha.getDay() !== 6) {
            fechas.push({
                fecha: fecha.toISOString().split('T')[0],
                dia: fecha.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
            });
        }
    }

    return fechas;
}
