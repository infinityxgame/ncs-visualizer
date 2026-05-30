# NCS Visualizer

Audio visualizer with dynamic particle effects, built with Electron and Neutralino.js.

## Features

- Real-time audio visualization using WebGL2
- Dynamic particle effects that react to the rhythm
- System audio capture via screen sharing
- Transparent and customizable window
- Available in two frameworks: Electron (larger) and Neutralino.js (lighter)

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm (included with Node.js)
- For Neutralino.js: `npm install -g @neutralinojs/neu`

### Installation Steps

1. Clone the repository or download the project
2. Navigate to the project directory:
   ```bash
   cd ncs-visualizer
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Electron (Development)

To run the application in development mode with Electron:

```bash
npm start
```

### Neutralino.js (Development)

To run the application in development mode with Neutralino.js:

```bash
npm run start:neutralino
```

## Building the Executable

### Electron Build

To create the Electron executable:

**Portable Version:**
```bash
npm run build
```

**Installer Version (NSIS):**
```bash
npm run build:nsis
```

**Executable Location:**
- Portable: `dist/NCS Visualizer-win-x64.exe`
- Installer: `dist/NCS Visualizer Setup 1.0.0.exe`

**Size:** ~50-150MB

**Note:** The portable version can be run directly without installation. The installer version creates shortcuts and can be uninstalled from Windows Settings.

### Neutralino.js Build

To create the Neutralino.js executable:

```bash
npm run build:neutralino
```

**Executable Location:**
- `neutralino/dist/NCS Visualizer-win.exe`

**Size:** ~2-5MB (much lighter than Electron)

## Usage

### Electron
1. Run the application (`npm start` or use the built executable)
2. Click the "Sync audio from my PC" button
3. The program automatically selects your screen and captures the audio seamlessly
4. The visualizer will start reacting to your system audio in real-time

### Neutralino.js
1. Run the application (`npm run start:neutralino` or use the built executable)
2. Click the "Sync audio from my PC" button
3. Select "Entire Screen" from the screen sharing options
4. Check the "Share audio" box to capture system audio
5. The visualizer will start reacting to your system audio in real-time

## Framework Comparison

| Feature | Electron | Neutralino.js |
|---------|----------|---------------|
| Executable Size | 50-150MB | 2-5MB |
| Dependencies | Node.js, npm | Node.js, npm |
| System Requirements | Higher | Lower |
| Performance | Good | Better |
| Build Time | Slower | Faster |

**Recommendation:** Use Neutralino.js for smaller executables and better performance on systems without dedicated GPU. Use Electron if you need advanced Electron-specific features.

## Troubleshooting

### Screen sharing button doesn't work in the executable

If clicking the screen sharing button doesn't open the screen selector, make sure:
- You're using the latest version of the executable (rebuild)
- You have accepted the system screen permissions

### Slow performance

If you experience slow performance on systems without dedicated GPU, the application already includes optimizations:
- Reduced canvas resolution
- Optimized shader parameters
- Adjusted window size (600x600)

**Tip:** Try the Neutralino.js version for better performance on low-end systems.

## Technologies Used

- Electron 42.3.0
- Neutralino.js 6.7.0
- WebGL2
- Node.js
- electron-builder

## License

ISC

## Author

InfinityxGame
