Modules we use
------------------------------
* **bcryptjs** - instead of the native(needs compiling on install) addon.. used for passwords
* **config** - configuration module https://github.com/lorenwest/node-config (check how configuration env merging works) gitignore config/local-*
* **fs-extra** - instead of fs for async and extra good stuff
* **jsonwebtoken** - JWT
* **kcors** - CORS middleware
* **koa** - the framework of choice.. similar to express but async/await ready + better middleware and error handling
* **koa-body** - parse json/multipart/.. middleware
* **koa-logger** - simple request/response logger middleware
* **koa-router** - similar to express router
* **koa-send** - mainly used if we have SPA .. loading the index.html file if nothing else is found
* **koa-static** - serve static directory
* **mysql2** - the sequelize driver
* **nodemailer** - sending emails
* **request-promise** - async requests (you have to npm install request also)
* **sequelize** - ORM framework
* **nodemon** - dev dependency for running localy (can be configured in nodemon.json)

Additional helpful modules we use if needed:
------------------------------
* **pug** - template language if needed (default for email-templates)
* **bounce** - sometimes it's useful for handling async/await error handling flow
* **joi** - json validation
* **pope** - a very small module for var replacement in strings (handlebars style)
* **node-schedule** - if job schedule is needed.. has crontab format
* **winston** - if logging is needed (also winston-daily-rotate-file plugin)
* **email-templates** - if sophisticated email templates are needed
* **Truffle** - Solidity compiler, how to install it? $ `npm install -g truffle`

Running
------------------------------
Packages: `npm install`

localy: `npm run dev` --> runs it with nodemon in development environment

server: `pm2 start ecosystem.config.json` --> runs it with PM2 installed on the server

running the seeds (db fixtures) - `node seed/index.js` ... after creating the database and configuring it in config/local.js


Currently we are working with https://github.com/bhanuc/koa-joi-router-2 which we use to validate API request/response and then generate api docs.. work is in progress. It uses joi and koa-router


Always use async/await if possible. If not try wrapping a callback in Promise (Node utils.promisify can be useful here)
Sometimes promises are fine too.. there are cases that better work with promises :)
