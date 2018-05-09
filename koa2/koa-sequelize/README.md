# /installation/
- npm install
- npm install -g sequelize-cli

### /commands of sequelize/
- Type sequelize and it will give you all the command :
- sequelize
- sequelize init

### /generate a model/
- sequelize model:generate --name Company --attributes name:string,city:string, address:string
- Template
- sequelize model:generate --name Template --attributes SKU:string,data:string,version:string,abi:string,bytecode:string


### /run/
- npm run dev
- node server.js