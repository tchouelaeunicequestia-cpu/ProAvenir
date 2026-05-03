// controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';
import dotenv from 'dotenv';

dotenv.config();

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { first_name, last_name, email, password, role, region } = req.body;

        // 1. Check if the user already exists
        const [existingUsers]: any = await pool.query('SELECT email FROM Users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            res.status(400).json({ success: false, message: "Email is already registered." });
            return;
        }

        // 2. Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save the new user to the database
        const sql = `INSERT INTO Users (first_name, last_name, email, password_hash, role, region) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        const [result]: any = await pool.query(sql, [first_name, last_name, email, hashedPassword, role, region]);

        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // 1. Find the user in the database
        const [users]: any = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            res.status(401).json({ success: false, message: "Invalid email or password." });
            return;
        }
        const user = users[0];

        // 2. Compare the typed password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            res.status(401).json({ success: false, message: "Invalid email or password." });
            return;
        }

        // 3. Create the JWT Token (The secure badge)
        // We pack the user's ID and role inside the token so we know who they are later
        const tokenPayload = {
            id: user.user_id,
            role: user.role
            // Note: If they are a recruiter, you'd also look up and attach their company_id here!
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string, { expiresIn: '24h' });

        res.status(200).json({ 
            success: true, 
            message: "Login successful!", 
            token: token,
            user: { id: user.user_id, role: user.role, first_name: user.first_name }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
};