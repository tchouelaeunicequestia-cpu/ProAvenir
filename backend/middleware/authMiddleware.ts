// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Tell TypeScript what data is packed inside our JWT
interface JwtPayload {
    id: number;
    role: string;
    company_id?: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    // The frontend sends the token in the headers like this: "Bearer eyJhbGciOiJIUz..."
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: "Access Denied. No token provided." });
        return;
    }

    const token = authHeader.split(' ')[1]; // Get just the token part

    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        
        // Attach the real user data to the request!
        req.user = decoded; 
        
        next(); // Token is good, let them through!
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid or expired token." });
    }
};