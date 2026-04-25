import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const middleware = (req,res,next) => {
    const token = req.headers.authorization;
    if(!token || !token.startsWith("Bearer ")){
        return res.status(401).json({message:"Unauthorized"});
    }
    const tokenValue = token.split(" ")[1];
    jwt.verify(tokenValue,JWT_SECRET, (err,user) => {
        if(err){
            return res.status(401).json({message:"Unauthorized"});
        }
        req.user = user;
        next();
    });
}