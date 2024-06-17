const errorMiddleware=(err,req,res,next)=>{
console.log(err)
const defaultErrors={
    statuscode:500,
    message:err
}
// missing field error
if(err.name==='ValidationError'){
    defaultErrors.statuscode=400
    defaultErrors.message=Object.values(err.errors).map(item => item.message).join(',')
}
if(err.code && err.code===11000){
    defaultErrors.statuscode=400
    defaultErrors.message=`${Object.keys(err.keyValue) } field has to be unique`
}
res.status(defaultErrors.statuscode).json({message:defaultErrors.message})
}
export default errorMiddleware