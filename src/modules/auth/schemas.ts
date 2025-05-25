import z from "zod"

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[a-z]/, 'Password must include at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
        .regex(/[0-9]/, 'Password must include at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character'),
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(63, "Username must be at most 3 characters")
        .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Only lowercase letters, numbers, and hyphens allowed. Username must start and end with a letter or number.")
        .refine(
            (val) => !val.includes("--"),
            "Username cannot have consecutive hyphens"
        )
        .transform((val) => val.toLowerCase())
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string() // validation here may cause error to old users if you change the password schema from above
})