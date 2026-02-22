import jwt from "jsonwebtoken";

//admin authentication middleware
const authAdmin = async(req,res,next)=>{
    try{

        //aToken autometically converted into lowercase
        const {atoken} = req.headers
        if(!atoken){
            return res.json({
                success:false,
                message:"Not Authorized Login Again",
            })
        }
        //token decode and checked is it is admin token or not
        const token_decode = jwt.verify(atoken,process.env.JWT_SECRET);
        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASS){
            return res.json({
                success:false,
                message:"Not Authorized Login Again",
            })
        }
        next();
    }catch(e){
        console.log(e);
        return res.json({
            success: false,
            message:e.message,
        })
        
    }
}

export default authAdmin;