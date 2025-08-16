// Mock user data for Navbar demonstration
export const mockUser = {
    firstName: 'Alex',
    lastName: 'Reid',
    email: 'alex.reid@example.com',
    role: 'Owner'
};

// Mock station data for Dashboard
export const initialStations = [
    {
        id: 'STN001',
        name: 'Downtown Charging Hub',
        location: '123 Main St, Anytown, USA',
        earnings: 5450.75,
        ports: [
            { id: 'P01', type: 'Type 2', status: 'Available', power: '22 kW' },
            { id: 'P02', type: 'CCS', status: 'Charging', power: '50 kW' },
            { id: 'P03', type: 'Type 2', status: 'Available', power: '22 kW' },
        ],
    },
    {
        id: 'STN002',
        name: 'Westside Superchargers',
        location: '456 Oak Ave, Sometown, USA',
        earnings: 8920.00,
        ports: [
            { id: 'P01', type: 'CCS', status: 'Charging', power: '150 kW' },
            { id: 'P02', type: 'CCS', status: 'Charging', power: '150 kW' },
            { id: 'P03', type: 'CHAdeMO', status: 'Faulted', power: '50 kW' },
            { id: 'P04', type: 'CCS', status: 'Available', power: '150 kW' },
        ],
    },
    {
        id: 'STN003',
        name: 'Mall Parking Chargers',
        location: '789 Pine Ln, Yourtown, USA',
        earnings: 3200.50,
        ports: [
            { id: 'P01', type: 'Type 2', status: 'Available', power: '7 kW' },
            { id: 'P02', type: 'Type 2', status: 'Available', power: '7 kW' },
        ],
    },
];