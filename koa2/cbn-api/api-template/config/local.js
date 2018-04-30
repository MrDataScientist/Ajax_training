module.exports = {
  port: 4000,

  jwt: {
    secret: 'blyJ6GI7NEoGb3AsBhSQ',
    options: {
      expiresIn: 604800
    }
  },

  db: {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'some_db_name',
    // logging: console.log,
    // benchmark: true
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
      // 'oos-manager@cloudeo-ag.com'
    ],
    from: 'team@cloudeo-ag.com'
  }
}
