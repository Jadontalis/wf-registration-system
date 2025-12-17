"use client";

import { useEffect, useState } from "react";

interface GreetingProps {
    name?: string | null;
    className?: string;
}

const Greeting = ({ name, className }: GreetingProps) => {
    const [greeting, setGreeting] = useState("Welcome");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    return <h2 className={className}>{greeting}, {name}</h2>;
};

export default Greeting;
