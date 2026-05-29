# NCS Visualizer

Visualizador de audio con efectos de partículas dinámicas y fireflies, construido con Electron.

## Características

- Visualización de audio en tiempo real usando WebGL2
- Efectos de partículas dinámicas que reaccionan al ritmo
- Fireflies que aparecen con los bajos
- Captura de audio del sistema mediante compartir pantalla
- Ventana transparente y personalizable

## Instalación

### Requisitos previos

- Node.js (v16 o superior)
- npm (incluido con Node.js)

### Pasos de instalación

1. Clona el repositorio o descarga el proyecto
2. Navega al directorio del proyecto:
   ```bash
   cd ncs-visualizer
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## Desarrollo

Para ejecutar la aplicación en modo desarrollo:

```bash
npm start
```

## Construcción del ejecutable

Para crear el ejecutable de la aplicación:

```bash
npm run build
```

### Ubicación del ejecutable

Después de ejecutar `npm run build`, el ejecutable se creará en:

**Windows:**
- `dist/ncs-visualizer Setup 1.0.0.exe` (instalador)
- `dist/win-unpacked/ncs-visualizer.exe` (ejecutable portable)

El ejecutable portable se encuentra en la carpeta `dist/win-unpacked/` y puede ejecutarse directamente sin instalación.

## Uso

1. Ejecuta el aplicación (en desarrollo con `npm start` o el ejecutable construido)
2. Haz clic en el botón "Sincronizar Audio de mi PC"
3. Listo el programa selecciona automaticamente la pantalla y captura el audio
4. El visualizador comenzará a reaccionar al audio de tu sistema

## Solución de problemas

### El botón de compartir pantalla no funciona en el ejecutable

Si al hacer clic en el botón de compartir pantalla no se abre el selector de pantalla, asegúrate de que:
- Estás usando la versión más reciente del ejecutable (reconstruye con `npm run build`)
- Has aceptado los permisos de pantalla del sistema

### Rendimiento lento

Si experimentas rendimiento lento en sistemas sin GPU dedicada, la aplicación ya incluye optimizaciones:
- Resolución de canvas reducida
- Parámetros de shader optimizados
- Tamaño de ventana ajustado (600x600)

## Tecnologías utilizadas

- Electron 42.3.0
- WebGL2
- Node.js
- electron-builder

## Licencia

ISC

## Autor

InfinityxGame
