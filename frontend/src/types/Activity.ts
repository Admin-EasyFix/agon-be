export interface Activity {
    id: string;
    date: string; // ISO date string
    distance: number; // Distance in kilometers, optional
    pace: string;
    duration: number;
    aiComment: string;
    elevation?: number;
    heartRate?: number;
    name: string;
    type: 'running' | 'cycling' | 'swimming' | 'hiking' | 'other';
}