// middleware/rbacMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    // Check if the user exists in the request (from requireAuth) AND if their role is Admin
    if (req.user && req.user.role === 'Administrator') {
        next(); // They are an admin, let them through!
    } else {
        res.status(403).json({ success: false, message: "Access Denied: Administrator privileges required." });
    }
};