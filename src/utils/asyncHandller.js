const asyncHandller = (requestHander)=>{
    (req, res, next)=>{
        Promise.resolve(requestHander(req, res, next)).catch((err)=> next(err))
    }

}



export {asyncHandller}


// const asyncHandller = (func) => async(req, res, next)=>{
//     try {
//         await func(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }