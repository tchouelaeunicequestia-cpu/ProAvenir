// controllers/jobController.ts
import { Request, Response } from 'express';
import pool from '../db';

export const createJobListing = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, job_type, description, location } = req.body;

        // Securely grab the user data that the authMiddleware attached!
        const recruiter_id = req.user?.id; 
        const company_id = req.user?.company_id;

        // Optional safety check: Ensure the user actually has a company_id
        if (!company_id) {
            res.status(403).json({ success: false, message: "Only recruiters attached to a company can post jobs." });
            return;
        }

        const sql = `INSERT INTO Job_Listings (company_id, recruiter_id, title, job_type, description, location) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
                     
        await pool.query(sql, [company_id, recruiter_id, title, job_type, description, location]);

        res.status(201).json({ success: true, message: "Job posted successfully!" });

    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
// controllers/jobController.ts (Add this below your createJobListing function)

export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if the frontend sent a region filter in the URL (e.g., /api/jobs?region=Littoral)
        const { region } = req.query; 

        let sql = `
            SELECT j.job_id, j.title, j.job_type, j.location, j.posted_at, c.company_name 
            FROM Job_Listings j
            JOIN Companies c ON j.company_id = c.company_id
            WHERE j.status = 'Open'
        `;
        const queryParams: any[] = [];

        // If they want to filter by region/location, adjust the SQL query
        if (region) {
            sql += ` AND j.location LIKE ?`;
            queryParams.push(`%${region}%`);
        }

        sql += ` ORDER BY j.posted_at DESC`; // Show newest jobs first

        const [jobs]: any = await pool.query(sql, queryParams);

        res.status(200).json({ success: true, count: jobs.length, data: jobs });

    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ success: false, message: "Server error while fetching jobs." });
    }
};