/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f6f8fc",
        grid: "#d9deea",
        surface: "#ffffff",
        "surface-soft": "#f8fafc",

        text: "#0f172a",
        "text-dark": "#111827",
        muted: "#6b7280",
        soft: "#94a3b8",

        border: "#e5e7eb",
        "border-soft": "#eef2f7",

        primary: "#4f8df7",
        "primary-dark": "#3b82f6",
        purple: "#8b5cf6",
        "purple-dark": "#7c3aed",

        success: "#34d399",
        "success-bg": "#e7f8f1",

        warning: "#f5c451",
        "warning-bg": "#fff6dd",

        info: "#60a5fa",
        "info-bg": "#eaf2ff",

        violet: "#a855f7",
        "violet-bg": "#f3e8ff",
      },
      boxShadow: {
        card: "0 8px 24px rgba(15, 23, 42, 0.06)",
        soft: "0 4px 12px rgba(15, 23, 42, 0.04)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #4f8df7 0%, #8b5cf6 100%)",
      },
      borderRadius: {
        xl2: "20px",
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
};