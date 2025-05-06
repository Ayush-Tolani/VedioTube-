import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { response } from "express"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    const playlist=await Playlist.create({
        name,
        description,
        owner : req?.user,
    });
    return res.status(201).json(
        new ApiResponse(200, playlist, "Playlist created Successfully")
    )
})
//TODO: get user playlists
const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!userId)
    {
        throw new ApiError(404,"User does not exist")
    }
    const userPlaylists= await Playlist.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $project:{
                _id:0,
                name: 1,
                description: 1,
                videos: 1
            }
        }   
    ])
    if(!userPlaylists.length)
    {
        throw new ApiError(404,"User has no Playlists")
    }
    
    return res.status(201).json(
        new ApiResponse(200, userPlaylists, "All the Playlists of user")
    )
})
 //TODO: get playlist by id
const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const playlist=await Playlist.findById(playlistId)
    if(!playlist)
    {
        throw new ApiError(404,"Playlist not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "Playlist fecthed sucessfully")
    )
   
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    if(!(await Playlist.findById(playlistId)))
    {
        throw new ApiError(404,"Playlist not found for uploading")
    }
    const playlist=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push:{
                videos:videoId
            }
        },
        {new:true}
    )

    return res
    .status(201)
    .json(
        new ApiResponse(200,playlist,"Video added sucessfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!(await Playlist.findById(playlistId)))
    {
        throw new ApiError(404,"Playlist not found for removing")
    }
    const playlist=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{
                videos:{$in:[videoId]}
            }
        },
        {new:true}
    )
    return res
    .status(201)
    .json(
        new ApiResponse(200,playlist,"Video removed sucessfully")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!(await Playlist.findById(playlistId)))
        {
            throw new ApiError(404,"Playlist not found for deleting")
        }
    await Playlist.findByIdAndDelete(playlistId)
    return res.status(200).json( new ApiResponse(200,"Playlist Deleted succesfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!(await Playlist.findById(playlistId)))
    {
        throw new ApiError(404,"Playlist not found for deleting")
    }
    const playlist=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name :name,
                description:description
            }
        },
        {new:true}
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200,playlist,"Playlist updated succesfully")
    )
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
