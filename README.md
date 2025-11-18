# 🎭 Multi-Modal Emotion Recognition

<div align="center">

![Emotion Recognition](https://img.shields.io/badge/AI-Emotion%20Recognition-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Real-time emotion detection using facial expressions and audio analysis powered by advanced ML models**

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Usage](#usage) • [Contributing](#contributing)

</div>

---

## ✨ Features

- 🎥 **Real-time Video Processing** - Live facial expression analysis through webcam
- 🔊 **Audio Analysis** - Emotion detection from voice and audio patterns
- 📊 **Visual Analytics** - Beautiful charts and confidence bars for emotion metrics
- 🎨 **Modern UI** - Responsive, aesthetic interface with dark mode support
- ⚙️ **Customizable Settings** - Adjust detection sensitivity and visualization preferences
- 📈 **Statistics Panel** - Track emotion trends and patterns over time
- 🚀 **Fast & Lightweight** - Built with Vite for optimal performance
- 📱 **Cross-Platform** - Works on desktop and mobile browsers

---

## 🏗️ Tech Stack

| Category | Technologies |
|----------|---------------|
| **Frontend** | React 18+, TypeScript, Vite |
| **ML Models** | Face-api.js, Gemini AI API |
| **Styling** | Modern CSS, Responsive Design |
| **Build Tool** | Vite 6.0+ |
| **Package Manager** | npm / pnpm |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or pnpm
- Modern web browser with webcam access
- Gemini API key (for advanced features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayush07-cloud/multi-modal-emotion-recognition.git
   cd multi-modal-emotion-recognition
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 📖 Usage

### Basic Workflow
1. **Allow Camera & Microphone Access** - Grant permissions when prompted
2. **Start Detection** - Click "Start" to begin real-time emotion recognition
3. **View Results** - Watch emotion data update in real-time with:
   - Emotion confidence bars
   - Distribution charts
   - Timeline visualization
4. **Customize Settings** - Adjust detection parameters in the Settings panel
5. **View Statistics** - Monitor emotion trends in the Statistics panel

### Controls
- **Start/Stop** - Toggle emotion detection on/off
- **Settings** - Configure detection sensitivity and UI preferences
- **Stats** - View aggregated emotion metrics and patterns
- **Clear Data** - Reset all collected emotion data

---

## 📂 Project Structure

```
multi-modal-emotion-recognition/
├── components/              # React components
│   ├── AudioVisualizer.tsx # Audio waveform display
│   ├── ConfidenceBars.tsx  # Emotion confidence visualization
│   ├── Controls.tsx        # Control buttons
│   ├── DistributionChart.tsx # Emotion distribution
│   ├── EmotionDisplay.tsx  # Main emotion display
│   ├── Header.tsx          # App header
│   ├── Modal.tsx           # Modal component
│   ├── SettingsPanel.tsx   # Settings UI
│   ├── StatsPanel.tsx      # Statistics display
│   ├── TimelineChart.tsx   # Time-based emotion chart
│   ├── VideoFeed.tsx       # Video stream component
│   └── icons/              # Icon components
├── hooks/                   # Custom React hooks
│   ├── useFaceApi.ts       # Face detection hook
│   └── useMediaStreams.ts  # Media stream hook
├── services/               # Business logic
│   └── mockEmotionModel.ts # Emotion model service
├── utils/                  # Utility functions
│   └── helpers.ts          # Helper functions
├── App.tsx                 # Main App component
├── index.tsx               # React entry point
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🎯 Emotion Categories

The system detects and analyzes the following emotions:

| Emotion | Color | Description |
|---------|-------|-------------|
| 😊 **Happy** | Green | Positive, joyful state |
| 😢 **Sad** | Blue | Melancholic, sorrowful state |
| 😠 **Angry** | Red | Frustrated, aggressive state |
| 😨 **Fearful** | Purple | Anxious, scared state |
| 🤢 **Disgusted** | Orange | Repulsed, averse state |
| 😲 **Surprised** | Yellow | Astonished, shocked state |
| 😐 **Neutral** | Gray | Calm, expressionless state |

---

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙋 Support

Have questions or found a bug? 

- 📧 Email: kayushkumar2710@gmail.com
- 🐛 [Open an Issue](https://github.com/Ayush07-cloud/multi-modal-emotion-recognition/issues)
- 💬 [Discussions](https://github.com/Ayush07-cloud/multi-modal-emotion-recognition/discussions)

---

## 📚 Resources

- [Face-api.js Documentation](https://github.com/justadudewhohacks/face-api.js)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

<div align="center">

**Made with ❤️ by Ayush**

⭐ If you find this project helpful, please star it!

</div>
