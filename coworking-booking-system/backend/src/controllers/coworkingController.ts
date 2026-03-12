import { Request, Response } from 'express';
import { pool } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getCoworkings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { rows } = await pool.query('SELECT * FROM coworking_spaces ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching coworkings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCoworkingById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Get main space details
        const { rows: spaceRows } = await pool.query('SELECT * FROM coworking_spaces WHERE id = $1', [id]);

        if (spaceRows.length === 0) {
            res.status(404).json({ message: 'Coworking space not found' });
            return;
        }

        // Get associated workspaces
        const { rows: workspaceRows } = await pool.query('SELECT * FROM workspaces WHERE coworking_id = $1', [id]);

        res.status(200).json({
            ...spaceRows[0],
            workspaces: workspaceRows
        });
    } catch (error) {
        console.error('Error fetching coworking id:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createCoworking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, description, address, opening_time, closing_time } = req.body;

        if (!name || !address || !opening_time || !closing_time) {
            res.status(400).json({ message: 'Name, address, opening, and closing times are required' });
            return;
        }

        const { rows } = await pool.query(
            'INSERT INTO coworking_spaces (name, description, address, opening_time, closing_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, address, opening_time, closing_time]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating coworking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Workspaces
export const createWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { coworking_id, name, type, capacity, price_per_hour } = req.body;

        if (!coworking_id || !name || !type || !price_per_hour) {
            res.status(400).json({ message: 'Missing required workspace fields' });
            return;
        }

        const { rows } = await pool.query(
            'INSERT INTO workspaces (coworking_id, name, type, capacity, price_per_hour) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [coworking_id, name, type, capacity || 1, price_per_hour]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating workspace:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
