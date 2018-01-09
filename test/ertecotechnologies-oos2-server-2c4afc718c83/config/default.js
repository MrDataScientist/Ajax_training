module.exports = {
  env: process.env.NODE_ENV,
  port: 4040,

  mongoUrl: 'mongodb://localhost:27017/show-my-site-test',
  auth_store_url: 'https://store.cloudeo-ag.com/oos/user/login.json',
  sms_products: ['5-0101-115', '5-0101-109'],

  jwt: {
    secret: 'I7NblGb3AyJ6GEosBhSQ',
    options: {
      expiresIn: 604800
    }
  },

  log: {
    console: true,
    console_level: 'silly',
    file_level: 'warn',
    file: './logs/logs.log',
    maxDays: 10
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
    from: 'team@cloudeo-ag.com',
    subject_prefix: 'OOS: '
  },

  orders_dir: '/some-directory/oos/orders',
  orders_input_dir: '/some-directory/oos/input',
  orders_original_dir: '/some-directory/oos/input/original-orders',
  orders_unknown_dir: '/some-directory/oos/input/unknown-orders',
  orders_archive_dir: '/some-directory/oos/archive',

  cron_add_orders: '* * * * *',
  cron_process_orders: '*/2 * * * *',
  cron_rollback_orders: '0 0 * * *',
  cron_archive_orders: '0 0 * * *',

  // User for local develpment/seeds
  default_modules_dir: '/some-directory/oos/modules'
}
