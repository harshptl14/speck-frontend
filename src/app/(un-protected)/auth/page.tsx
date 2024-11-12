"use client";
import AppIcon from "@/components/appIcon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
// import axios from "axios";

const AuthPage = () => {
  return (
    <div className="flex grow flex-col justify-center gap-4 items-center pt-2 md:pt-6 lg:pt-10 w-full min-h-screen px-5">
      {/* <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-5 max-w-sm text-center">
        Bite-Sized Learning to go
      </h1> */}
      <Card className="mx-auto max-w-sm px-10">
        <CardHeader className="flex grow flex-col justify-center text-center">
          <CardTitle className="text-2xl flex content-center justify-center">
            <div className="flex items-center gap-2 font-semibold">
              <AppIcon className="h-10 w-10" />
              <span className="text-2xl font-semibold">Speck</span>
            </div>
          </CardTitle>
          <CardDescription className="mt-0">
            Start your journey with Speck, the bite-sized learning platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex grow flex-col justify-center">
          <Button variant="default" size="default">
            <a href={`${process.env.NEXT_PUBLIC_API}/speck/v1/auth/google`}>
              Sign in with Google
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
