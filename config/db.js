import mongoose from "mongoose";
const connectdb = async()=>{
    try{
const conn=await mongoose.connect(process.env.MONGO_URL)
console.log(`connected to mongodb database ${mongoose.connection.host}`.bgMagenta.white)
    }catch(err){
        console.log(`Mongodb error ${err}`.bgRed.white)
    }
}
export default connectdb