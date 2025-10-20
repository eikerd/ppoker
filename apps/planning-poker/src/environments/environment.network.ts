// Environment for local network testing (multiple devices)
// Use the browser's current host at runtime so the frontend will automatically
// target the same machine the site is served from. This avoids embedding a
// single developer's local IP in source control.
export const environment = {
  production: false,
  apiUrl: (() => {
    try {
      // In a browser at runtime use the page's hostname so other devices can
      // connect by typing http://<YOUR_IP>:4200 in their browser.
      if (typeof window !== 'undefined' && window.location) {
        const protocol = window.location.protocol; // 'http:' or 'https:'
        const host = window.location.hostname; // dynamic IP or hostname
        const port = '3333';
        return `${protocol}//${host}:${port}/api`;
      }
    } catch (e) {
      // fallback for server-side tooling or tests
    }
    return 'http://localhost:3333/api';
  })(),
  wsUrl: (() => {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const protocol = window.location.protocol; // 'http:' or 'https:'
        const host = window.location.hostname;
        const port = '3333';
        // Keep the same scheme as the page (socket.io typically uses http(s) endpoint)
        return `${protocol}//${host}:${port}`;
      }
    } catch (e) {}
    return 'http://localhost:3333';
  })(),
};
