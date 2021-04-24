const User = require('../models/users')
const userModel = require("../models/users");
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
exports.getUsers = (req, res, next) => {
  userModel.findAll().then((listUser) => {
    res
      .status(200)
      .json({
        //message:'get all users',
        listUser: listUser,
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};

exports.getUsersByID = (req, res, next) => {
  const userId = req.params.userId;
  userModel
    .findByPk(userId)
    .then((user) => {
      //console.log(user);
      if (!user) {
        res.status(201).json({
          status: false,
          message: "ko tìm thấy",
        });
      } else {
        res.status(201).json({
          status: true,
          message: "đã tìm thấy",
          user: user,
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createUser = (req, res, next) => {
  const _email = req.body.email;
  const _fullname = req.body.fullname;
  const _phone = req.body.phone;
  const _age = req.body.age;
  const _gender = req.body.gender;
  const _password = req.body.password;
  
  userModel
      .findOne({where:{email:_email}})
      .then(user => {
        if(user){
          return res.status(400).json({
            status:false,
            message:'email đã tồn tại'
          })
        }
        return bcrypt.hash(_password,12);
      })
      .then(hashedPassword =>{
        const _user = new userModel({
          email: _email,
          fullname: _fullname,
          phone: _phone,
          age: _age,
          gender: _gender,
          password: hashedPassword,
        });
        return _user.save(); 
      })
      .then(user => {
        res.status(201).json({
          status: true,
          message:'Thêm user thành công',
          user:user
        })
        .catch(err =>res.status(404).json(err))
      })
};

exports.updateUser = (req, res, next) => {
  const _email = req.body.email;
  const _fullname = req.body.fullname;
  const _phone = req.body.phone;
  const _age = req.body.age;
  const _gender = req.body.gender;
  const _password = req.body.password;
  
  userModel
      .findOne({where:{email:_email}})
      .then(user => {
        if(!user){
          return res.status(400).json({
            status:false,
            message:'email không tồn tại'
          })
        }
        return bcrypt.hash(_password,12);
      })
      .then(hashedPassword =>{
        const _user = new Object({
          email: _email,
          fullname: _fullname,
          phone: _phone,
          age: _age,
          gender: _gender,
          password: hashedPassword,
        });
        return userModel.update(_user, {where:{email:_user.email}}); 
      })
      .then(num =>{
        if(num == 1){
          return res.status(404).json({
            status:true,
            message:'Cập nhật thành công',
            user:num
          })
        }else{
          return res.status(404).json({
            status:false,
            message:'Cập nhật không thành công',
            user:num
          })
        }
      })
      .catch(err =>res.status(404).json(err))
};





exports.delUserByID = (req, res, next) => {
  const userId = req.params.userId;
  userModel
    .findByPk(userId)
    .then((user) => {
      //console.log(user);
      if (!user) {
        res.status(201).json({
          status: false,
          message: "ko tìm thấy",
        });
      } else {
        //tìm thấy
        userModel
          .destroy({
            where: { email: userId },
          })
          .then((result) => {
            res.status(201).json({
              status: true,
              message: "Xóa thành công",
            });
          });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.checklogin = (req,res,next)=>{
    const _password = req.body.password;
    const _email = req.body.email;
    userModel
        .findOne({where:{email:_email}})
        .then(user => {
          if(!user){
            return res.status(200).json({
              status:false,
              message:'email không tồn tại'
            })
          }
          return Promise.all([bcrypt.compare(_password,user.password),user]);
        })
        .then(result => {
          const isMatch = result[0];
          const user = result[1];
          console.log(user)
          if(!isMatch){
            return res.status(200).json({
              status: false,
              message:'password không đúng'
            })
          }
          const payLoad = {
            email: user.email
          }
          return jwt.sign(payLoad,'FPOLYDANANG',{expiresIn:3600})
        })
        .then(token => {
            res.status(200).json({
              status: true,
              message:'đăng nhập thành công',
              token
            })
        })
        .catch(err => {
          return res.status(500).json(err)
        })
};