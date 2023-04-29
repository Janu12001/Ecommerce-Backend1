import User from "../models/user.schema.js"
import JWT from 'jsonwebtoken'
import asyncHandler from '../services/asyncHandler'
import CustomError from '../utils/CustomError'
import config from"../config/index.js"
 

export const isloggedin = asyncHandler(async(req,_res,next)=>{
    let token;

    if(req.cookies.token|| (req,headers.authorization && req.headers.authorization.startWith("Bearer"))
     ) {
        token = req.cookie.token || req.headers.authorization.split(" ")[1]
    }

    if(!token){
        throw new CustomError("not authorized to acess this route", 401)
    }

    try{
        const decodedJwtpayload = JWT.verify(token, config.JWT_SECRET)
        //_id , find user based onid  , set this in req.user
      req.user = await  User.findById(decodedJwtpayload._id, "name email role")
      next()
    }catch(err){
        throw new CustomError("not authorized to access this route", 401)
    }
})