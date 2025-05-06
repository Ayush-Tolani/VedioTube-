import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body
    if(!content)
    {
        throw new ApiError(400, "Content is required")
    }
    const tweet=await Tweet.create({content,owner:req.user});

    return res.status(201).json(
        new ApiResponse(200, tweet, "Tweet posted Successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params

    if (!userId?.trim()) {
        throw new ApiError(400, "userId is missing")
    }

    const tweets = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId) 
            }
        },
        {
            $lookup: {
                from: "tweets",
                localField: "_id",
                foreignField: "owner",
                as: "No of Tweets",
                pipeline:[
                    {
                        $project:{
                            _id:0,
                            content:1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                Tweets: "$No of Tweets"
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                Tweets:1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!tweets?.length) {
        throw new ApiError(404, "No tweets by user")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweets, "User channel fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}=req.params
    const {content}=req.body
    
    if (!tweetId) {
        throw new ApiError(400, "Tweet doesn't exist")
    }
    if(!content)
    {
        throw new ApiError(400, "Content is required")
    }
    const tweet= await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content,
            owner:req.user
        },
        {new:true}
    )
    return res.status(201).json(
        new ApiResponse(200, tweet, "Tweet updated Successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params
    if (!tweetId) {
        throw new ApiError(400, "Tweet doesn't exist")
    }
    await Tweet.findByIdAndDelete(tweetId)
    return res.status(201).json(
        new ApiResponse(200, "Tweet deleted Successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
