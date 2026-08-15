# EduBot AI — Asistente Académico 🎓

Aplicación web interactiva desarrollada con **React + Vite** e integrada con la **API de Google Gemini**, diseñada para brindar soporte académico a estudiantes mediante resúmenes de temas, aclaración de dudas y síntesis de conceptos.

---

## Características Principales

- **Integración con Gemini API:** Comunicación directa con los modelos de IA de Google Gemini para generación de respuestas contextuales.
- **Gestión Local de API Key:** Configuración sencilla de la clave API almacenada localmente en `localStorage` del navegador.
- **Estructura React + Vite:** Desarrollo ágil, modular y optimizado con renderizado rápido.
- **Diseño Estilizado (Tailwind CSS):** Interfaz oscura moderna y adaptativa (responsive) con iconografía de `lucide-react`.
- **Despliegue Automático:** Configuración lista para publicación en GitHub Pages mediante `gh-pages`.

---

## Tecnologías Utilizadas

- **Frontend:** React 18 / Vite
- **Estilos:** Tailwind CSS / PostCSS
- **Iconos:** Lucide React
- **IA Provider:** Google Gemini API (`generativelanguage.googleapis.com`)
- **Control de Versiones y Hosting:** Git, GitHub, GitHub Pages

---

## Estructura del Proyecto

```text
PRACTICA2/
├── .claude/              # Instrucciones y contexto para la asistencia con Claude CLI
│   └── CLAUDE.md
├── public/               # Archivos estáticos
├── src/
│   ├── App.jsx           # Componente principal con la lógica del chat y Gemini API
│   ├── index.css         # Importación de estilos base de Tailwind
│   └── main.jsx          # Punto de entrada de React
├── index.html            # Plantilla HTML principal
├── package.json          # Configuración de dependencias y scripts
├── vite.config.js        # Configuración del entorno Vite y rutas de despliegue
└── README.md             # Documentación del proyecto