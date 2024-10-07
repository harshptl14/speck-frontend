import { useState } from "react";
import { useToast } from "./use-toast";
import { getClientSideCookie } from "@/lib/utils";
import { deleteUserAccount } from "@/api/user/api";
import { useLogout } from "./useLogout";
// Custom hook for account deletion
export const useDeleteAccount = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const { logout } = useLogout();
    const jwtToken = getClientSideCookie('jwtToken');

    const deleteAccount = async () => {
        setIsDeleting(true);
        try {
            await deleteUserAccount(jwtToken as string);
            await logout();
            toast({
                title: "Account Deleted",
                description: "Your account has been successfully deleted.",
            });

            // Perform any additional cleanup or redirection here
            // For example, you might want to log the user out and redirect to the home page

            return true;
        } catch (error) {
            console.error('Error deleting account:', error);
            toast({
                title: "Error",
                description: "Failed to delete account. Please try again later.",
                variant: "destructive",
            });
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteAccount, isDeleting };
};