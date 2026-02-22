import jwt from "jsonwebtoken";

//doctor authentication middleware
const authDoctor = async(req,res,next)=>{
    try{        
        //aToken autometically converted into lowercase
        const {dtoken} = req.headers
        
        if(!dtoken){
            return res.json({
                success:false,
                message:"Not Authorized Login Again",
            })
        }
        //token decode and checked is it is admin token or not
        const token_decode = jwt.verify(dtoken,process.env.JWT_SECRET);
        req.body.docId = token_decode.id;        
        next();
    }catch(e){
        console.log(e);
        return res.json({
            success: false,
            message:e.message,
        })
        
    }
}

export default authDoctor;;