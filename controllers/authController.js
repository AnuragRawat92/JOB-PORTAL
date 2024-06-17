import userModel from "../models/userModel.js"

export const registerController=async(req,res,next)=>{

const {name,email,password}=req.body
//validate
if(!name){
   next("please provide name")
}
if(!email){
   next('please provide email')
}
if(!password){
    next('please provide password')
}
// const existinguisher=await userModel.findOne({email})
// if(existinguisher){
//   next("Email already registered")
// }
const user =await userModel.create({name,email,password})
const token=user.createJWT()
res.status(201).send({
    success:true,
    message:'user created successfully',
    user:{
      name:user.name,
      lastname:user.lastname,
      email:user.email,
      location:user.location
    },
    token,
})

}
export const loginController= async(req,res,next)=>{
const {email,password}=req.body
if(!email||!password){
  next('Please provide all details')
}
const user=await userModel.findOne({email}).select("+password")
if(!user){
  next('Invalid username or password')
}
//compare passowrd
const isMatch=await user.comparepassword(password)
if(!isMatch){
  next('Invalid username or password')
}
user.password=undefined
const token =user.createJWT()
res.status(200).json({
  success:true,
  message:'Login successfull',
  user,
  token
})
}