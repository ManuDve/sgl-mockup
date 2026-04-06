# SGL Mockup

Sistema de gestión legal mockup - Plataforma de agendamiento de consultas para estudio jurídico.

## Descripción

Aplicación web completa con landing page responsiva y panel administrativo para la gestión de agendamientos, servicios y cotizaciones de un estudio jurídico.

## Características

- Landing page responsiva
- Formulario de agendamiento de consultas
- Selector de servicios con precios dinámicos
- Panel administrativo con autenticación
- Gestión de agendamientos y servicios
- Confirmación de pagos
- Generador de cotizaciones
- Dashboard de estadísticas

## Requisitos

- Node.js 14 o superior (para desarrollo local)
- Navegador moderno con soporte para ES6

## Instalación y Ejecución Local

1. Clonar el repositorio:
```bash
git clone https://github.com/ManuDve/sgl-mockup.git
cd sgl-mockup
```

2. Instalar dependencias (si aplica):
```bash
npm install
```

3. Ejecutar el servidor local:
```bash
npm start
```

4. Acceder en el navegador:
```
http://localhost:3000
```

## Estructura del Proyecto

```
├── index.html          Página principal
├── package.json        Configuración del proyecto
├── server.js           Servidor Node.js
├── README.md           Este archivo
└── js/
    ├── app.js          Lógica principal
    ├── admin.js        Funciones administrativas
    ├── components.js   Componentes reutilizables
    └── data.js         Datos y configuración
```

## Acceso al Panel Administrativo

Usuario: `admin`
Contraseña: `123456`

## Tecnologías

- HTML5
- CSS3 / Tailwind CSS
- JavaScript (Vanilla)
- Node.js

## Despliegue

Este proyecto está configurado para desplegarse en GitHub Pages. Consulta la rama `gh-pages` para más detalles.

## Licencia

MIT

## Autor

Manuel Dve
