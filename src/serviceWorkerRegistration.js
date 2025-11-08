// This file enables your React app to work offline as a PWA

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(reg => console.log("✅ Service Worker Registered:", reg))
        .catch(err => console.error("❌ SW registration failed:", err));
    });
  }
}