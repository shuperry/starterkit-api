import hotRestart from '../server/hot-restart'

export default {
  name: 'starterkit-api',
  port: 10120,
  log: {
    level: 'error'
  },
  uploadPath: '/apps/crp/attachments/starterkit-api',
  redisServer: {
    keyPrefix: 'starterkit_',
    name: 'starterkit-redis',
    host: '10.59.6.224',
    port: 16379,
    options: {
      connectionName: 'starterkit-redis',
      family: '4',
      db: 0,
      password: '3bGp1IdpcvB1MjSpfBZj0Gdsjawj1uBt',
      showFriendlyErrorStack: true
    }
  },
  auth: {
    urls: [
    ],
    passUrls: [
    ],
    cookie: {
      token: 'starterkit-jwt',
      expiresDays: 30,
      options: {
      }
    },
    jwt: {
      secretKey: 'UrHUGXhIIquDDtfSU98bRv8',
      options: {
        expiresIn: '1d'
      }
    }
  },
  db: {
    database: 'starterkit',
    username: 'root',
    password: 'P@$$w0rd',
    options: {
      host: '10.59.6.224',
      port: 13306,
      dialect: 'mysql',
      timezone: '+08:00',
      logging: false,
      pool: {
        max: 100,
        min: 25,
        idle: 10000
      }
    }
  }
}
