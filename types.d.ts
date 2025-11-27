interface EventData {
    id: number;
    title: string;
    date: number | string;
    location: string;
    description: string;
    color: string;
    cover: string;
    summary: string;
    available_events: number;
}

interface authCredentials {
    full_name: string;
    email: string;
    password: string;
    bios: string;
}