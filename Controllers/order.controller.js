import Product from"../models/product.schema.js"
import Coupon from"../models/coupon.schema.js"
import Order from"../models/order.schema.js"
import asyncHandler from"../services/asyncHandler.js"
import CustomError from"../utils/CustomError.js"
import razorpay from"../config/razorpay.config.js"

/***********************************************************************************
@GENERATE_RAZORPAY_ID
@ROUTE HTTPS//LOCALHOST: 5000 /API/ORDER/RAZORPAY
@DESCRIPTION CONTROLLER USED FOR GENERTING RAZORPAY ID
@RETURNS ORDER OBJECT WITH "RAZORPAY ORDERID GENERATED SUCCESSFULLY"

************************************************************************************/

export const generateRazorpayOrderId = asyncHandler(async(req,res)=>{
    //step1 get product  and coupon form frontend
     
    //verify product price from backend


    //make db query to get all the product and information
   let totalAmount;
    //total amount and final amount

    //coupon check - db
    //finalAmount

    const options = {
        amount: Math.round(totalAmount * 100)
        currency:"INR",
        receipt:`receipt_${(new Date().getTime()}`

    }

    const order = await razorpay.orders.create(options)

    // if order does not exit
    // sucess then send to frontend


})

