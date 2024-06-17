import jwt from "jsonwebtoken";
const userauth=async(req,res,next)=>{
    const authheader=req.headers.authorization
    if(!authheader||!authheader.startsWith("Bearer")){
        next("Auth Failed")
    }
    const token =authheader.split(" ")[1]
    try{
    const payload=jwt.verify(token,process.env.JWT_SECRET)
    req.user={userId:payload.userId}
    next();
    }catch(err){
        next("Auth Failed")
    }
}
export default userauth