# SMOLP - Simple Modern Online Image Processing

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://smolp.lkly.net)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

SMOLP is a free, fast, and secure online tool for optimizing your images while maintaining quality. Process your images directly in the browser with no server uploads required - your files never leave your device.

🌐 **[Try it now at smolp.lkly.net](https://smolp.lkly.net)**

## Features

- 🖼️ **Multiple Format Support**: Convert between JPEG, PNG, and WebP formats
- 🎚️ **Quality Control**: Adjust compression quality to find the perfect balance
- 📦 **Batch Processing**: Optimize multiple images at once
- 🔒 **Privacy First**: All processing happens locally in your browser
- 💾 **Bulk Download**: Download all processed images as a ZIP file
- 📱 **Responsive Design**: Works great on desktop and mobile devices
- 🚫 **No Ads or Tracking**: Just a clean, helpful tool

## Technology Stack

- Alpine.js for lightweight reactivity
- TailwindCSS for modern, responsive styling
- Browser's native Canvas API for image processing
- JSZip for bulk downloads

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smolp.git
cd smolp
```

2. Serve the directory using any static file server. For example, using Python:
```bash
python3 -m http.server 8000
```

Or using Node.js:
```bash
npx serve
```

3. Open your browser and navigate to `http://localhost:8000` (or the port shown in your terminal)

## Deployment

SMOLP is a static site that can be hosted on any web server or static hosting service. Some recommended hosting options:

- GitHub Pages
- Netlify
- Vercel
- Any static file server

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support the Project

If you find SMOLP useful, consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs or suggesting features through issues
- ☕ [Buying me a coffee](https://buymeacoffee.com/lkly)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Created with ❤️ for the open web
- Built using modern web technologies
- Inspired by the need for a simple, privacy-focused image optimization tool