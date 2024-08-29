"use client";
import { Button } from "@/components/ui/button";
import React from "react";
// import axios from "axios";

const handleGoogleAuth = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/auth/google`,
      {
        mode: "no-cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          // Add your additional headers here
        },
        // Add request body if needed
        // body: JSON.stringify({ key: value }),
      }
    );
    if (!response.ok) {
      throw new Error("Authentication failed");
    }
    // Handle successful authentication
  } catch (error) {
    console.error("Authentication error:", error);
    // Handle error (e.g., show error message to user)
  }
};

const AuthPage = () => {
  return (
    <div>
      <h1>Auth Page</h1>
      <Button variant="default" size="default">
        <a href="http://localhost:4000/speck/v1/auth/google">
          Sign in with Google
        </a>
      </Button>
    </div>
  );
};

export default AuthPage;
