
const jwt = require('jsonwebtoken');

exports.authentication = (req,res,next) => {
    const token = req.header('token');
    console.log(token);
    if(!token){
        return res.status(401).json({
            status:false,
            message:'Bạn chưa được cấp quyền truy cập'
        })
    }
    jwt.verify(token,'FPOLYDANANG',(err,user)=>{
        if(err){
            return res.status(500).json({
                status:false,
                message:'bạn không được quyền truy cập'
            })
        }
        req.user = user;
        console.log('user verify'+user)
        next();
    })
}