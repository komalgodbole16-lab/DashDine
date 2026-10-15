import { NextFunction, Request, Response } from "express";
import { IUser, User } from "../models/user.js";
import Jwt  from "jsonwebtoken";

export interface AuthRequest extends Request{
    user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction):
Promise<void> => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            //get token from header
            token = req.headers.authorization.split(" ")[1];

            //Verify token
            const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as {id: string};

            //Get user from the token, ecxlude password
            const user = await User.findById(decoded.id).select("-password");
            if(!user){
                res.status(401).json({message: "Not authorised, user not found"});
                return;
            }
            req.user = user;
            next()
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            res.status(401).json({message: "Not authorised, token falied"});
            return;
        }
    }

    if(!token){
        res.status(401).json({message: "Not authorised, no token"});
    }
}


export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void=>{
    if(req.user && req.user.role === "admin"){
        next()
    }else{
        res.status(403).json({message: "Access denied, admin role required"});
    }
}

export const ownerOnly = (req: AuthRequest, res: Response, next: NextFunction): void=>{
    console.log("Checking role for user:", req.user?.email, req.user?.role);   // <-- ye line add kar
    if(req.user && (req.user.role === "owner" || req.user.role === "admin")){
        next()
    }else{
        res.status(403).json({message: "Access denied, restaurant owner role required"});
    }
}