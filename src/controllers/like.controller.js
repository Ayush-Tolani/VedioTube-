import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const likeVideo= await Like.aggregate(
        [{
            $match:{
                video:new mongoose.Types.ObjectId(videoId)
            }
        }]
    )
    if(!likeVideo.length)
    {
        await Like.create({
            video:videoId,
            likedBy:req.user
    })
    }
    else{
        await Like.findByIdAndDelete(likeVideo)
    }
    return res.status(200).json( new ApiResponse(200,"Like Toggle succes in video"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const likeComment= await Like.aggregate(
        [{
            $match:{
                comment:new mongoose.Types.ObjectId(commentId)
            }
        }]
    )
    if(!likeComment.length)
    {
        await Like.create({
            comment:commentId,
            likedBy:req.user
    })
    }
    else{
        await Like.findByIdAndDelete(likeComment)
    }
    return res.status(200).json( new ApiResponse(200,"Like Toggle succes in comment"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const likeTweet= await Like.aggregate(
        [{
            $match:{
                tweet:new mongoose.Types.ObjectId(tweetId)
            }
        }]
    )
    if(!likeTweet.length)
    {
        await Like.create({
            tweet:tweetId,
            likedBy:req.user
    })
    }
    else{
        await Like.findByIdAndDelete(likeTweet)
    }
    return res.status(200).json( new ApiResponse(200,"Like Toggle succes in tweet"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const videos=await Like.aggregate([
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(req.user),
                video:{$exists: true}
            }
        },
        {
            $project:{
                _id:0,
                video:1
            }
        }
    ])
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,videos,"All videos liked by user")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}