//hme.route.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport =require('passport');
const hMeRoutes = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database.js');
// require models
let Account = require('../models/account.js');
let distDir = __dirname + "../dist/sb-admin-angular";

//**default render method */
hMeRoutes.get('/', (req,res,next) => {
  res.render(distDir + '/index.html');
})

//** login method*/
hMeRoutes.post('/login', (req,res,next) => {
  Account.findOne(
    {
      ID: req.body.username
    }, 
    (err, user) => {
      if(err) throw err;

      if(!user) {
        res.status(401).send({
          sucess: false,
          msg: 'Authentication failed. User not found.'
        });
      } else {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if(isMatch && !err){
            let token = jwt.sign(user.toJSON(), config.secret, {
              expiresIn: '30m'
            });

            res.json({ success: true, token: 'JWT ' + token});
          } else {
            res.status(401).send({
              success: false,
              msg: 'Authentication failed. Wrong password.'
            });
          }
        });
      }
    }
  )
});
//** sign up method */
hMeRoutes.post('/signup',(req,res)=>{
  let id = req.body.ID;
  let pw = req.body.PW;
  Account.findOne(
    {ID: id}, (err,result)=>{
      if(err){
        console.log(err);
        throw err;
      } 
      if(!result){
        Account.insertMany({ID: id, PW: pw}, (err, docs)=>{  
          res.status(200).send({
            success: true,
            msg: 'The request was successfully completed.'
          });
        });
      }else{
        res.status(400).send({
          success: false,
          msg: 'Already exist. send different ID.'
        });
      }
    }
  )
})
//** check jwt method */
hMeRoutes.get('/jwtcheck', passport.authenticate('jwt', { session: false }), (req,res)=>{
  let token = getToken(req.headers);
  if (token) {
    return res.status(200).send({ success: true, msg: 'Authorized' });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
})

module.exports = hMeRoutes;