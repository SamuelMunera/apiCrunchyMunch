module.exports = {
  apps: [{
    name: 'api-crunchy',
    script: './index.js',
    instances: 1,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};