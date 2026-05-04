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

// controllers/jobController.ts (Updated getAllJobs function)

export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract filters, search, and pagination from the URL query
        // Example URL: /api/jobs?search=developer&page=2&limit=10
        const { region, search, page = '1', limit = '10' } = req.query; 

        // Convert strings to numbers for math
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const offset = (pageNum - 1) * limitNum; // e.g., Page 2 with limit 10 skips the first 10 items

        let sql = `
            SELECT j.job_id, j.title, j.job_type, j.location, j.posted_at, c.company_name 
            FROM Job_Listings j
            JOIN Companies c ON j.company_id = c.company_id
            WHERE j.status = 'Open'
        `;
        const queryParams: any[] = [];

        // 1. Filter by Region
        if (region) {
            sql += ` AND j.location LIKE ?`;
            queryParams.push(`%${region}%`);
        }

        // 2. Search Query (checking if the keyword is in the title or description)
        if (search) {
            sql += ` AND (j.title LIKE ? OR j.description LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        // 3. Limit & Offset (Pagination)
        sql += ` ORDER BY j.posted_at DESC LIMIT ? OFFSET ?`;
        queryParams.push(limitNum, offset);

        const [jobs]: any = await pool.query(sql, queryParams);

        // Optional: Run a second quick query to get the total number of jobs for the frontend page numbers
        // (Skipped here for brevity, but you can add it if your frontend team needs it!)

        res.status(200).json({ 
            success: true, 
            page: pageNum,
            resultsOnPage: jobs.length, 
            data: jobs 
        });

    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ success: false, message: "Server error while fetching jobs." });
    }
};