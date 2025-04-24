// "use client";

// import { useEffect, useState } from "react";

// interface GreetingSectionProps {
//   userName: string;
// }

// const GreetingSection: React.FC<GreetingSectionProps> = ({ userName }) => {
//   const [greeting, setGreeting] = useState("");

//   useEffect(() => {
//     const hour = new Date().getHours();
//     if (hour < 5) setGreeting("Happy late night");
//     else if (hour < 12) setGreeting("Good Morning");
//     else if (hour < 18) setGreeting("Good Afternoon");
//     else setGreeting("Good Evening");
//   }, []);

//   return (
//     <section className="text-center space-y-1 mt-5">
//       <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
//         {greeting}, {userName}
//       </h1>
//       <p className="text-md font-light text-foreground">
//         Embark on your AI-powered learning journey today.
//       </p>
//     </section>
//   );
// };

// export default GreetingSection;


"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface GreetingSectionProps {
  userName: string
}

const GreetingSection: React.FC<GreetingSectionProps> = ({ userName }) => {
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 5) setGreeting("Happy late night")
    else if (hour < 12) setGreeting("Good Morning")
    else if (hour < 18) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")
  }, [])

  return (
    <motion.section
      className="text-center space-y-2 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
        {greeting}, {userName}
      </h1>
      <p className="text-sm md:text-base font-light text-muted-foreground max-w-xl mx-auto">
        Embark on your AI-powered learning journey today
      </p>
    </motion.section>
  )
}

export default GreetingSection
