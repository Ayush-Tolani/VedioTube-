import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);
    const comments=await Comment.aggregate([
        {
            $match:{
                video:new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $project:{
                _id:0,
                content:1
            }
        }
    ])
    .skip((pageNumber - 1) * pageLimit) // Skip items based on current page
    .limit(pageLimit); 
    return res.status(201).json(new ApiResponse(200,comments,"All comment fetched"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const{videoId}=req.params
    const {content} = req.body
    const comment=await Comment.create({
        content,
        video:videoId,
        owner:req.user
    })

    return res
    .status(201)
    .json(
        new ApiResponse(200,comment,"Comment added")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId}=req.params
    const {content}=req.body
    const comment=await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content:content
            }
        },
        {new:true}
    )

    return res.status(201).json(new ApiResponse(200,comment,"Comment Updated "))
    
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params
    await Comment.findByIdAndDelete(commentId);
    return res.status(201).json(new ApiResponse(200,"Comment Deleted "))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
