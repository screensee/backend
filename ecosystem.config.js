module.exports = {
  apps: [{
    name: 'api',
    script: './bin/www',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      MONGODB_URI: 'mongodb://localhost:27017/hackathon',
      MQTT_SOCKET_PORT: 1883,
      MQTT_HTTP_PORT: 1884,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      MONGODB_URI: 'mongodb://localhost:27017/hackathon',
      MQTT_SOCKET_PORT: 1883,
      MQTT_HTTP_PORT: 1884,
    }
  }],

  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
