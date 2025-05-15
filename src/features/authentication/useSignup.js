import { useMutation } from "@tanstack/react-query";
import { signup as signupApi} from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup (){  
    const {mutate: signup, isLoading} = useMutation({
        mutationFn: signupApi,
        onSuccess: () => {
            toast.success("Account successfully created! Please verify the new account from the user's email address");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create account. Please try again.");
        }
    });
    return {signup, isLoading}
}