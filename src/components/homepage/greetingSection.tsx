'use client';

import { useEffect, useState } from 'react';

interface GreetingSectionProps {
    userName: string;
}

const GreetingSection: React.FC<GreetingSectionProps> = ({ userName }) => {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 5) setGreeting('Happy late night');
        else if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    return (
        <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">{greeting}, {userName}</h1>
            <p className="text-xl text-muted-foreground">
                Embark on your AI-powered learning journey today.
            </p>
        </section>
    );
};

export default GreetingSection;