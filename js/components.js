// Componentes reutilizables de la aplicación

const Components = {
    // Header/Navbar
    header: () => `
        <header class="bg-white text-gray-900 shadow-md sticky top-0 z-50 border-b">
            <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <button onclick="navegar('home')" class="font-bold text-gray-900 tracking-tight" aria-label="Ir al inicio">SGL</button>
                </div>
                <nav class="flex gap-4 items-center">
                    <button onclick="navegar('home')" class="text-sm text-gray-700 hover:text-gray-900 transition">Inicio</button>
                    <button onclick="navegar('servicios')" class="text-sm text-gray-700 hover:text-gray-900 transition">Servicios</button>
                    <button onclick="navegar('agendar')" class="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
                        Agendar
                    </button>
                </nav>
            </div>
        </header>
    `,

    // Hero Section
    hero: () => `
        <section class="bg-white py-20 border-b">
            <div class="max-w-6xl mx-auto px-4 text-center">
                <p class="text-xs text-gray-500 tracking-widest uppercase">Sistema de Gestión Legal</p>
                <h2 class="text-4xl md:text-5xl font-semibold text-gray-900 mt-3 mb-4">Soluciones jurídicas profesionales</h2>
                <p class="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">Agenda tu consulta legal de forma fácil y rápida, sin necesidad de registro.</p>
                <button onclick="navegar('agendar')" class="bg-gray-900 text-white px-8 py-3 rounded-full font-medium text-base hover:bg-gray-800 transition">
                    Agendar consulta
                </button>
            </div>
        </section>
    `,

    // Tarjeta de Servicio
    servicioCard: (servicio) => `
        <div class="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition">
            <div class="flex items-start justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">${servicio.nombre}</h3>
                <i class="fas fa-briefcase text-gray-500 text-xl"></i>
            </div>
            <p class="text-gray-600 mb-5 text-sm leading-relaxed">${servicio.descripcion}</p>
            <div class="flex justify-between items-center">
                <span class="text-xl font-semibold text-gray-900">$${servicio.precio.toLocaleString()}</span>
                <button onclick="agendar(${servicio.id})" class="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
                    Agendar
                </button>
            </div>
        </div>
    `,

    // Formulario de Agendamiento
    formularioAgendar: () => `
        <div class="max-w-2xl mx-auto">
            <div class="bg-white rounded-lg shadow-lg p-8 border">
                <h2 class="text-2xl font-semibold text-gray-900 mb-6">Agendar consulta</h2>
                
                <form id="formAgendar" onsubmit="enviarFormulario(event)" class="space-y-7">
                    <!-- Datos Personales -->
                    <div class="border-b pb-7">
                        <h3 class="text-base font-semibold text-gray-900 mb-4">Datos personales</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-2">Nombre completo</label>
                                <input type="text" name="nombre" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="Juan Pérez">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-2">Email</label>
                                <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="juan@ejemplo.com">
                            </div>
                        </div>
                        <div class="mt-4">
                            <label class="block text-xs font-medium text-gray-600 mb-2">Teléfono</label>
                            <input type="tel" name="telefono" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="+56 9 1234 5678">
                        </div>
                    </div>

                    <!-- Consulta -->
                    <div class="border-b pb-7">
                        <h3 class="text-base font-semibold text-gray-900 mb-4">Detalles de la consulta</h3>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 mb-2">Materia legal</label>
                            <select name="materia" required id="selectMateria" onchange="actualizarPrecio()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900">
                                <option value="">-- Selecciona una materia --</option>
                                ${appData.servicios.map(s => `<option value="${s.id}">${s.nombre} - $${s.precio.toLocaleString()}</option>`).join('')}
                            </select>
                        </div>
                        <div class="mt-4">
                            <label class="block text-xs font-medium text-gray-600 mb-2">Descripción</label>
                            <textarea name="descripcion" required rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="Describe brevemente tu consulta legal..."></textarea>
                        </div>
                    </div>

                    <!-- Fecha y Hora -->
                    <div class="border-b pb-7">
                        <h3 class="text-base font-semibold text-gray-900 mb-4">Fecha y hora</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-2">Fecha</label>
                                <select name="fecha" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900">
                                    <option value="">-- Selecciona una fecha --</option>
                                    ${obtenerFechasDisponibles().map(f => `<option value="${f.fecha}">${f.dia}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-2">Hora</label>
                                <select name="hora" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900">
                                    <option value="">-- Selecciona una hora --</option>
                                    ${appData.horarios.map(h => `<option value="${h}">${h}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Resumen -->
                    <div class="bg-gray-50 p-4 rounded-lg border">
                        <h3 class="text-base font-semibold text-gray-900 mb-3">Resumen</h3>
                        <div class="space-y-2 text-sm text-gray-700">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Consulta</span>
                                <span id="resumenMateria" class="font-medium">-</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Precio</span>
                                <span id="resumenPrecio" class="font-medium">-</span>
                            </div>
                            <div class="border-t pt-2 mt-2 flex justify-between text-base font-semibold">
                                <span>Total</span>
                                <span id="resumenTotal">-</span>
                            </div>
                        </div>
                    </div>

                    <!-- Confirmación -->
                    <div class="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border">
                        <i class="fas fa-info-circle text-gray-500 mt-0.5"></i>
                        <p class="text-sm text-gray-700">Recibirás confirmación por correo y WhatsApp con los detalles de tu consulta e instrucciones de pago.</p>
                    </div>

                    <!-- Botones -->
                    <div class="flex flex-col sm:flex-row gap-3 pt-2">
                        <button type="submit" class="flex-1 bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2">
                            <i class="fas fa-check"></i>
                            Confirmar
                        </button>
                        <button type="button" onclick="navegar('home')" class="flex-1 bg-white text-gray-800 py-3 rounded-full font-medium border hover:bg-gray-50 transition">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `,

    // Página de Servicios
    servicios: () => `
        <div class="max-w-6xl mx-auto px-4 py-12">
            <h2 class="text-3xl md:text-4xl font-semibold text-gray-900 mb-8 text-center">Servicios</h2>
            <p class="text-gray-600 text-center max-w-2xl mx-auto mb-10">Selecciona una materia legal para agendar tu consulta.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${appData.servicios.map(s => Components.servicioCard(s)).join('')}
            </div>
        </div>
    `,

    // Footer
    footer: () => `
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-6xl mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 class="text-sm font-semibold mb-4 flex items-center gap-2 text-white/90">
                            <i class="fas fa-phone"></i>
                            Contacto
                        </h3>
                        <p class="text-gray-300">${appData.estudioInfo.telefono}</p>
                        <p class="text-gray-300">${appData.estudioInfo.email}</p>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold mb-4 flex items-center gap-2 text-white/90">
                            <i class="fas fa-map-marker-alt"></i>
                            Ubicación
                        </h3>
                        <p class="text-gray-300">${appData.estudioInfo.direccion}</p>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold mb-4 flex items-center gap-2 text-white/90">
                            <i class="fas fa-comments"></i>
                            WhatsApp
                        </h3>
                        <a href="https://wa.me/${appData.estudioInfo.whatsapp.replace(/\s/g, '')}" target="_blank" class="text-gray-200 hover:text-white underline underline-offset-4">
                            Contactar por WhatsApp
                        </a>
                    </div>
                </div>
                <div class="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
                    <p>&copy; 2026 ${appData.estudioInfo.nombre}. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    `,

    // Página de Confirmación
    confirmacion: () => `
        <div class="max-w-2xl mx-auto py-12">
            <div class="bg-white rounded-lg shadow-lg p-8 text-center border">
                <div class="mb-6">
                    <i class="fas fa-check-circle text-gray-900 text-6xl"></i>
                </div>
                <h2 class="text-3xl font-semibold text-gray-900 mb-4">Agendamiento registrado</h2>
                <p class="text-gray-600 mb-6">Tu consulta ha sido registrada. Recibirás un mensaje con los pasos a seguir.</p>
                
                <div class="bg-gray-50 p-6 rounded-lg mb-6 text-left border">
                    <h3 class="font-semibold text-gray-900 mb-4">Detalles de tu consulta</h3>
                    <div class="space-y-2 text-sm text-gray-700">
                        <div class="flex justify-between"><span class="text-gray-600">Nombre</span><span id="confNombre" class="font-medium">-</span></div>
                        <div class="flex justify-between"><span class="text-gray-600">Email</span><span id="confEmail" class="font-medium">-</span></div>
                        <div class="flex justify-between"><span class="text-gray-600">Materia</span><span id="confMateria" class="font-medium">-</span></div>
                        <div class="flex justify-between"><span class="text-gray-600">Fecha</span><span id="confFecha" class="font-medium">-</span></div>
                        <div class="flex justify-between"><span class="text-gray-600">Hora</span><span id="confHora" class="font-medium">-</span></div>
                        <div class="border-t pt-2 mt-2 flex justify-between text-base font-semibold">
                            <span>Monto a pagar</span>
                            <span id="confMonto" class="text-gray-900">-</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-lg mb-6 border">
                    <p class="text-sm text-gray-700">
                        Próximo paso: realiza la transferencia bancaria según las instrucciones enviadas. Luego podrás confirmar el pago.
                    </p>
                </div>

                <button onclick="navegar('home')" class="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                    Volver al inicio
                </button>
            </div>
        </div>
    `,

    // Página de Dashboard Administrativo
    adminDashboard: () => {
        const actividad = [
            { fecha: '06/04/2026 10:12', titulo: 'Nueva solicitud de agendamiento', detalle: 'Juan Pérez — Derecho Civil — 10:00' },
            { fecha: '06/04/2026 09:40', titulo: 'Pago confirmado', detalle: 'Agendamiento #2 — $40.000' },
            { fecha: '05/04/2026 18:05', titulo: 'Solicitud de reagendamiento', detalle: 'Agendamiento #1 — Pendiente de confirmación' },
            { fecha: '05/04/2026 12:30', titulo: 'Cotización generada', detalle: 'COT-20260405-001 — enviada al cliente' }
        ];

        const topServicios = [...appData.servicios]
            .sort((a, b) => (b.solicitudes || 0) - (a.solicitudes || 0))
            .slice(0, 5);

        return `
        <div class="max-w-6xl mx-auto px-4 py-12">
            <h2 class="text-3xl font-semibold text-gray-900 mb-8">Dashboard</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-white rounded-lg shadow-md p-6 border">
                    <h3 class="text-sm font-semibold text-gray-900 mb-4">Agendamientos</h3>
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-3xl font-semibold text-gray-900">${appData.resumenAgendamientos.total}</span>
                        <i class="fas fa-calendar-check text-3xl text-gray-500"></i>
                    </div>
                    <p class="text-sm text-gray-600">Total de agendamientos registrados.</p>
                    <div class="mt-4 grid grid-cols-3 gap-3 text-xs">
                        <div class="bg-gray-50 border rounded-lg p-3">
                            <div class="text-gray-500">Pendientes</div>
                            <div class="text-gray-900 font-semibold">${appData.resumenAgendamientos.pendientes}</div>
                        </div>
                        <div class="bg-gray-50 border rounded-lg p-3">
                            <div class="text-gray-500">Confirmados</div>
                            <div class="text-gray-900 font-semibold">${appData.resumenAgendamientos.confirmados}</div>
                        </div>
                        <div class="bg-gray-50 border rounded-lg p-3">
                            <div class="text-gray-500">Cancelados</div>
                            <div class="text-gray-900 font-semibold">${appData.resumenAgendamientos.cancelados}</div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6 border">
                    <h3 class="text-sm font-semibold mb-4">Servicios más solicitados</h3>
                    <ul class="text-sm text-gray-700">
                        ${topServicios
                            .map(s => `<li class="flex justify-between py-2 border-b last:border-b-0"><span>${s.nombre}</span><span class="font-semibold text-gray-900">${s.solicitudes || 0}</span></li>`)
                            .join('')}
                    </ul>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6 border">
                    <h3 class="text-sm font-semibold mb-4">Usuarios</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-gray-50 border rounded-lg p-4">
                            <p class="text-xs text-gray-500">Total</p>
                            <p class="text-2xl font-semibold text-gray-900">${appData.usuarios.total}</p>
                        </div>
                        <div class="bg-gray-50 border rounded-lg p-4">
                            <p class="text-xs text-gray-500">Activos</p>
                            <p class="text-2xl font-semibold text-gray-900">${appData.usuarios.activos}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-10">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Actividad reciente</h3>
                <div class="bg-white rounded-lg shadow-md border">
                    <ul class="divide-y">
                        ${actividad.map(item => `
                            <li class="p-5">
                                <div class="flex items-start justify-between gap-4">
                                    <div>
                                        <div class="text-sm font-semibold text-gray-900">${item.titulo}</div>
                                        <div class="text-sm text-gray-600 mt-1">${item.detalle}</div>
                                    </div>
                                    <div class="text-xs text-gray-500 whitespace-nowrap">${item.fecha}</div>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
        `;
    },

    // Página de Servicios en Panel Administrativo
    adminServicios: () => `
        <div class="max-w-6xl mx-auto px-4 py-12">
            <div class="flex items-end justify-between gap-6 flex-wrap mb-6">
                <div>
                    <h2 class="text-3xl font-semibold text-gray-900">Servicios</h2>
                    <p class="text-sm text-gray-600 mt-1">Administra materias y precios.</p>
                </div>
                <button onclick="mostrarFormularioServicio()" class="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
                    <i class="fas fa-plus"></i>
                    Agregar servicio
                </button>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6 border">
                <div id="formularioServicio" class="hidden mb-8">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Nuevo servicio</h3>
                    <form onsubmit="agregarServicio(event)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del servicio</label>
                            <input type="text" id="nuevoServicioNombre" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="Ej: Consulta Legal">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                            <input type="number" id="nuevoServicioPrecio" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="Ej: 50000">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                            <textarea id="nuevoServicioDescripcion" required rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="Descripción del servicio..."></textarea>
                        </div>
                        <div class="md:col-span-2 flex justify-end gap-3 flex-wrap">
                            <button type="submit" class="bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition">Guardar</button>
                            <button type="button" onclick="ocultarFormularioServicio()" class="bg-white border text-gray-900 px-5 py-2 rounded-full font-medium hover:bg-gray-50 transition">Cancelar</button>
                        </div>
                    </form>
                </div>

                <h3 class="text-lg font-semibold text-gray-900 mb-4">Servicios existentes</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${appData.servicios.map(s => `
                        <div class="bg-gray-50 p-5 rounded-lg border">
                            <h4 class="font-semibold text-gray-900">${s.nombre}</h4>
                            <p class="text-sm text-gray-600 mt-1 mb-4">${s.descripcion}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-lg font-semibold text-gray-900">$${s.precio.toLocaleString()}</span>
                                <button onclick="mostrarEditarServicio(${s.id})" class="bg-white border text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition">
                                    <i class="fas fa-edit"></i>
                                    Editar
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `,

    // Página de Agendamientos en Panel Administrativo
    adminAgendamientos: () => {
        const pendientesOrdenados = [...(appData.agendamientosPendientes || [])].sort((a, b) => {
            const da = new Date(`${a.fecha}T${a.hora || '00:00'}`);
            const db = new Date(`${b.fecha}T${b.hora || '00:00'}`);
            return db - da;
        });

        const historialOrdenado = [...(appData.agendamientosHistorial || [])].sort((a, b) => {
            const da = new Date(`${a.fecha}T${a.hora || '00:00'}`);
            const db = new Date(`${b.fecha}T${b.hora || '00:00'}`);
            return db - da;
        });

        return `
            <div class="max-w-6xl mx-auto px-4 py-12">
                <div class="flex items-end justify-between gap-6 flex-wrap mb-6">
                    <div>
                        <h2 class="text-3xl font-semibold text-gray-900">Agendamientos</h2>
                        <p class="text-sm text-gray-600 mt-1">Gestiona pagos, estados y cotizaciones.</p>
                    </div>
                    <div class="flex gap-2 flex-wrap">
                        <button onclick="abrirModalCotizacionLibre()" class="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
                            <i class="fas fa-file-invoice"></i>
                            Cotización libre
                        </button>
                        <button onclick="navegar('adminCalendario')" class="bg-white border text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition">
                            <i class="fas fa-calendar-alt"></i>
                            Ver calendario
                        </button>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6 border">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Pendientes de pago</h3>
                    <div class="space-y-4">
                        ${pendientesOrdenados.map(a => `
                            <div class="bg-gray-50 p-4 rounded-lg border">
                                <div class="flex justify-between items-center gap-4 flex-wrap">
                                    <div>
                                        <div class="text-sm text-gray-500">${a.materia}</div>
                                        <div class="font-semibold text-gray-900">${a.nombre}</div>
                                        <div class="text-sm text-gray-600 mt-1">${new Date(a.fecha).toLocaleDateString()} • ${a.hora}</div>
                                    </div>
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="text-xs px-3 py-1 rounded-full bg-white border text-gray-700">${a.estado}</span>
                                        <button onclick="mostrarDetallesAgendamiento(${a.id})" class="bg-white border text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition">Ver</button>
                                        <button onclick="abrirModalPago(${a.id})" class="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">Confirmar pago</button>
                                        ${a.estado === 'Confirmado' ? `<button onclick="abrirModalCotizacion(${a.id})" class="bg-white border text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition">Cotizar</button>` : ''}
                                    </div>
                                </div>
                                <div class="mt-3 text-sm text-gray-600">Monto: <span class="font-semibold text-gray-900">$${a.monto.toLocaleString()}</span></div>
                            </div>
                        `).join('')}
                    </div>

                    <h3 class="text-lg font-semibold text-gray-900 mt-8 mb-4">Historial</h3>
                    <div class="space-y-4">
                        ${historialOrdenado.map(a => `
                            <div class="bg-white p-4 rounded-lg border">
                                <div class="flex justify-between items-center gap-4 flex-wrap">
                                    <div>
                                        <div class="text-sm text-gray-500">${a.materia}</div>
                                        <div class="font-semibold text-gray-900">${a.nombre}</div>
                                        <div class="text-sm text-gray-600 mt-1">${new Date(a.fecha).toLocaleDateString()} • ${a.hora}</div>
                                    </div>
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="text-xs px-3 py-1 rounded-full bg-gray-50 border text-gray-700">${a.estado}</span>
                                        <button onclick="mostrarDetallesAgendamiento(${a.id})" class="bg-white border text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition">Ver</button>
                                        ${a.estado === 'Confirmado' ? `<button onclick="abrirModalCotizacion(${a.id})" class="bg-white border text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition">Cotizar</button>` : ''}
                                    </div>
                                </div>
                                <div class="mt-3 text-sm text-gray-600">Monto: <span class="font-semibold text-gray-900">$${a.monto.toLocaleString()}</span></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // Página de Usuarios en Panel Administrativo
    adminUsuarios: () => `
        <div class="max-w-6xl mx-auto px-4 py-12">
            <h2 class="text-3xl font-semibold text-gray-900 mb-8">Usuarios</h2>
            <div class="bg-white rounded-lg shadow-md p-6 border">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Lista de usuarios</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${appData.usuarios.lista.map(u => `
                        <div class="bg-gray-50 p-5 rounded-lg border">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm text-gray-600">${u.email}</span>
                                <span class="text-xs px-3 py-1 rounded-full bg-white border text-gray-700">${u.estado}</span>
                            </div>
                            <div class="text-sm text-gray-700 mb-4">
                                <div><strong>Nombre:</strong> ${u.nombre}</div>
                                <div><strong>Teléfono:</strong> ${u.telefono}</div>
                            </div>
                            <button onclick="mostrarDetallesUsuario(${u.id})" class="bg-white border text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition">
                                Ver detalles
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `,

    // Página de WhatsApp Bot
    whatsappMockup: () => `
        <section class="py-12 bg-white">
            <div class="max-w-6xl mx-auto px-4">
                <div class="flex items-end justify-between gap-6 flex-wrap">
                    <div>
                        <h2 class="text-3xl md:text-4xl font-semibold text-gray-900">Asistente por WhatsApp</h2>
                        <p class="text-gray-600 mt-2 max-w-2xl">
                            Orientación, consulta de citas y acceso a gestión de reagendamiento o cancelación.
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <button class="px-4 py-2 rounded-full bg-white border text-gray-900 hover:bg-gray-50" onclick="waReset()">Reiniciar conversación</button>
                        <button class="px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800" onclick="waStartMenu()">Mostrar menú</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 items-start">
                    <div class="wa-phone">
                        <div class="wa-frame">
                            <div class="wa-header px-4 py-3 flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">SGL</div>
                                <div class="flex-1">
                                    <div class="font-semibold leading-tight">SGL Bot</div>
                                    <div class="wa-subtitle text-xs">en línea</div>
                                </div>
                                <div class="flex items-center gap-4 text-sm" aria-hidden="true">
                                    <i class="fas fa-video"></i>
                                    <i class="fas fa-phone"></i>
                                    <i class="fas fa-ellipsis-v"></i>
                                </div>
                            </div>

                            <div class="wa-chat wa-wallpaper">
                                <div id="waChat" class="wa-scrollbar h-[520px] overflow-y-auto px-4 py-4 space-y-3">
                                    <!-- Mensajes inyectados por JS -->
                                </div>
                            </div>

                            <div class="px-3 py-3 bg-[#111b21] border-t border-white/5">
                                <div class="flex items-center gap-2">
                                    <button class="wa-btn w-10 h-10 rounded-full flex items-center justify-center" type="button" title="Adjuntar" aria-label="Adjuntar">
                                        <i class="fas fa-paperclip"></i>
                                    </button>
                                    <div class="wa-input flex-1 rounded-full px-4 py-2 text-sm text-white/90 border border-white/5">
                                        <span class="text-white/50">Escribe un mensaje</span>
                                    </div>
                                    <button class="bg-green-600 hover:bg-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center" type="button" title="Enviar" aria-label="Enviar" onclick="waAutoReplyFromInput()">
                                        <i class="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                                <p class="text-xs text-gray-400 mt-2">
                                    Nota: usa las acciones rápidas para simular el flujo.
                                </p>
                            </div>
                        </div>
                    </div>

                    <aside class="bg-gray-50 border rounded-lg p-6">
                        <h3 class="text-xl font-semibold text-gray-900">Acciones rápidas</h3>
                        <p class="text-sm text-gray-600 mt-2">
                            Simula el flujo para consultar, reagendar o cancelar.
                        </p>

                        <div class="mt-5 rounded-xl border bg-[#111b21] p-4">
                            <div class="text-xs text-white/70 mb-3">Simulaciones</div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button class="wa-quick px-4 py-3 rounded-lg text-left" onclick="waFlowConsulta()">
                                    <div class="font-semibold">Consultar</div>
                                    <div class="text-xs text-white/70">Ver detalles de una cita existente</div>
                                </button>
                                <button class="wa-quick px-4 py-3 rounded-lg text-left" onclick="waFlowReagendar()">
                                    <div class="font-semibold">Reagendar</div>
                                    <div class="text-xs text-white/70">Abrir gestión web</div>
                                </button>
                                <button class="wa-quick px-4 py-3 rounded-lg text-left" onclick="waFlowCancelar()">
                                    <div class="font-semibold">Cancelar</div>
                                    <div class="text-xs text-white/70">Abrir gestión web</div>
                                </button>
                                <button class="wa-quick px-4 py-3 rounded-lg text-left" onclick="waStartMenu()">
                                    <div class="font-semibold">Menú</div>
                                    <div class="text-xs text-white/70">Volver a ver las opciones</div>
                                </button>
                            </div>
                        </div>

                        <div class="mt-6 p-4 bg-white rounded-lg border">
                            <h4 class="font-semibold text-gray-900">Menú inicial</h4>
                            <pre class="mt-2 text-xs text-gray-700 whitespace-pre-wrap">1) Consultar mi cita
2) Reagendar (vía web)
3) Cancelar (vía web)</pre>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    `,

    // Página de Calendario en Panel Administrativo
    adminCalendario: () => {
        const todos = appData.agendamientos.filter(() => true);
        const ordenados = [...todos].sort((a, b) => {
            const da = new Date(`${a.fecha}T${a.hora || '00:00'}`);
            const db = new Date(`${b.fecha}T${b.hora || '00:00'}`);
            // Más reciente primero
            return db - da;
        });

        return `
            <div class="max-w-6xl mx-auto px-4 py-12">
                <h2 class="text-3xl font-semibold text-gray-900 mb-2">Calendario</h2>
                <p class="text-gray-600 mb-8">Consultas ordenadas por fecha y hora.</p>

                <div class="bg-white rounded-lg shadow-md p-6 border">
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-sm">
                            <thead>
                                <tr class="text-left border-b text-gray-600">
                                    <th class="py-3 pr-4 font-medium">Fecha</th>
                                    <th class="py-3 pr-4 font-medium">Hora</th>
                                    <th class="py-3 pr-4 font-medium">Cliente</th>
                                    <th class="py-3 pr-4 font-medium">Materia</th>
                                    <th class="py-3 pr-4 font-medium">Estado</th>
                                    <th class="py-3 pr-4 font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ordenados.map(a => `
                                    <tr class="border-b last:border-b-0">
                                        <td class="py-3 pr-4">${a.fecha}</td>
                                        <td class="py-3 pr-4">${a.hora || '-'}</td>
                                        <td class="py-3 pr-4">${a.nombre}</td>
                                        <td class="py-3 pr-4">${a.materia}</td>
                                        <td class="py-3 pr-4">
                                            <span class="text-xs px-3 py-1 rounded-full bg-gray-50 border text-gray-700">${a.estado}</span>
                                        </td>
                                        <td class="py-3 pr-4">
                                            <button class="bg-white border text-gray-900 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-50" onclick="mostrarDetallesAgendamiento(${a.id})">Ver</button>
                                            ${a.estado === 'Pendiente Pago' ? `<button class="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium ml-2 hover:bg-gray-800" onclick="abrirModalPago(${a.id})">Confirmar pago</button>` : ''}
                                            ${a.estado === 'Confirmado' ? `<button class="bg-white border text-gray-900 px-3 py-1 rounded-full text-sm font-medium ml-2 hover:bg-gray-50" onclick="abrirModalCotizacion(${a.id})">Cotizar</button>` : ''}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    // Header Admin
    adminHeader: () => `
        <header class="bg-white shadow-md sticky top-0 z-50 border-b">
            <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <button onclick="navegar('home')" class="font-bold text-gray-900 tracking-tight" aria-label="Ir al inicio">SGL</button>
                    <div>
                        <h1 class="text-xl font-medium tracking-tight text-gray-900">Panel Administrativo</h1>
                        <p class="text-xs text-gray-500">Gestión de estudio jurídico</p>
                    </div>
                </div>
                <nav class="flex gap-4 items-center">
                    <button onclick="navegar('adminDashboard')" class="text-sm text-gray-700 hover:text-gray-900 transition">Dashboard</button>
                    <button onclick="navegar('adminAgendamientos')" class="text-sm text-gray-700 hover:text-gray-900 transition">Agendamientos</button>
                    <button onclick="navegar('adminCalendario')" class="text-sm text-gray-700 hover:text-gray-900 transition">Calendario</button>
                    <button onclick="navegar('adminServicios')" class="text-sm text-gray-700 hover:text-gray-900 transition">Servicios</button>
                    <button onclick="navegar('adminUsuarios')" class="text-sm text-gray-700 hover:text-gray-900 transition">Usuarios</button>
                    <button onclick="cerrarSesion()" class="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">Cerrar sesión</button>
                </nav>
            </div>
        </header>
    `,

    // Página de gestión cancelada
    gestionCancelado: () => {
        const r = appData.gestionResultado || {};
        return `
            <div class="max-w-2xl mx-auto py-12">
                <div class="bg-white rounded-lg shadow-lg p-8 text-center border">
                    <div class="mb-6">
                        <i class="fas fa-ban text-gray-900 text-6xl"></i>
                    </div>
                    <h2 class="text-3xl font-semibold text-gray-900 mb-4">Cita cancelada</h2>
                    <p class="text-gray-600 mb-6">Tu solicitud de cancelación fue registrada correctamente.</p>

                    <div class="bg-gray-50 p-6 rounded-lg mb-6 text-left border">
                        <h3 class="font-semibold text-gray-900 mb-4">Detalle</h3>
                        <div class="space-y-2 text-sm text-gray-700">
                            <div class="flex justify-between"><span class="text-gray-600">ID</span><span class="font-medium">${r.id || '-'}</span></div>
                            <div class="flex justify-between"><span class="text-gray-600">Materia</span><span class="font-medium">${r.materia || '-'}</span></div>
                            <div class="flex justify-between"><span class="text-gray-600">Fecha</span><span class="font-medium">${r.fecha || '-'}</span></div>
                            <div class="flex justify-between"><span class="text-gray-600">Hora</span><span class="font-medium">${r.hora || '-'}</span></div>
                            <div class="border-t pt-2 mt-2 flex justify-between text-base font-semibold">
                                <span>Estado</span>
                                <span class="text-gray-900">Cancelado</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 justify-center">
                        <button onclick="navegar('home')" class="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">Volver al inicio</button>
                    </div>
                </div>
            </div>
        `;
    },

    // Página de gestión reagendada
    gestionReagendado: () => {
        const r = appData.gestionResultado || {};
        return `
            <div class="max-w-2xl mx-auto py-12">
                <div class="bg-white rounded-lg shadow-lg p-8 text-center border">
                    <div class="mb-6">
                        <i class="fas fa-calendar-check text-gray-900 text-6xl"></i>
                    </div>
                    <h2 class="text-3xl font-semibold text-gray-900 mb-4">Cita reagendada</h2>
                    <p class="text-gray-600 mb-6">Tu cita fue actualizada correctamente.</p>

                    <div class="bg-gray-50 p-6 rounded-lg mb-6 text-left border">
                        <h3 class="font-semibold text-gray-900 mb-4">Detalle</h3>
                        <div class="space-y-2 text-sm text-gray-700">
                            <div class="flex justify-between"><span class="text-gray-600">ID</span><span class="font-medium">${r.id || '-'}</span></div>
                            <div class="flex justify-between"><span class="text-gray-600">Materia</span><span class="font-medium">${r.materia || '-'}</span></div>

                            <div class="mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nueva fecha y hora</div>
                            <div class="flex justify-between"><span class="text-gray-600">Fecha</span><span class="font-medium">${r.fecha || '-'}</span></div>
                            <div class="flex justify-between"><span class="text-gray-600">Hora</span><span class="font-medium">${r.hora || '-'}</span></div>

                            ${(r.fechaAnterior || r.horaAnterior) ? `
                                <div class="mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Anterior</div>
                                <div class="flex justify-between"><span class="text-gray-600">Fecha</span><span class="font-medium">${r.fechaAnterior || '-'}</span></div>
                                <div class="flex justify-between"><span class="text-gray-600">Hora</span><span class="font-medium">${r.horaAnterior || '-'}</span></div>
                            ` : ''}

                            <div class="border-t pt-2 mt-2 flex justify-between text-base font-semibold">
                                <span>Estado</span>
                                <span class="text-gray-900">Reagendado</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 justify-center">
                        <button onclick="navegar('home')" class="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">Volver al inicio</button>
                        <button onclick="irGestionWeb()" class="bg-white border text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition">Gestionar otra cita</button>
                    </div>
                </div>
            </div>
        `;
    },
};

// Exponer en global (evita "Components is not defined" si el script se carga como módulo/orden distinto)
window.Components = Components;
