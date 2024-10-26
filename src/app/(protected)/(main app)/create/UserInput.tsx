"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";

const handleCreate = async (
  inputValue: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setResponseMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  console.log("inputValue ---------------", inputValue);

  setLoading(true);
  const authorization = document?.cookie
    ?.split(";")
    .find((cookie) => cookie.includes("jwtToken"))
    ?.split("=")[1];
  // Make your API call here using the input value
  // For example:
  axios
    .post(
      `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/roadmap/create`,
      {
        prompt: inputValue,
      },
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
      }
    )
    .then((response) => {
      // Handle the API response data
      console.log(response.data);
      setResponseMessage(response.data.message); // Set the response message
    })
    .catch((error) => {
      // Handle any errors
      // Handle any errors
      console.error(error);
      // Inform the user about the error
      let errorMessage =
        "An unexpected error occurred. Please try again later.";
      if (error.response && error.response.status === 500) {
        errorMessage =
          "Server error: We are currently experiencing issues. Please try again later.";
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      // Set the error message to be displayed to the user
      setResponseMessage(errorMessage);
    })
    .finally(() => {
      setLoading(false);
    });
};

const UserInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(""); // State variable for response message

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      {responseMessage ? (
        <div className="flex flex-col items-center gap-1 text-center">
          {responseMessage}
          <Button>
            <Link href="/library">Visit library</Link>
          </Button>
        </div>
      ) : (
        <div>
          <h3 className="text-2xl font-bold tracking-tight">
            What do you want to learn?
          </h3>
          <p className="text-sm text-muted-foreground text-wrap max-w-md">
            Write a prompt which describes what you want to learn and how you
            want to construct your roadmap
          </p>
          <Input
            className="w-96"
            placeholder="Enter your prompt"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button
            className="mt-4"
            onClick={() =>
              handleCreate(inputValue, setLoading, setResponseMessage)
            }
          >
            Create
          </Button>
          {loading && <div>Loading...</div>}
        </div>
      )}
    </div>
  );
};

export default UserInput;
