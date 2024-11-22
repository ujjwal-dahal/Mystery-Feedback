import { z } from "zod";

export const usernameValidation = z.string()
    .min(5, "Username must contain at least 5 characters")
    .max(10, "Username must not exceed 10 characters")
    .regex(/^[a-zA-Z0-9_]{5,10}$/, "Username can only contain letters, numbers, and underscores");

export const emailValidation = z.string().email({ 
    message: "Invalid email address" 
});


export const passwordValidation = z.string()
    .min(5, "Password must contain at least 5 characters")
    .max(20, "Password must not exceed 20 characters")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{5,20}$/,
        "Password must include one uppercase, one lowercase, one digit, and one special character"
    );

export const signUpValidation = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation,
});
