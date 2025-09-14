import { eq } from "drizzle-orm"; 
import dotenv from "dotenv"
import { Context } from "hono";



export const registerUser = async (c:Context) => {
    try {
        
    } catch (error) {
        
    }
}

export const registerTrader = async (c:Context) => {
    try {
        
    } catch (error) {
        return c.json({
            success:false,
            message:"Trader registration failed"
        },500)
    }
}

export const loginUser = async (c:Context) => {
    try {
        
    } catch (error) {
        return c.json({
            success:false,
            message:"User login failed"
        })
    }
}

export const loginTrader = async (c:Context) => {
    try {
        
    } catch (error) {
        return c.json({
            success:false,
            message:"Failed to login trader"
        })
    }
}