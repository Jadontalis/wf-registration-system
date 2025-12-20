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
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    password: string;
    confirm_password?: string;
    bios?: string;
    waiver_signed: boolean;
    competitor_type: "RIDER" | "SKIER" | "SNOWBOARDER" | "SKIER_AND_SNOWBOARDER" | "RIDER_SKIER_SNOWBOARDER";
}