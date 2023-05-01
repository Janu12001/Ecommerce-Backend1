import s3 from '../config/s3.config.js'

//upload file
export const s3Fileupload = async({bucketName, key , body, contentType}) =>{
    return await s3.upload({

        Bucket: bucketName,
        Key:key,
        Body:body,
        ContentType:contentType
    })

    .promise()
}

//deletefile
export const deleteFile = async({bucketName,key}) =>{
    return await s3.deleteObject({
        Bucket: bucketName,
        Key: key
    })
    .promise()
}