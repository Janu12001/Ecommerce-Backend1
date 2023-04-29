import User from '../model/user.schema.js'
import asyncHandler from '../services/asyncHandler'
import CustomError from '../utils/CustomError'






export const cookieOptions ={
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 *1000),
    httpOnly: true,
    //could be in  as separate file in utils
}

/*
@SIGNUP 
@route http://localhost:4000/api/auth/signup
@description User signup controller for creating a new user
@parameters name ,email , password
@return User Object

*/

export const signUp = asyncHandler(async(req,res)=>{
     const {name, email , password}=req.body

     if( !name || !email || !password){
        throw new CustomError
     }
})