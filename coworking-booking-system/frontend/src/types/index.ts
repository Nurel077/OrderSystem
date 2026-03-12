export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'user' | 'admin';
}

export interface Workspace {
    id: string;
    coworking_id: string;
    name: string;
    type: 'hot_desk' | 'dedicated_desk' | 'meeting_room';
    capacity: number;
    price_per_hour: string;
}

export interface CoworkingSpace {
    id: string;
    name: string;
    description: string;
    address: string;
    opening_time: string;
    closing_time: string;
    workspaces?: Workspace[];
}

export interface Booking {
    id: string;
    user_id: string;
    workspace_id: string;
    start_time: string;
    end_time: string;
    total_price: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    workspace_name?: string;
    coworking_name?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
