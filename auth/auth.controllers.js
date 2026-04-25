import { signupService, signinService, profileService } from "./auth.services.js";
import { signUpSchema, signInSchema } from "./auth.validation.js";

export const signupController = async (req,res) => {
    try{
        const validation = signUpSchema.safeParse(req.body);
        if(!validation.success){
            return res.status(400).json({message: "Invalid input",error: validation.error});
        }
        const {name,email,password,role} = validation.data;
        const result = await signupService({name,email,password,role});
        return res.status(201).json({message: "User created successfully",user: result.user,token: result.token});
    }
    catch(e){
        return res.status(400).json({message: e.message});
    }
}

export const signinController = async (req,res) => {
    try{
        const validation = signInSchema.safeParse(req.body);
        if(!validation.success){
            return res.status(400).json({message: "Invalid input",error: validation.error});
        }
        const {email,password} = validation.data;
        const result = await signinService({email,password});
        return res.status(200).json({message: "User logged in successfully",user: result.user,token: result.token});
    }
    catch(e){
        return res.status(400).json({message: e.message});
    }
}

export const profileController = async (req,res) => {
    try{
        const {id,role} = req.user;
        const result = await profileService({id,role});
        return res.status(200).json({message: "User profile fetched successfully",user: result});
    }
    catch(e){
        return res.status(400).json({message: e.message});
    }
}