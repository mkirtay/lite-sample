export default {
  nodeResolve: true,
  appIndex: 'index.html',
  open: true,
  watch: true,
  // SPA routing için history API fallback
  middleware: [
    function rewriteHistory(context, next) {
      // API requests veya asset dosyaları için fallback yapma
      if (context.url.includes('.') || context.url.startsWith('/api/')) {
        return next();
      }
      
      // Tüm diğer route'ları index.html'e yönlendir
      context.url = '/';
      return next();
    }
  ],
  // Alternatif: basit history API fallback
  historyApiFallback: true,
  // Port ayarı (gerekirse değiştir)
  port: 8000,
  // Hostname
  hostname: 'localhost'
}; 