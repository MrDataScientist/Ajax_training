'use strict';

const mongoose = require('mongoose');
const users = mongoose.model('users');

exports.get = (req, res) => {
  if (req.session.user) {
    res.status(200).send({
      auth: true,
      user: {
        name: req.session.user.name,
        email: req.session.user.email
      }
    })
  } else {
    res.status(403).send({
      auth: false,
      msg: "Usuário não está logado"
    })
  }
}

exports.post = (req, res) => {
  let auth = false;

  users.findOne({ email: req.body.email })
    .then(user => {
      if(user.password == req.body.password){
        req.session.regenerate(function(){
          req.session.user = {
            name: user.name,
            email: user.email
          }

          res.status(200).send({
            auth: true,
            message: "Login realizado com sucesso!",
            name: user.name,
            email: user.email
          });
        });
      }
      else{
        res.status(403).send({
          auth: false,
          type: 'password',
          message: "Senha incorreta"
        });
      }
    })
    .catch(err => {
      res.status(403).send({
        auth: false,
        type: 'email',
        message: "Email não cadastrado"
      });
    });
}
