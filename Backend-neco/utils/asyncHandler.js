const asyncHandler = (requestHandler) =>{
    return (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err) => next(err))
    }
}

// const asyncHandler = () => () => {}

export {asyncHandler}

// const asyncHandler = (fun) => async (req,res,next) => asyncHandler =>{
//     try {
        
//     } catch (error) {
//         res.send(error.code || 500).jsom({
//             succes:false,
//             message:"sorry bro!"
//         })
//     }
// }
