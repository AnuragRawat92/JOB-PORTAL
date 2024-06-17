import express from "express";
import userauth from "../middlewares/authMiddleware.js";
import { createJobController, deleteJobController, getAllJobsControlller, jobsStastFilter, updateJobController } from "../controllers/jobsController.js";
const router=express.Router();
//routes
//create jobs||post
/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 * 
 *  schemas:
 *    JobModel:
 *      type: object
 *      required:
 *        - company
 *        - position
 *        - status
 *        - workType
 *        - workLocation
 *        - createdBy
 *      properties:
 *        company:
 *          type: string
 *          description: User Company name
 *        position:
 *          type: string
 *          description: User position
 *        status:
 *          type: string
 *          description: User status
 *          enum: ['Pending', 'Reject', 'Interview']
 *          default: Pending
 *        workType:
 *          type: string
 *          description: user worktype
 *          enum: ['full-time', 'part-time', 'internship', 'contract']
 *          default: full-time
 *        workLocation:
 *          type: string
 *          description: user worklocation
 *          default: Mumbai
 *        createdBy:
 *          type: mongoose.Types.ObjectId
 *          ref: User
 *          description: user 
 *          
 *      example:
 *        company: TCS
 *        position: Backend Developer
 *        status: Pending
 *        workType: full-time
 *        workLocation: Mumbai
 *        createdBy: GDHJGD788BJBJ
 * 
 * security:
 *  - bearerAuth: []
 */

/**
 * @swagger
 * /api/v1/job/create-job:
 *  post:
 *    summary: Create a new job
 *    tags: [Job]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/JobModel'
 *    responses:
 *      201:
 *        description: Job created successfully
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */

router.post('/create-job',userauth,createJobController)
/**
 * @swagger
 * /api/v1/job/get-jobs:
 *  get:
 *    summary: Get a job
 *    tags: [Job]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Job retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/JobModel'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Job not found
 *      500:
 *        description: Something went wrong
 */
//get job
router.get('/get-jobs',userauth,getAllJobsControlller)
/**
 * @swagger
 * /api/v1/job/update-job/{id}:
 *  patch:
 *    summary: Update a job by ID
 *    tags: [Job]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The ID of the job to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              company:
 *                type: string
 *                description: The company name
 *              position:
 *                type: string
 *                description: The position name
 *              status:
 *                type: string
 *                description: The job status
 *                enum: ['Pending', 'Reject', 'Interview']
 *              workType:
 *                type: string
 *                description: The work type
 *                enum: ['full-time', 'part-time', 'internship', 'contract']
 *              workLocation:
 *                type: string
 *                description: The work location
 *    responses:
 *      200:
 *        description: Job updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/JobModel'
 *      400:
 *        description: Invalid job ID
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Job not found
 *      500:
 *        description: Something went wrong
 */
//update job
router.patch('/update-job/:id',userauth,updateJobController)
export default router 
// delete job
router.delete('/delete-job/:id',userauth,deleteJobController)
//job stats filter
router.get('/job-stats',userauth,jobsStastFilter)