// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { CreditCard, AlertTriangle, User } from "lucide-react";

// import axios from "axios";
// // import { cookies } from "next/headers";

// import GenericModal from "@/components/modal";
// export interface User {
//   id: number;
//   email: string;
//   name: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export const getClientSideCookie = (name: string): string | undefined => {
//   const cookieValue = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith(`${name}=`))
//     ?.split("=")[1];

//   return cookieValue;
// };

// async function getUser(): Promise<User | null> {
//   const authorization = getClientSideCookie("jwtToken");

//   // cookies().get("jwtToken")?.value;

//   try {
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/user/userinfo`,
//       {
//         headers: {
//           Authorization: `Bearer ${authorization}`,
//         },
//       }
//     );

//     console.log("response in the getUser fun:", response?.data);
//     return response?.data?.data;
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return null;
//   }
// }

// import { useEffect, useState } from "react";

// export default function Settings() {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const userData = await getUser();
//       setUser(userData);
//       console.log("user in settings", userData);
//     };

//     fetchUser();
//   }, []);

//   return (
//     <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-3xl">
//       <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

//       <div className="space-y-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>Personal Information</CardTitle>
//             <CardDescription>
//               Your account details and preferences.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="flex items-center space-x-4">
//               <Avatar className="h-20 w-20">
//                 <AvatarImage
//                   src="/placeholder.svg?height=80&width=80"
//                   alt="Profile picture"
//                 />
//                 <AvatarFallback>
//                   <User className="h-10 w-10" />
//                 </AvatarFallback>
//               </Avatar>
//               <Button variant="outline" size="sm">
//                 Change Photo
//               </Button>
//             </div>

//             <div className="grid gap-1">
//               <Label htmlFor="username">Username</Label>
//               <p
//                 id="username"
//                 className="text-sm font-medium text-muted-foreground"
//               >
//                 {user?.name}
//               </p>
//             </div>

//             <div className="grid gap-1">
//               <Label htmlFor="email">Email</Label>
//               <p
//                 id="email"
//                 className="text-sm font-medium text-muted-foreground"
//               >
//                 {user?.email}
//               </p>
//             </div>

//             <div className="grid gap-1">
//               <Label htmlFor="created-at">Created at</Label>
//               <p
//                 id="created-at"
//                 className="text-sm font-medium text-muted-foreground"
//               >
//                 {user?.createdAt
//                   ? new Date(user.createdAt).toLocaleDateString()
//                   : "N/A"}
//               </p>
//             </div>

//             <Button variant="default" size="sm" className="flex items-center">
//               <a href={process.env.NEXT_PUBLIC_API + "/speck/v1/auth/logout"}>
//                 Logout
//               </a>
//             </Button>

//             <Separator className="my-4" />

//             <div>
//               <h3 className="text-lg font-semibold mb-2">Delete Account</h3>
//               <p className="text-sm text-muted-foreground mb-4">
//                 Permanently remove your account and all of its contents. This
//                 action is irreversible.
//               </p>
//               {/* <Button
//                 variant="destructive"
//                 size="sm"
//                 className="flex items-center"
//               >
//                 <AlertTriangle className="mr-2 h-4 w-4" />
//                 Delete Account
//               </Button> */}
//               {/* <Dialog
//                 open={isDeleteDialogOpen}
//                 onOpenChange={setIsDeleteDialogOpen}
//               >
//                 <DialogTrigger asChild>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     className="flex items-center"
//                   >
//                     <AlertTriangle className="mr-2 h-4 w-4" />
//                     Delete Account
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>
//                       Are you sure you want to delete your account?
//                     </DialogTitle>
//                     <DialogDescription>
//                       This action cannot be undone. This will permanently delete
//                       your account and remove your data from our servers.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <DialogFooter>
//                     <Button
//                       variant="outline"
//                       onClick={() => setIsDeleteDialogOpen(false)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button variant="destructive" onClick={handleDeleteAccount}>
//                       Yes, delete my account
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog> */}

//               <GenericModal
//                 triggerButton={
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     className="flex items-center"
//                   >
//                     <AlertTriangle className="mr-2 h-4 w-4" />
//                     Delete Account
//                   </Button>
//                 }
//                 title="Are you sure you want to delete your account?"
//                 description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
//                 confirmButtonText="Yes, delete my account"
//                 actionId="delete-account"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Plan & Billing</CardTitle>
//             <CardDescription>
//               Manage your subscription and billing details.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center space-x-4">
//               <CreditCard className="h-6 w-6 text-muted-foreground" />
//               <div>
//                 <p className="font-medium">Free Plan</p>
//                 <p className="text-sm text-muted-foreground">
//                   You are currently on the free plan.
//                 </p>
//               </div>
//             </div>
//             <Button variant="outline" size="sm">
//               Upgrade Plan
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

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
          <PlanBilling />
        </div>
      </div>
    </div>
  );
};

export default Settings;
