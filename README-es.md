# NCS Visualizer.

Visualizador de audio con efectos de partículas dinámicas, construido con Electron y Neutralino.js.

## Características

- Visualización de audio en tiempo real usando WebGL2
- Efectos de partículas dinámicas que reaccionan al ritmo
- Captura de audio del sistema mediante compartir pantalla
- Ventana transparente y personalizable
- Disponible en dos frameworks: Electron (más grande) y Neutralino.js (más ligero)

## Instalación

### Requisitos previos

- Node.js (v16 o superior)
- npm (incluido con Node.js)
- Para Neutralino.js: `npm install -g @neutralinojs/neu`

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

### Electron (Desarrollo)

Para ejecutar la aplicación en modo desarrollo con Electron:

```bash
npm start
```

### Neutralino.js (Desarrollo)

Para ejecutar la aplicación en modo desarrollo con Neutralino.js:

```bash
npm run start:neutralino
```

## Construcción del ejecutable

### Build de Electron

Para crear el ejecutable de Electron:

**Versión Portable:**
```bash
npm run build
```

**Versión Instalador (NSIS):**
```bash
npm run build:nsis
```

**Ubicación del ejecutable:**
- Portable: `dist/NCS Visualizer-win-x64.exe`
- Instalador: `dist/NCS Visualizer Setup 1.0.0.exe`

**Tamaño:** ~50-150MB

**Nota:** La versión portable puede ejecutarse directamente sin instalación. La versión instalador crea accesos directos y puede desinstalarse desde Configuración de Windows.

### Build de Neutralino.js

Para crear el ejecutable de Neutralino.js:

```bash
npm run build:neutralino
```

**Ubicación del ejecutable:**
- `neutralino/dist/NCS Visualizer-win.exe`

**Tamaño:** ~2-5MB (mucho más ligero que Electron)

## Uso

### Electron
1. Ejecuta la aplicación (`npm start` o usa el ejecutable construido)
2. Haz clic en el botón "Sync audio from my PC"
3. El programa selecciona automáticamente tu pantalla y captura el audio de forma fluida
4. El visualizador comenzará a reaccionar al audio de tu sistema en tiempo real

### Neutralino.js
1. Ejecuta la aplicación (`npm run start:neutralino` o usa el ejecutable construido)
2. Haz clic en el botón "Sync audio from my PC"
3. Selecciona "Pantalla completa" de las opciones de compartir pantalla
4. Marca la casilla "Compartir audio" para capturar el audio del sistema
5. El visualizador comenzará a reaccionar al audio de tu sistema en tiempo real

## Comparación de frameworks

| Característica | Electron | Neutralino.js |
|---------------|----------|---------------|
| Tamaño del ejecutable | 50-150MB | 2-5MB |
| Dependencias | Node.js, npm | Node.js, npm |
| Requisitos del sistema | Mayores | Menores |
| Rendimiento | Bueno | Mejor |
| Tiempo de build | Más lento | Más rápido |

**Recomendación:** Usa Neutralino.js para ejecutables más pequeños y mejor rendimiento en sistemas sin GPU dedicada. Usa Electron si necesitas características específicas avanzadas de Electron.

## Solución de problemas

### El botón de compartir pantalla no funciona en el ejecutable

Si al hacer clic en el botón de compartir pantalla no se abre el selector de pantalla, asegúrate de que:
- Estás usando la versión más reciente del ejecutable (reconstruye)
- Has aceptado los permisos de pantalla del sistema

### Rendimiento lento

Si experimentas rendimiento lento en sistemas sin GPU dedicada, la aplicación ya incluye optimizaciones:
- Resolución de canvas reducida
- Parámetros de shader optimizados
- Tamaño de ventana ajustado (600x600)

**Tip:** Prueba la versión de Neutralino.js para mejor rendimiento en sistemas de gama baja.

### Limitaciones de captura de audio con ciertas aplicaciones

El visualizador puede no funcionar con algunas aplicaciones de escritorio como Telegram Desktop. Esto se debe a que:

- Telegram Desktop y aplicaciones similares manejan el audio de forma independiente
- No enrutan el audio a través del mezclador estéreo estándar del sistema operativo
- Esto impide que el visualizador capture el flujo de audio

**Aplicaciones afectadas:**
- Telegram Desktop
- Otras aplicaciones de escritorio que usan sesiones de audio directas o flujos de audio de tipo comunicaciones

**Solución alternativa:**
Para aplicaciones que no funcionan con el visualizador, intenta:
- Usar la versión basada en navegador de la aplicación (por ejemplo, Telegram Web)
- Usar aplicaciones que enruten el audio a través del mezclador estándar del sistema
- Probar con reproductores de música, navegadores (YouTube, Spotify web) u otras aplicaciones de audio estándar

## Tecnologías utilizadas

- Electron 42.3.0
- Neutralino.js 6.7.0
- WebGL2
- Node.js
- electron-builder

## Licencia

ISC

## Autor

InfinityxGame
