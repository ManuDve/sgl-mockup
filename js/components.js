// Componentes reutilizables de la aplicación

const Components = {
    // Header/Navbar
    header: () => `
        <header class="bg-white text-gray-900 shadow-md sticky top-0 z-50 border-b">
            <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <i class="fas fa-gavel text-xl text-gray-700"></i>
                    <h1 class="text-xl font-medium tracking-tight">${appData.estudioInfo.nombre}</h1>
                </div>
                <nav class="flex gap-4 items-center">
                    <button onclick="navegar('home')" class="text-sm text-gray-700 hover:text-gray-900 transition">Inicio</button>
                    <button onclick="navegar('servicios')" class="text-sm text-gray-700 hover:text-gray-900 transition">Servicios</button>
                    <button onclick="navegar('whatsapp')" class="text-sm text-gray-700 hover:text-gray-900 transition">WhatsApp Bot</button>
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
            <h2 class="text-4xl font-bold text-blue-900 mb-8 text-center">Nuestros Servicios</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${appData.servicios.map(s => Components.servicioCard(s)).join('')}
            </div>
        </div>
    `,

    // Footer
    footer: () => `
        <footer class="bg-gray-800 text-white py-12">
            <div class="max-w-6xl mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                            <i class="fas fa-phone"></i>
                            Contacto
                        </h3>
                        <p class="text-gray-300">${appData.estudioInfo.telefono}</p>
                        <p class="text-gray-300">${appData.estudioInfo.email}</p>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                            <i class="fas fa-map-marker-alt"></i>
                            Ubicación
                        </h3>
                        <p class="text-gray-300">${appData.estudioInfo.direccion}</p>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                            <i class="fas fa-comments"></i>
                            WhatsApp
                        </h3>
                        <a href="https://wa.me/${appData.estudioInfo.whatsapp.replace(/\s/g, '')}" target="_blank" class="text-green-400 hover:text-green-300">
                            Contactar por WhatsApp
                        </a>
                    </div>
                </div>
                <div class="border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; 2026 ${appData.estudioInfo.nombre}. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    `,

    // Página de Confirmación
    confirmacion: () => `
        <div class="max-w-2xl mx-auto py-12">
            <div class="bg-white rounded-lg shadow-lg p-8 text-center">
                <div class="mb-6">
                    <i class="fas fa-check-circle text-green-600 text-6xl"></i>
                </div>
                <h2 class="text-3xl font-bold text-blue-900 mb-4">¡Agendamiento Confirmado!</h2>
                <p class="text-gray-600 mb-6">Tu consulta ha sido registrada exitosamente. Recibirás confirmación por correo y WhatsApp.</p>
                
                <div class="bg-blue-50 p-6 rounded-lg mb-6 text-left">
                    <h3 class="font-bold text-blue-900 mb-4">Detalles de tu Consulta:</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between"><span>Nombre:</span><span id="confNombre" class="font-semibold">-</span></div>
                        <div class="flex justify-between"><span>Email:</span><span id="confEmail" class="font-semibold">-</span></div>
                        <div class="flex justify-between"><span>Materia:</span><span id="confMateria" class="font-semibold">-</span></div>
                        <div class="flex justify-between"><span>Fecha:</span><span id="confFecha" class="font-semibold">-</span></div>
                        <div class="flex justify-between"><span>Hora:</span><span id="confHora" class="font-semibold">-</span></div>
                        <div class="border-t pt-2 mt-2 flex justify-between text-base font-bold">
                            <span>Monto a Pagar:</span>
                            <span id="confMonto" class="text-green-600">-</span>
                        </div>
                    </div>
                </div>

                <div class="bg-yellow-50 p-4 rounded-lg mb-6">
                    <p class="text-sm text-gray-700">
                        Próximos pasos: Realiza la transferencia bancaria al número que aparece en tu correo de confirmación. 
                        Al confirmar el pago, recibirás la información para tu consulta.
                    </p>
                </div>

                <button onclick="navegar('home')" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                    Volver al Inicio
                </button>
            </div>
        </div>
    `,

    // Panel Administrativo - Header
    adminHeader: () => `
        <header class="bg-white text-gray-900 shadow-md border-b sticky top-0 z-50">
            <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <i class="fas fa-gavel text-xl text-gray-700"></i>
                    <h1 class="text-lg font-medium">${appData.estudioInfo.nombre} <span class="text-gray-500">/ Admin</span></h1>
                </div>
                <nav class="flex gap-4">
                    <button onclick="navegar('adminDashboard')" class="text-sm text-gray-700 hover:text-gray-900 transition">Dashboard</button>
                    <button onclick="navegar('adminAgendamientos')" class="text-sm text-gray-700 hover:text-gray-900 transition">Agendamientos</button>
                    <button onclick="navegar('adminCalendario')" class="text-sm text-gray-700 hover:text-gray-900 transition">Calendario</button>
                    <button onclick="navegar('adminServicios')" class="text-sm text-gray-700 hover:text-gray-900 transition">Servicios</button>
                    <button onclick="cerrarSesion()" class="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
                        Cerrar sesión
                    </button>
                </nav>
            </div>
        </header>
    `,

    // Panel Administrativo - Sidebar
    adminSidebar: () => `
        <div class="bg-white text-gray-900 w-64 min-h-screen py-8 px-4 border-r">
            <div class="mb-8">
                <h2 class="text-sm font-semibold text-gray-900">Panel administrativo</h2>
                <p class="text-xs text-gray-500 mt-1">Bienvenido, ${appData.usuario.nombre}</p>
            </div>
            <nav class="space-y-1">
                <a href="#" onclick="navegar('adminDashboard')" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                    <i class="fas fa-tachometer-alt text-gray-500"></i>
                    Dashboard
                </a>
                <a href="#" onclick="navegar('adminServicios')" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                    <i class="fas fa-briefcase text-gray-500"></i>
                    Servicios
                </a>
                <a href="#" onclick="navegar('adminAgendamientos')" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                    <i class="fas fa-calendar-check text-gray-500"></i>
                    Agendamientos
                </a>
                <a href="#" onclick="navegar('adminCalendario')" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                    <i class="fas fa-calendar-alt text-gray-500"></i>
                    Calendario
                </a>
                <a href="#" onclick="navegar('adminUsuarios')" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                    <i class="fas fa-users text-gray-500"></i>
                    Usuarios
                </a>
            </nav>
        </div>
    `,

    // Panel Administrativo - Footer
    adminFooter: () => `
        <footer class="bg-gray-800 text-white py-4">
            <div class="max-w-6xl mx-auto px-4 text-center">
                <p class="text-sm">&copy; 2026 ${appData.estudioInfo.nombre}. Todos los derechos reservados.</p>
            </div>
        </footer>
    `,

    // Página de Dashboard Administrativo
    adminDashboard: () => `
        <div class="max-w-6xl mx-auto px-4 py-12">
            <h2 class="text-3xl font-bold text-blue-900 mb-8">Dashboard</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Tarjetas de resumen -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-blue-900 mb-4">Resumen de Agendamientos</h3>
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-2xl font-bold text-green-600">${appData.resumenAgendamientos.total}</span>
                        <i class="fas fa-calendar-check text-4xl text-green-500"></i>
                    </div>
                    <p class="text-gray-600">Total de agendamientos realizados en el período seleccionado.</p>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-blue-900 mb-4">Servicios Más Solicitados</h3>
                    <ul class="text-gray-700">
                        ${appData.servicios
                            .sort((a, b) => b.solicitudes - a.solicitudes)
                            .slice(0, 5)
                            .map(s => `<li class="flex justify-between mb-2"><span>${s.nombre}</span><span class="font-semibold">${s.solicitudes} solicitudes</span></li>`)
                            .join('')}
                    </ul>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold text-blue-900 mb-4">Estadísticas de Usuarios</h3>
                    <div class="flex gap-4">
                        <div class="flex-1 bg-blue-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-500">Total de Usuarios</p>
                            <p class="text-xl font-bold text-blue-900">${appData.usuarios.total}</p>
                        </div>
                        <div class="flex-1 bg-green-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-500">Usuarios Activos</p>
                            <p class="text-xl font-bold text-green-900">${appData.usuarios.activos}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gráficos -->
            <div class="mt-8">
                <h3 class="text-lg font-semibold text-blue-900 mb-4">Actividad Reciente</h3>
                <div id="graficoActividad" class="bg-white rounded-lg shadow-md p-4 h-64"></div>
            </div>
        </div>
    `,

    // Página de Servicios en Panel Administrativo
    adminServicios: () => `
        <div class="max-w-6xl mx-auto px-4 py-12">
            <h2 class="text-3xl font-bold text-blue-900 mb-8">Servicios</h2>
            <div class="bg-white rounded-lg shadow-md p-6">
                <button onclick="mostrarFormularioServicio()" class="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition mb-4">
                    <i class="fas fa-plus"></i>
                    Agregar Servicio
                </button>
                
                <div id="formularioServicio" class="hidden mb-6">
                    <h3 class="text-lg font-semibold text-blue-900 mb-4">Nuevo Servicio</h3>
                    <form onsubmit="agregarServicio(event)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Servicio</label>
                            <input type="text" id="nuevoServicioNombre" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="Ejemplo: Consulta Legal">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                            <input type="number" id="nuevoServicioPrecio" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="Ejemplo: 50000">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                            <textarea id="nuevoServicioDescripcion" required rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900" placeholder="Descripción del servicio..."></textarea>
                        </div>
                        <div class="md:col-span-2 flex justify-end gap-4">
                            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2">
                                <i class="fas fa-check"></i>
                                Guardar Servicio
                            </button>
                            <button type="button" onclick="ocultarFormularioServicio()" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-400 transition">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>

                <h3 class="text-lg font-semibold text-blue-900 mb-4">Servicios Existentes</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${appData.servicios.map(s => `
                        <div class="bg-blue-50 p-4 rounded-lg shadow-md">
                            <h4 class="font-bold text-blue-900">${s.nombre}</h4>
                            <p class="text-sm text-gray-700 mb-2">${s.descripcion}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-lg font-bold text-green-600">$${s.precio.toLocaleString()}</span>
                                <button onclick="mostrarEditarServicio(${s.id})" class="bg-yellow-500 text-white px-3 py-1 rounded-lg font-bold hover:bg-yellow-400 transition">
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
    adminAgendamientos: () => `
        <div class="max-w-6xl mx-auto px-4 py-12">
            <h2 class="text-3xl font-bold text-blue-900 mb-8">Agendamientos</h2>
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold text-blue-900 mb-4">Agendamientos Pendientes</h3>
                <div class="space-y-4">
                    ${appData.agendamientos.pendientes.map(a => `
                        <div class="bg-blue-50 p-4 rounded-lg shadow-md">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm text-gray-500">Consulta de ${a.nombre}</span>
                                <span class="text-sm font-bold text-yellow-600">${a.estado}</span>
                            </div>
                            <div class="text-sm text-gray-700 mb-2">
                                <div><strong>Fecha:</strong> ${new Date(a.fecha).toLocaleDateString()}</div>
                                <div><strong>Hora:</strong> ${a.hora}</div>
                            </div>
                            <button onclick="mostrarDetallesAgendamiento(${a.id})" class="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-800 transition">
                                <i class="fas fa-eye"></i>
                                Ver Detalles
                            </button>
                        </div>
                    `).join('')}
                </div>

                <h3 class="text-lg font-semibold text-blue-900 mt-6 mb-4">Historial de Agendamientos</h3>
                <div class="space-y-4">
                    ${appData.agendamientos.historial.map(a => `
                        <div class="bg-gray-50 p-4 rounded-lg shadow-md">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm text-gray-500">Consulta de ${a.nombre}</span>
                                <span class="text-sm font-bold ${a.estado === 'Confirmado' ? 'text-green-600' : 'text-red-600'}">${a.estado}</span>
                            </div>
                            <div class="text-sm text-gray-700 mb-2">
                                <div><strong>Fecha:</strong> ${new Date(a.fecha).toLocaleDateString()}</div>
                                <div><strong>Hora:</strong> ${a.hora}</div>
                            </div>
                            <div class="text-sm text-gray-500">
                                <strong>Monto:</strong> $${a.monto.toLocaleString()}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `,

    // Página de Usuarios en Panel Administrativo
    adminUsuarios: () => `
        <div class="max-w-6xl mx-auto px-4 py-12">
            <h2 class="text-3xl font-bold text-blue-900 mb-8">Usuarios</h2>
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold text-blue-900 mb-4">Lista de Usuarios</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${appData.usuarios.lista.map(u => `
                        <div class="bg-blue-50 p-4 rounded-lg shadow-md">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm text-gray-500">${u.email}</span>
                                <span class="text-sm font-bold ${u.estado === 'Activo' ? 'text-green-600' : 'text-red-600'}">${u.estado}</span>
                            </div>
                            <div class="text-sm text-gray-700 mb-2">
                                <div><strong>Nombre:</strong> ${u.nombre}</div>
                                <div><strong>Teléfono:</strong> ${u.telefono}</div>
                            </div>
                            <button onclick="mostrarDetallesUsuario(${u.id})" class="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-800 transition">
                                <i class="fas fa-eye"></i>
                                Ver Detalles
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `,

    // Página de WhatsApp Bot (Nueva sección)
    whatsappMockup: () => `
        <section class="py-12 bg-white">
            <div class="max-w-6xl mx-auto px-4">
                <div class="flex items-end justify-between gap-6 flex-wrap">
                    <div>
                        <h2 class="text-4xl font-bold text-blue-900">Mockup WhatsApp Bot</h2>
                        <p class="text-gray-600 mt-2 max-w-2xl">
                            Simulación del flujo de Consulta, Reagendamiento y Cancelación. El bot muestra un menú al iniciar la conversación.
                            Esta sección es un mockup (sin integración real).
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <button class="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200" onclick="waReset()">Reiniciar conversación</button>
                        <button class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700" onclick="waStartMenu()">Mostrar menú</button>
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
                                    Nota: el input es decorativo. Usa los botones de la derecha para simular el flujo.
                                </p>
                            </div>
                        </div>
                    </div>

                    <aside class="bg-gray-50 border rounded-lg p-6">
                        <h3 class="text-xl font-bold text-gray-900">Acciones rápidas (mock)</h3>
                        <p class="text-sm text-gray-600 mt-2">
                            Estas acciones insertan mensajes del usuario y del bot para mostrar el flujo.
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
                                    <div class="text-xs text-white/70">Deriva a web con verificación</div>
                                </button>
                                <button class="wa-quick px-4 py-3 rounded-lg text-left" onclick="waFlowCancelar()">
                                    <div class="font-semibold">Cancelar</div>
                                    <div class="text-xs text-white/70">Deriva a web con verificación</div>
                                </button>
                                <button class="wa-quick px-4 py-3 rounded-lg text-left" onclick="waStartMenu()">
                                    <div class="font-semibold">Menú</div>
                                    <div class="text-xs text-white/70">Volver a ver las opciones</div>
                                </button>
                            </div>
                        </div>

                        <div class="mt-6 p-4 bg-white rounded-lg border">
                            <h4 class="font-bold text-gray-900">Menú inicial (texto)</h4>
                            <pre class="mt-2 text-xs text-gray-700 whitespace-pre-wrap">1) Consultar mi cita
