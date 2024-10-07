import { useToast } from "../hooks/use-toast";

export const useLogout = () => {
    const { toast } = useToast();

    const logout = async () => {
        try {
            logout();
            // Optionally, you can clear cookies or local storage here
            document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // localStorage.removeItem('jwtToken');
            // Redirect to the home page
            window.location.href = '/';
        } catch (logoutError) {
            console.error('Error logging out:', logoutError);
            toast({
                title: "Error",
                description: "Failed to log out. Please try again later.",
                variant: "destructive",
            });
        }
    };

    return { logout };
};