// controllers/applicationController.ts
import { Request, Response } from 'express';
import pool from '../db';

export const applyForJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const { job_id } = req.body;
        const student_id = req.user?.id; // Securely pulled from the verified token

        const sql = `INSERT INTO Applications (job_id, student_id) VALUES (?, ?)`;
        await pool.query(sql, [job_id, student_id]);

        res.status(201).json({ success: true, message: "Application submitted successfully!" });

    } catch (error: any) {
        // Catch the MySQL Duplicate Entry constraint (Error 1062)
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            res.status(400).json({ 
                success: false, 
                message: "You have already applied to this job." 
            });
            return;
        }

        console.error("Application error:", error);
        res.status(500).json({ success: false, message: "An unexpected error occurred." });
    }
};