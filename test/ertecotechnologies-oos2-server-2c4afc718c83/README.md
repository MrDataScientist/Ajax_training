# CloudEO OOS - Server

## Requirements:

* Node >= 8.9
* MySQL >= 5.7
* PM2 (only for production server)


## Installation

Clone the repository and install dependencies:


```bash
$ npm install
```

The app is using [config](https://github.com/lorenwest/node-config) module.
Check the [documentation](https://github.com/lorenwest/node-config/wiki/Configuration-Files). Create `./config/local.js` (`./config/local-development.js`) file and add the necessary config changes which will overwrite `./config/default.js`.

## Running localy (while developing)

Create a MySQL database.

Set the directories in `config/local.js`

!!! **Only use this localy** !!! You can initialize the database schema/tables and add a few test order files (`./src/seeds/test_orders`) to `orders_input_dir` directory by running:

> This will delete the whole database and delete all of the directories set in config.

```
$ node src/seeds/index.js
```


We are using [nodemon](https://github.com/remy/nodemon) for local development.
Check out npm scripts in `package.json`. They are self-explanatory.

To run it with nodemon `watch` and `NODE_ENV=development`

```
$ npm run dev
```

To run it with nodemon `watch` and `NODE_ENV=production`

```
$ npm run prod
```


You can see the config for nodemon in `nodemon.json`.

## Running on the server
We are using [PM2](http://pm2.keymetrics.io/) for production. Please refer to `PM2` documentation on how to install it globaly on the server (`npm install pm2 -g`). Add it to the system's startup (`pm2 startup`). Also install the log rotate plugin (`pm2 install pm2-logrotate`)

> Note that the scripts for PM2 installation may be different so check the [documentation](http://pm2.keymetrics.io/docs/usage/quick-start/)

Then you can start the app in production(`NODE_ENV=production`):

```
$ pm2 start ecosystem.config.json
```

To start the app in development (`NODE_ENV=development`):

```
$ pm2 start ecosystem.config.json --env development
```

## Deployment
Use git `master` branch for PROD server and `develop` for DEV server.

Pull from Bitbucker

```bash
$ git pull
```

Then if everything is ok (no conflicts) restart the app

```bash
$ pm2 restart <app-name>
```


## Client app (Dashboard)
The client app is in a different repository.
To update the production client app simply build the bundle and copy the content of its `./dist` drectory to `./src/public` directory. For local development check out the client's app repository for more details.

## Plugins
Direcotry is `./src/plugins`

Naming convention: `<PluginName>Plugin.js` (ex. `EmailerPlugin.js`)

Plugins must extend `./BasePlugin` and have `async run(initialRun)` method.

The `initialRun` (boolean) parameter is used to separate the inital run that copies directories/sends API request/sends emails/... from the following scheduled runs that can check for done/error response files.

From `run(initalRun)` method you can set the task to **ready** state via `await this.setReady(data)` or to **error** state via throwing an error `throw new Error('Some error')`

### Plugin settings
The static getter `static get settingsDefinition ()` is used to define the needed plugin settings/config. It should return array like this:

```
static get settingsDefinition () {
    return [
      {name: 'plugin_setting_var', type: 'string', default: '', required: true, scope: ['plugin']},
      {name: 'plugin_instance_var', type: 'string', default: '', required: true, scope: ['instance']},
      {name: 'task_var', type: 'text', default: '', required: true, scope: ['task']},
      {name: 'mixed_var', type: 'text', default: '', required: true, scope: ['plugin', 'instance', 'task']}
    ]
  }
```
Supperted `types` are 'string' and 'text'.
The `scope` array is used determine what scope/level are the settings for: `plugin`, `plugin instance`, `task`. After plugin initialization these levels will overwrite each other in the same order.

You can access them like this `this.settings.plugin_setting_var`


### Plugin 'public' API

**Public static properties/getters:**

```
static get settingsDefinition ()
```

**Public methods:**

```
await this.setReady(data)
await this.copyBlockersOutDirectories(destDir)
```

**Public properties(getters)**

```
this.orderNumber
this.orderJson
this.orderDirectory
this.taskInDirectory
this.taskOutDirectory
this.blockersInDirectories
this.blockersOutDirectories
```

**Public available services**

```
await this.emailer.send({to, subject, text})

await this.logger.info() // .info() .warn() .error() .debug()

await this.utils.archive(zipFilePath, directories = [])

```

Check out `EmailerPlugin` (only runs once) and `ManualProcessingPlugin` (runs once to initialize and then check for existing files).

Also check `BasePlugin`. All methods/properties starting with `_` are considered private (ex: `_initSettings()`) and should not be used in inheriting plugins.