2) Reagendar (vía web)
3) Cancelar (vía web)</pre>
                        </div>

                        <div class="mt-6 text-xs text-gray-500">
                            Recomendación de mock: mantener mensajes cortos, con opciones numeradas.
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    `,

    // Página de Calendario en Panel Administrativo (Nueva sección)
    adminCalendario: () => {
        const todos = appData.agendamientos.filter(() => true);
        const ordenados = [...todos].sort((a, b) => {
            const da = new Date(`${a.fecha}T${a.hora || '00:00'}`);
            const db = new Date(`${b.fecha}T${b.hora || '00:00'}`);
            return da - db;
        });

        return `
            <div class="max-w-6xl mx-auto px-4 py-12">
                <h2 class="text-3xl font-bold text-blue-900 mb-2">Calendario</h2>
                <p class="text-gray-600 mb-8">Mockup de calendarización de consultas. Ordenado por fecha y hora.</p>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-sm">
                            <thead>
                                <tr class="text-left border-b">
                                    <th class="py-3 pr-4">Fecha</th>
                                    <th class="py-3 pr-4">Hora</th>
                                    <th class="py-3 pr-4">Cliente</th>
                                    <th class="py-3 pr-4">Materia</th>
                                    <th class="py-3 pr-4">Estado</th>
                                    <th class="py-3 pr-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ordenados.map(a => `
                                    <tr class="border-b last:border-b-0">
                                        <td class="py-3 pr-4">${a.fecha}</td>
                                        <td class="py-3 pr-4">${a.hora || '-'}</td>
                                        <td class="py-3 pr-4">${a.nombre}</td>
                                        <td class="py-3 pr-4">${a.materia}</td>
                                        <td class="py-3 pr-4">${a.estado}</td>
                                        <td class="py-3 pr-4">
                                            <button class="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium" onclick="mostrarDetallesAgendamiento(${a.id})">Ver</button>
                                            ${a.estado === 'Pendiente Pago' ? `<button class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium ml-2" onclick="abrirModalPago(${a.id})">Confirmar pago</button>` : ''}
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
};
