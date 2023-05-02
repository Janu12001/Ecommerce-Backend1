import Product from "../models/product.schema.js"
import formidable from 'formidable';
import fs from "fs";
import {deleteFile , s3Fileupload} from "../services/imageupload.js"
import Moongoose from "mongoose"
import asyncHandler from"../services/asyncHandler.js"
import CustomError form "../utils/CustomError.js"
import config from"../config/index

export const addProduct = asyncHandler(async(req,res)=>{
     
    const form = formidable({
        multiples: true,
        keepExtension: true,
        

    });
    form.parse(req, async function(err, fields, files){

        try{

            if(err){
                throw new CustomError(err.message || "something went wrong", 500)
            }

            let productId =  new Mongoose.Types.ObjectId().toHexString()
            //console.log(fields, files)
            //check for fields

            if( !fields.name|| !fields.price || !fields.description || fields.collectionId){
                throw new CustomError("PLease fill all details", 500) 
            }

            // handling images
            let imgArrayResp = Promise.all(
                Object.keys(files).map(async(filekey,index)=>{
                    const element = files[filekey]
                    const data = fs.readFileSync(element.filepath)
                    const upload = await s3Fileupload({
                        bucketName: config.S3_BUCKET_NAME,
                        key: `products/${productId}/photo_${index + 1}.png`,
                        body:data,
                        contentType: element.mimetype
                    })
                    return {
                        secure_url:upload.Location
                    }
                })  
            )

            let imgArray = await imgArrayResp;
            const product = await Product.create({
                _id: productId,
                photos:imgArray,
                ...fields,
            })
            if(!product){
                throw new CustomError("Product was not created ", 400)

            }

            res.status.json({
                success: true, 
                product,
            })
        
        }catch(error){
            return res.status(500).json({
                success: true, 
                message: error.message || "something went wrong"
            })
        }
    })
})



export const getAllProducts = ayncHandler(async(req,res)=>{

    const products = await Products.find({})
    if(!products){
        throw new CustomError("No product was found" , 404)
    }

    res.status(200).json({
        success: true,
        products
    })
})



export const ProductbyId = ayncHandler(async(req,res)=>{
    const {} = req.params
    const product = await Products.findById(productId))
    if(!product){
        throw new CustomError("No product was found" , 404)
    }

    res.status(200).json({
        success: true,
        product
    })
})