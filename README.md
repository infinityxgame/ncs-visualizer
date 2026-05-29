# NCS Visualizer

Audio visualizer with dynamic particle effects, built with Electron.

## Features

- Real-time audio visualization using WebGL2
- Dynamic particle effects that react to the rhythm
- System audio capture via screen sharing
- Transparent and customizable window

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm (included with Node.js)

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

To run the application in development mode:

```bash
npm start
```

## Building the Executable

To create the application executable:

```bash
npm run build
```

### Executable Location

After running `npm run build`, the executable will be created in:

**Windows:**
- `dist/ncs-visualizer Setup 1.0.0.exe` (installer)
- `dist/win-unpacked/ncs-visualizer.exe` (portable executable)

The portable executable is located in the `dist/win-unpacked/` folder and can be run directly without installation.

## Usage

1. Run the application (in development with `npm start` or the built executable)
2. Click the "Sync audio from my PC" button
3. The program automatically selects the screen and captures the audio
4. The visualizer will start reacting to your system audio

## Troubleshooting

### Screen sharing button doesn't work in the executable

If clicking the screen sharing button doesn't open the screen selector, make sure:
- You're using the latest version of the executable (rebuild with `npm run build`)
- You have accepted the system screen permissions

### Slow performance

If you experience slow performance on systems without dedicated GPU, the application already includes optimizations:
- Reduced canvas resolution
- Optimized shader parameters
- Adjusted window size (600x600)

## Technologies Used

- Electron 42.3.0
- WebGL2
- Node.js
- electron-builder

## License

ISC

## Author

InfinityxGame
