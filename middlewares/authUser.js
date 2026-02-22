import jwt from "jsonwebtoken";

//user authentication middleware
const authUser = async(req,res,next)=>{
    try{

        //aToken autometically converted into lowercase
        const {token} = req.headers
        if(!token){
            return res.json({
                success:false,
                message:"Not Authorized Login Again",
            })
        }
        //token decode and checked is it is admin token or not
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    }catch(e){
        console.log(e);
        return res.json({
            success: false,
            message:e.message,
        })
        
    }
}

export default authUser;