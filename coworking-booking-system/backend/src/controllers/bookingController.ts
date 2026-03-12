import { Request, Response } from 'express';
import { pool } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { workspace_id, start_time, end_time } = req.body;

        if (!workspace_id || !start_time || !end_time) {
            res.status(400).json({ message: 'Workspace ID, start time, and end time are required' });
            return;
        }

        const start = new Date(start_time);
        const end = new Date(end_time);

        if (start >= end) {
            res.status(400).json({ message: 'End time must be after start time' });
            return;
        }

        // Begin transaction for safety against double-booking race conditions
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 1. Check workspace availability and pricing
            const { rows: workspaceCheck } = await client.query('SELECT price_per_hour FROM workspaces WHERE id = $1', [workspace_id]);
            if (workspaceCheck.length === 0) {
                throw new Error('Workspace not found');
            }

            const pricePerHour = parseFloat(workspaceCheck[0].price_per_hour);

            // 2. Check for overlapping active bookings
            const { rows: overlapCheck } = await client.query(`
        SELECT id FROM bookings 
        WHERE workspace_id = $1 
          AND status != 'cancelled'
          AND (start_time < $3 AND end_time > $2)
      `, [workspace_id, start_time, end_time]);

            if (overlapCheck.length > 0) {
                await client.query('ROLLBACK');
                res.status(409).json({ message: 'Workspace is already booked for this time slot' });
                return;
            }

            // Calculate total price based on explicit hours (rough calculation)
            const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            const totalPrice = (durationHours * pricePerHour).toFixed(2);

            // 3. Insert Booking
            const { rows: newBooking } = await client.query(
                'INSERT INTO bookings (user_id, workspace_id, start_time, end_time, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [userId, workspace_id, start_time, end_time, totalPrice, 'confirmed']
            );

            await client.query('COMMIT');
            res.status(201).json(newBooking[0]);
        } catch (txError: any) {
            await client.query('ROLLBACK');
            if (txError.message === 'Workspace not found') {
                res.status(404).json({ message: txError.message });
            } else {
                throw txError;
            }
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getBookings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;

        let query = `
      SELECT b.*, w.name as workspace_name, c.name as coworking_name 
      FROM bookings b
      JOIN workspaces w ON b.workspace_id = w.id
      JOIN coworking_spaces c ON w.coworking_id = c.id
    `;
        let params: any[] = [];

        // Basic RBAC for viewing bookings
        if (role !== 'admin') {
            query += ' WHERE b.user_id = $1';
            params.push(userId);
        }

        query += ' ORDER BY b.start_time DESC';

        const { rows } = await pool.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;
        const { id } = req.params;

        // First check permissions
        const { rows: bookingRows } = await pool.query('SELECT user_id FROM bookings WHERE id = $1', [id]);

        if (bookingRows.length === 0) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        if (role !== 'admin' && bookingRows[0].user_id !== userId) {
            res.status(403).json({ message: 'Not authorized to cancel this booking' });
            return;
        }

        await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', ['cancelled', id]);

        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
