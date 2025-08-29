module.exports = {
  apps: [{
    name: 'cookie-banner-clicker',
    script: './cookie-banner-clicker',
    args: 'serve --http=127.0.0.1:6860',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};