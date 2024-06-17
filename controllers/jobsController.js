import jobsModel from "../models/jobsModel.js"
import JobsModel from "../models/jobsModel.js"
import mongoose from "mongoose"
import moment from "moment"

export const createJobController=async(req,res,next)=>{
    const {company ,position}=req.body
    if(!company||!position){
        next('Please provide all fields')
    }
    req.body.createdBy=req.user.userId
    const job= await JobsModel.create(req.body)
    res.status(201).json({job})
}
//get job
export const getAllJobsControlller=async(req,res,next)=>{
//const jobs =await jobsModel.find({createdBy:req.user.userId})
//query parmas
const {status,workType,search,sort}=req.query
//conditions for searching filters
const querObject={
    createdBy:req.user.userId
}
//logic filters
if(status && status!=='all'){
    querObject.status=status
}
if(workType && workType!=='all'){
    querObject.workType=workType
}
if(search){
    querObject.position={$regex:search, $options:'i'}
}
let queryResult =jobsModel.find(querObject)
// sorting
if(sort === "latest"){
    queryResult=queryResult.sort("-createdAt")
}
if(sort === "oldest"){
    queryResult=queryResult.sort("createdAt")
}
if(sort === "a-z"){
    queryResult=queryResult.sort("position")
}
if(sort === "A-Z"){
    queryResult=queryResult.sort("-position")
}
// pagination 
const page=Number(req.query.page)||1
const limit =Number(req.query.limit)||10
const skip=(page-1)*limit
queryResult=queryResult.skip(skip).limit(limit)
//jobs count
const totaljobs=await jobsModel.countDocuments(queryResult)
const numofpage=Math.ceil(totaljobs/limit)
const jobs=await queryResult
res.status(200).json({
    totaljobs,
    jobs,
    numofpage,
})
}
//update job
export const updateJobController =async(req,res,next)=>{
const {id}=req.params
const {company,position}=req.body
if(!company||!position){
    next('Please provide all fields')
}
//find job
const job =await jobsModel.findOne({_id:id})
if(!job){
    next(`no jobs found with this id ${id}`)
}
if(!req.user.userId===job.createdBy.toString()){
    return next('you are not authorised to update')
}
const updateJob=await jobsModel.findOneAndUpdate({_id:id},req.body,{
    new:true,
    runValidators:true,
})
res.status(200).json(updateJob)
}
//delete job
export const deleteJobController=async(req,res,next)=>{
const {id}=req.params
const job= await jobsModel.findOne({_id:id})
if(!job){
    next(`no job found with this id ${id}`)
}
if(!req.user.userId===job.createdBy.toString()){
    next('you are not authorised to delete this job')
    return 
}
await job.deleteOne()
res.status(200).json({message:"Successfull job deletion"})
}
//job stats filter
export const jobsStastFilter =async(req,res,next)=>{
const stats=await jobsModel.aggregate([
    // search by user jobs
    {
       $match:{
            createdBy:new mongoose.Types.ObjectId(req.user.userId),
       },
    },
    {
        $group:{
            _id:"$status",
            count:{$sum:1},
           }
    }
])
//default stats
const defaultstats={
    pending:stats.pending||0,
    reject:stats.reject||0,
    interview:stats.interview||0
};
//monthly yearly stats
let monthlyApplication=await jobsModel.aggregate([
    {
        $match:{
            createdBy: new mongoose.Types.ObjectId(req.user.userId)
        }
    },
    {
        $group:{
            _id:{
                year:{$year:'$createdAt'},
                month:{$month:'$createdAt'}
            },
            count:{
           $sum:1,
            }
        }
    }
]);
monthlyApplication=monthlyApplication.map(item=>{
    const {_id:{year,month},count}=item
    const date=moment().month(month-1).year(year).format("MMM Y")
    return {date,count};
})
.reverse()
res.status(200).json({totaljobs:stats.length,defaultstats,monthlyApplication})
}