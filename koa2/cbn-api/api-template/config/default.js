module.exports = {
  env: process.env.NODE_ENV, // for easier access to config.env later
  port: 4040,

  cors: {
    origin: '*'
  },

  jwt: {
    secret: 'I7NblGb3AyJ6GEosBhSQ',
    options: {
      expiresIn: 604800
    }
  },

  db: {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: '',
    password: '',
    database: '',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    operatorsAliases: false,
    logging: false,
    benchmark: false
  },

  smtp: {
    host: 'smtp.googlemail.com',
    port: 465,
    secure: true,
    auth: {
      user: '',
      pass: ''
    },
    // tls: { rejectUnauthorized: false },
    debug: true
  },

  email: {
    to: [
      'd.haralanov@erteco.de'
    ],
    from: 'team@cloudeo-ag.com'
  }
}
