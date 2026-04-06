# Guía de Despliegue en GitHub Pages

## Paso 1: Inicializar el Repositorio Git

Ejecuta los comandos que GitHub te proporcionó en la carpeta del proyecto:

```bash
echo "# sgl-mockup" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/ManuDve/sgl-mockup.git
git push -u origin main
```

## Paso 2: Agregar Todos los Archivos del Proyecto

```bash
git add .
git commit -m "Initial project setup"
git push origin main
```

## Paso 3: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Accede a **Settings** → **Pages**
3. En "Source", selecciona:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Haz clic en **Save**

GitHub Pages generará automáticamente tu sitio en: `https://ManuDve.github.io/sgl-mockup`

## Paso 4: Verificar el Despliegue

- GitHub ejecutará el workflow automáticamente
- Espera a que se complete (generalmente toma 1-2 minutos)
- Accede a tu sitio en `https://ManuDve.github.io/sgl-mockup`

## Notas Importantes

- Los cambios en `main` se desplegarán automáticamente
- El servidor Node.js (`server.js`) es solo para desarrollo local
- GitHub Pages sirve archivos estáticos, por lo que la aplicación funcionará sin el servidor
- Si necesitas probar localmente: `npm start`

## Actualizaciones Futuras

Simplemente haz push a `main`:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

El sitio se actualizará automáticamente en pocos minutos.

