import User from '../model/user.schema.js'
import asyncHandler from '../services/asyncHandler'
import CustomError from '../utils/CustomError'
import mailHelper from '../utils/mailHelper'
import crypto from'crypto'





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
        throw new CustomError('please fill all fields', 400)
        
     }

     //check if user exists
     const existingUser = await User.finOne({email})
     if( existingUser){
        throw new CustomError('User already exists',400)

     }

     const user = await User.create({
        name,
        email,
        password
     });

     const token = user.getJwtToken()
     console.log(user)
     user.password = undefined

     res.cookie("token", token, cookieOptions)
     res.status(200).json({
        success: true,
        token,
        user,
     })

})

/*
@LOGIN
@route http://localhost:4000/api/auth/login
@description User signup controller for signing a new user
@parameters name ,email , password
@return User Object

*/

export const login = asyncHandler(async(req,res)=>{
   const {name, email , password}=req.body

   if( !name || !email || !password){
      throw new CustomError('please fill all fields', 400)
      
   }

   const user = await User.findOne({email}).select("+password")

   if(!user){
      throw new CustomError('Invalid credentials', 400)
   }

   const ispasswordcorrect = await user.comparePassword(password)
   if(ispasswordcorrect){
     const token = user.getJwtToken()
     user.password = undefined
     res.cookie("token ", token , cookieOptions)
     return res.status(200).json({
      success: true,
      token,
      user
     })
   }

   throw new CustomError('invalid credentials - pass' , 400)
})

/*
@LOGOUT
@route http://localhost:4000/api/auth/login
@description Userlogout by clearing cokie/ controller for user logout
@parameters name ,email , password
@return sucess message

*/

export const logout = asyncHandler(async(_req,res)=>{
   res.cookie("token", null,{
      expires:new Date(Date.now()),
      httpOnly: true
   })

   res.status(200).json({
      success:true,
      message:loggedOut,
   })
})

/*
@FORGETPASSWORD
@route http://localhost:4000/api/auth/password/forgot
@description User will submit email and we will generate a token
@parameters email 
@return sucess message - email send

*/

export const forgetPasword = asyncHandler(async(req,res)=>{
  const{email} = req.body
  //check email for null or ""
  const user = awaitUser.findOne({email})
  if(!user){
   throw new CustomError('user not found', 404)
  }

  const resetToken =user.generateForgotPasswordToken()
  user.save({validateBeforeSave: false})
  
  const resetUrl = 
  `${req.protocol}://${req.get("host")}/api/auth/password/reset${resetToken}`
  
  const text =`your password reset url is \n\n${resetUrl}\n\n`
  try{

   await mailHelper({
      email: user.email,
      subject:"password reset email for website",
      text:text,

   })
   res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`
   })

  }catch(error){

  //rollback - clear fields and  save
  user.forgotPasswordToken = undefined
  user.forgotPasswordExpiry = undefined

  await user.save({validateBeforeSave:false})
   throw new CustomError(error.message || 'Email sent failure', 500)
  }
})

/*
@FORGETPASSWORD
@route http://localhost:5000/api/auth/password/reset/
@description User will be able to reset password based url
@parameters token from url, password and confirm password
@return userobject
*/

export const resetPassword = asyncHandler(async(req,res)=>{

   const {token: resetToken} = req.params
   const {password, confirmPassword} = req.body

   const resetPasswordtoken = crypto.createHash('sha256').update(resetToken).digest('hex')


  const user = await User.findOne({
      forgotPasswordToken: resetPasswordtoken,
      forgotPasswordExpiry:{$gt: Date.now()}
   })

   if(!user){
      throw new CustomError('password token is invalid or expired', 400)
   }

   if(password !== confirmPassword){
      throw new CustomError('password and confirm password does not match', 400)
   }

   user.password = password
   user.forgotPasswordToken = undefined
   user.forgotPasswordExpiry= undefined
   
   await user.save()

   //create token and sent a response
   const token = user.getJwtToken()
   user.password = undefined
   //helper method for  cookie can be added
   res.cookie("token", token, cookieOptions)
   res.status(200).json({
      success:true,
      user
   })
})

//TODO: create a controller for changed password



