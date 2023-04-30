import asyncHandler from '../services/asyncHandler'
import Collection from'../models/collection.schema.js'
import CustomError from '../utils/CustomError'

export const createCollection = asyncHandler(async(req,res) =>{
// take name from front end
    const{name} = req.body
    if(!name){
        throw new CustomError("Collection name is required ", 400)
    }
  
    //add this name to database
   const collecton = await Collection.create({
        name
    })

 //   send this ressponse to frontend
   res.status(200).json({

    sucess: true,
    message: "Collection created with success",
    collecton

   })




})

//update collection
export const updateCollection = asyncHandler(async(req,res)=>{

    //existing value to be updated 
    const{id: collectionId} = req.params 
    //new value to be updated
    const {name} = req.body

    if(!name){
        throw new CustomError("Collection name is required", 400)
    }

    let updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        {
           name,
        },
        {
           new: true,
           runValidators: true
        }
    )

    if(!updatedCollection){

        throw new CustomError("collection is not found , 400")
    }

    //send response to front end
    res.status(200).json({
        success: true,
        message: "Collection Updated successfully",
        updatedCollection
    })
})

//delete collection

export const deleteCollection = asyncHandler(async,( req, res)=>{
   
    const{id: collectionId} = req.params

  const collectiontodelte=  await Collection.findByIdAndDelete(collectionId)
  if(collectiontodelte){

    throw new CustomError("collection is not found , 400")
    }

    res.status(200).json({
        success: true,
        message: "Collection get successfully",
        
    })
})

export const getallCollections = asyncHandler(async(req,res)=>{
   const Collections = await Collection.find()

   if(!Collections){

    throw new CustomError("No Collection found" , 400)
   }

   res.status(200).json({
    success: true,
    Collections
})
})