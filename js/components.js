// Componentes reutilizables de la aplicación

const Components = {
    // Header/Navbar
    header: () => `
        <header class="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
            <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <i class="fas fa-gavel text-2xl"></i>
                    <h1 class="text-2xl font-bold">${appData.estudioInfo.nombre}</h1>
                </div>
                <nav class="flex gap-6 items-center">
                    <button onclick="navegar('home')" class="hover:text-blue-200 transition">Inicio</button>
                    <button onclick="navegar('servicios')" class="hover:text-blue-200 transition">Servicios</button>
                    <button onclick="navegar('agendar')" class="bg-yellow-500 text-blue-900 px-4 py-2 rounded font-bold hover:bg-yellow-400 transition">
                        Agendar
                    </button>
                </nav>
            </div>
        </header>
    `,

    // Hero Section
    hero: () => `
        <section class="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
            <div class="max-w-6xl mx-auto px-4 text-center">
                <h2 class="text-5xl font-bold mb-4">Soluciones Jurídicas Profesionales</h2>
                <p class="text-xl mb-8 opacity-90">Agenda tu consulta legal de forma fácil y rápida, sin necesidad de registro</p>
                <button onclick="navegar('agendar')" class="bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-400 transition">
                    Agendar Consulta Ahora
                </button>
            </div>
        </section>
    `,

    // Tarjeta de Servicio
    servicioCard: (servicio) => `
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div class="flex items-start justify-between mb-4">
                <h3 class="text-xl font-bold text-blue-900">${servicio.nombre}</h3>
                <i class="fas fa-briefcase text-blue-500 text-2xl"></i>
            </div>
            <p class="text-gray-600 mb-4">${servicio.descripcion}</p>
            <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-green-600">$${servicio.precio.toLocaleString()}</span>
                <button onclick="agendar(${servicio.id})" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Agendar
                </button>
            </div>
        </div>
    `,

    // Formulario de Agendamiento
    formularioAgendar: () => `
        <div class="max-w-2xl mx-auto">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-3xl font-bold text-blue-900 mb-6">Agendar Consulta</h2>
                
                <form id="formAgendar" onsubmit="enviarFormulario(event)" class="space-y-6">
                    <!-- Datos Personales -->
                    <div class="border-b pb-6">
                        <h3 class="text-lg font-semibold text-blue-900 mb-4">Datos Personales</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                                <input type="text" name="nombre" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Juan Pérez">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="juan@ejemplo.com">
                            </div>
                        </div>
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                            <input type="tel" name="telefono" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="+56 9 1234 5678">
                        </div>
                    </div>

                    <!-- Consulta -->
                    <div class="border-b pb-6">
                        <h3 class="text-lg font-semibold text-blue-900 mb-4">Detalles de la Consulta</h3>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Materia Legal</label>
                            <select name="materia" required id="selectMateria" onchange="actualizarPrecio()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">-- Selecciona una materia --</option>
                                ${appData.servicios.map(s => `<option value="${s.id}">${s.nombre} - $${s.precio.toLocaleString()}</option>`).join('')}
                            </select>
                        </div>
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción de tu Consulta</label>
                            <textarea name="descripcion" required rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Describe brevemente tu consulta legal..."></textarea>
                        </div>
                    </div>

                    <!-- Fecha y Hora -->
                    <div class="border-b pb-6">
                        <h3 class="text-lg font-semibold text-blue-900 mb-4">Fecha y Hora</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                                <select name="fecha" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">-- Selecciona una fecha --</option>
                                    ${obtenerFechasDisponibles().map(f => `<option value="${f.fecha}">${f.dia}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                                <select name="hora" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">-- Selecciona una hora --</option>
                                    ${appData.horarios.map(h => `<option value="${h}">${h}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Resumen -->
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h3 class="text-lg font-semibold text-blue-900 mb-3">Resumen</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span>Consulta:</span>
                                <span id="resumenMateria" class="font-semibold">-</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Precio:</span>
                                <span id="resumenPrecio" class="font-semibold text-green-600">-</span>
                            </div>
                            <div class="border-t pt-2 mt-2 flex justify-between text-base font-bold">
                                <span>Total:</span>
                                <span id="resumenTotal" class="text-green-600">-</span>
                            </div>
                        </div>
                    </div>

                    <!-- Confirmación -->
                    <div class="flex items-center gap-2 bg-yellow-50 p-4 rounded-lg">
                        <i class="fas fa-info-circle text-yellow-600"></i>
                        <p class="text-sm text-gray-700">Recibirás confirmación por correo y WhatsApp con los detalles de tu consulta y instrucciones de pago.</p>
                    </div>

                    <!-- Botones -->
                    <div class="flex gap-4">
                        <button type="submit" class="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
                            <i class="fas fa-check"></i>
                            Confirmar Agendamiento
                        </button>
                        <button type="button" onclick="navegar('home')" class="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition">
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
        <header class="bg-gray-800 text-white shadow-md">
            <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <i class="fas fa-gavel text-2xl"></i>
                    <h1 class="text-xl font-bold">${appData.estudioInfo.nombre} - Admin</h1>
                </div>
                <nav class="flex gap-4">
                    <button onclick="navegar('adminDashboard')" class="hover:text-gray-300 transition">Dashboard</button>
                    <button onclick="navegar('adminServicios')" class="hover:text-gray-300 transition">Servicios</button>
                    <button onclick="navegar('adminAgendamientos')" class="hover:text-gray-300 transition">Agendamientos</button>
                    <button onclick="cerrarSesion()" class="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-500 transition">
                        Cerrar Sesión
                    </button>
                </nav>
            </div>
        </header>
    `,

    // Panel Administrativo - Sidebar
    adminSidebar: () => `
        <div class="bg-gray-900 text-white w-64 min-h-screen py-8 px-4">
            <div class="mb-8">
                <h2 class="text-lg font-bold mb-2">Panel Administrativo</h2>
                <p class="text-sm text-gray-400">Bienvenido, ${appData.usuario.nombre}</p>
            </div>
            <nav class="space-y-2">
                <a href="#" onclick="navegar('adminDashboard')" class="flex items-center gap-2 text-gray-300 hover:text-white transition">
                    <i class="fas fa-tachometer-alt"></i>
                    Dashboard
                </a>
                <a href="#" onclick="navegar('adminServicios')" class="flex items-center gap-2 text-gray-300 hover:text-white transition">
                    <i class="fas fa-briefcase"></i>
                    Servicios
                </a>
                <a href="#" onclick="navegar('adminAgendamientos')" class="flex items-center gap-2 text-gray-300 hover:text-white transition">
                    <i class="fas fa-calendar-check"></i>
                    Agendamientos
                </a>
                <a href="#" onclick="navegar('adminUsuarios')" class="flex items-center gap-2 text-gray-300 hover:text-white transition">
                    <i class="fas fa-users"></i>
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
                <button onclick="mostrarFormularioServicio()" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition mb-4">
                    <i class="fas fa-plus"></i>
                    Agregar Servicio
                </button>
                
                <div id="formularioServicio" class="hidden mb-6">
                    <h3 class="text-lg font-semibold text-blue-900 mb-4">Nuevo Servicio</h3>
                    <form onsubmit="agregarServicio(event)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Servicio</label>
                            <input type="text" id="nuevoServicioNombre" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ejemplo: Consulta Legal">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                            <input type="number" id="nuevoServicioPrecio" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ejemplo: 50000">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                            <textarea id="nuevoServicioDescripcion" required rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Descripción del servicio..."></textarea>
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
                            <button onclick="mostrarDetallesAgendamiento(${a.id})" class="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-blue-700 transition">
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
                            <button onclick="mostrarDetallesUsuario(${u.id})" class="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-blue-700 transition">
                                <i class="fas fa-eye"></i>
                                Ver Detalles
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `
};
