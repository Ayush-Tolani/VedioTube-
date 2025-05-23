import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { ApiError } from "./ApiError.js";
import { error } from "console";


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteOnCloudinary= async (url)=>{
    try {
        if(!url)
            return null
        const urlarr=url.split('/');
        const f=urlarr[urlarr.length-1];
        const fileName=f.split('.')[0];
        const [imageResponse, videoResponse] = await Promise.all([
            cloudinary.uploader.destroy(fileName, { resource_type: "image" }),
            cloudinary.uploader.destroy(fileName, { resource_type: "video" })
        ]);
        
        let response;
        if(imageResponse)
            response=imageResponse;
        else
            response=videoResponse;
        
        return response;

    } catch (error) {
        return null;
    }
}


export {uploadOnCloudinary,deleteOnCloudinary}