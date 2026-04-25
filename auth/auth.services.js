import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const signupService = async ({ name, email, password, role }) => {
    const existingUser = await prisma.user.findUnique({ where: { email : email.toLowerCase() } });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const user = await prisma.user.create({
        data: {
            name,
            email : email.toLowerCase(),
            passwordHash: await bcrypt.hash(password, 10),
            role
        }
    });
    const token = jwt.sign({ id: user.id , role: user.role  }, JWT_SECRET, { expiresIn: "1h" });
    const {passwordHash, ...userWithoutPassword} = user;
    return { user : userWithoutPassword, token };
}

export const signinService  = async({email, password}) => {
    const user = await prisma.user.findUnique({ where: { email : email.toLowerCase() } });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    const token = jwt.sign({ id: user.id , role: user.role  }, JWT_SECRET, { expiresIn: "1h" });
    const {passwordHash, ...userWithoutPassword} = user;
    return { user : userWithoutPassword, token };
}

export const profileService = async ({id,role}) => {
    const existingUser = await prisma.user.findUnique({
        where: {id} 
    });
    
    if(!existingUser || existingUser.role !== role){
        throw new Error("Unauthorized");
    }
    const {passwordHash, ...userWithoutPassword} = existingUser;
    return userWithoutPassword;
}
