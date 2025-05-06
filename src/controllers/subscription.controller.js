import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const subUrl=await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId)
            }
    }
    ])
    // console.log(subUrl)
    const user = req.user
    if(!subUrl.length)
    {
        const subscriber=await User.findById(channelId)
        await Subscription.create({
            subscriber:user,
            channel:subscriber,
        })
    }
    else{
        await Subscription.findByIdAndDelete(subUrl);
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Toggel successful")
    )
})
// recheck it 
// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    try{
    const subscribers= await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $project:{
                _id:0,
                subscriber:1
            }
        }
        
    ])
    console.log(subscribers);
    return res
    .status(200)
    .json(
        new ApiResponse(200, subscribers,"Got Sbscribers successful")
    )
    }
    catch(err)
    {
        throw new ApiError(400,err?.message ||"This is catch block of get subsceribers");
        
    }

})
// recheck it 
// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const channels= await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $project:{
                _id:0,
                channel:1
            }
        }
        
    ])
    console.log(channels);
    return res
    .status(200)
    .json(
        new ApiResponse(200, channels,"Got channels successful")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}