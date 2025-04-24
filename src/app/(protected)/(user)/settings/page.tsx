"use client";
import React from "react";
import { useUser } from "@/hooks/useUser";
import { PersonalInformation } from "../../../../components/user/PersonalInfo";
import { PlanBilling } from "../../../../components/user/PlanBilling";
import SimpleNav from "@/components/simpleNav";
import Head from "next/head";

const Settings: React.FC = () => {
  const { user, loading, error } = useUser();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user)
    return <div>No user data available. Please try logging in again.</div>;

  return (
    <div>
      <Head>
        <title>Settings</title>
        <meta name="description" content="User account settings page" />
      </Head>
      <SimpleNav />
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        <div className="space-y-8">
          <PersonalInformation user={user} />
          {/* <PlanBilling /> */}
        </div>
      </div>
    </div>
  );
};

export default Settings;
