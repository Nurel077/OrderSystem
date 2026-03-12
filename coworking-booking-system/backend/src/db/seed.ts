import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const seed = async () => {
    try {
        console.log('Seeding database...');

        // 1. Insert Coworking Spaces
        const spaceResult = await pool.query(`
            INSERT INTO coworking_spaces (name, description, address, opening_time, closing_time)
            VALUES 
            ('Tech Hub Downtown', 'A modern space for innovators and startups.', '124 Innovation Way, Downtown', '08:00', '20:00'),
            ('The Quiet Corner', 'Perfect for deep work and focus.', '45 Silence Street, Suburbia', '09:00', '18:00')
            RETURNING id, name
        `);

        const spaces = spaceResult.rows;
        console.log(`Created ${spaces.length} coworking spaces.`);

        // 2. Insert Workspaces
        for (const space of spaces) {
            if (space.name === 'Tech Hub Downtown') {
                await pool.query(`
                    INSERT INTO workspaces (coworking_id, name, type, capacity, price_per_hour)
                    VALUES 
                    ($1, 'Hot Desk A1', 'hot_desk', 1, 5.00),
                    ($1, 'Hot Desk A2', 'hot_desk', 1, 5.00),
                    ($1, 'Meeting Room Gamma', 'meeting_room', 8, 25.00)
                `, [space.id]);
            } else {
                await pool.query(`
                    INSERT INTO workspaces (coworking_id, name, type, capacity, price_per_hour)
                    VALUES 
                    ($1, 'Dedicated Desk B1', 'dedicated_desk', 1, 10.00),
                    ($1, 'Dedicated Desk B2', 'dedicated_desk', 1, 10.00)
                `, [space.id]);
            }
        }

        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await pool.end();
    }
};

seed();
