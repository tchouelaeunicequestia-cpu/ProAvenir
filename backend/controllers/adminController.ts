// controllers/adminController.ts
import { Request, Response } from 'express';
import pool from '../db';

// Update Company Status
export const approveCompany = async (req: Request, res: Response): Promise<void> => {
    try {
        const { company_id } = req.params; // Get the ID from the URL

        const sql = `UPDATE Companies SET status = 'Approved' WHERE company_id = ?`;
        const [result]: any = await pool.query(sql, [company_id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: "Company not found." });
            return;
        }

        res.status(200).json({ success: true, message: "Company successfully approved." });
    } catch (error) {
        console.error("Error approving company:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Soft Delete / Suspend User
export const suspendUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id } = req.params;

        const sql = `UPDATE Users SET is_active = FALSE WHERE user_id = ?`;
        const [result]: any = await pool.query(sql, [user_id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }

        res.status(200).json({ success: true, message: "User account suspended (Soft Delete)." });
    } catch (error) {
        console.error("Error suspending user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};