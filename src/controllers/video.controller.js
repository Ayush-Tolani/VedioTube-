import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {deleteOnCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if (
        [title, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All title/description is required")
    }
    // console.log(req.files);
    const videoPath = req.files?.videoFile[0]?.path;
    const thumbnailPath = req.files?.thumbnail[0]?.path;
    
    if (!videoPath) {
        throw new ApiError(400, "Video is required")
    }
    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail is required")
    }

    const video = await uploadOnCloudinary(videoPath)
    const thumbnail = await uploadOnCloudinary(thumbnailPath)

    if (!video) {
        throw new ApiError(400, "Video file is required")
    }
    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail file is required")
    }
    
    const response = await Video.create({
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        duration:video.duration,
        owner:req.user,
    })

    const createdVideo = await Video.findById(response._id).select()

    if (!createdVideo) {
        throw new ApiError(500, "Something went wrong while uploading the vedio")
    }

    return res.status(201).json(
        new ApiResponse(200, createdVideo, "Vedio uploaded Successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!videoId?.trim()) {
        throw new ApiError(400, "VideoId is missing")
    }
    const video=await Video.findById(videoId);

    if(!video)
    {
        throw new ApiError(404, "Video does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,video,"Video fetched Successfully"))
    
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const thumbnailPath =req.file?.path;

    if (!thumbnailPath) {
        throw new ApiError(400, "Video is required")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailPath)
   
    if (!thumbnail) {
        throw new ApiError(400, "thumbnail  is required")
    }

    const vedio=await Video.findByIdAndUpdate(
        req.vedio?._id,
        {
            $set:{
                thumbnail:thumbnail.url
            }
        },
        {new:true}
    ).select()
    return res
    .status(200)
    .json(
        new ApiResponse(200, vedio, "Video updated successfully")
    )
    
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId?.trim()) {
        throw new ApiError(400, "VideoId is missing")
    }
    
    const video=await Video.findById(videoId);
    // console.log(video);
    const videoUrl=video.videoFile;
    const thumbnailUrl=video.thumbnail;
    await deleteOnCloudinary(videoUrl);
    await deleteOnCloudinary(thumbnailUrl);

    await Video.findByIdAndDelete(videoId);
    
    return res
    .status(200)
    .json(new ApiResponse(200,"Video deleted Successfully"))
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video=await Video.findById(videoId);
    if(!video)
    {
        throw new ApiError(404, "Video does not exist")
    }
    video.isPublished=!video.isPublished;
    await video.save();
    return res
    .status(200)
    .json(new ApiResponse(200,video.isPublished,"Video fetched Successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
