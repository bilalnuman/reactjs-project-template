import { RCSC_Country } from "@/types";
import z from "zod";


export const schema = z
  .object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .min(2, "Please enter at least 2 characters"),
    email: z.string({ required_error: "Email is required" }).email("Enter a valid email"),
    password: z.string({ required_error: "Password is required" }).min(8, "Must be at least 8 characters"),
    role: z.string({ required_error: "Please select a role" }).min(1),
    skills: z.array(z.string()).min(1, "Select at least one skill"),

    gender: z
      .enum(["male", "female", "other", "prefer_not"]).or(z.literal(""))
      .refine((v) => v !== "", { message: "Please select a gender" }),
    bio: z.string().max(300, "Max 300 characters").optional().or(z.literal("")),
    terms: z.boolean().refine((val) => val === true, { message: "You must accept the terms" }),

    // date/time & others
    dateSingle: z.string({ required_error: "Pick a date" }).min(1, "Pick a date"),
    timeOfDay: z.string({ required_error: "Pick a time" }).min(1, "Pick a time"),
    datesMultiple: z
      .array(z.string())
      .min(1, "Add at least one date")
      .refine((arr) => new Set(arr).size === arr.length, "Duplicate dates are not allowed"),
    infiniteSelect: z.string({ required_error: "Please choose an option" }).min(1, "Please choose an option"),

    // Mixed dropdown (selectable or link). Optional in validation but tracked in form.
    mixedChoice: z.string().optional(),

    // Phone (international with flag)
    phone: z
      .string({ required_error: "Enter phone number" })
      .refine((v) => {
        const cleaned = v.replace(/[^0-9+]/g, "");
        const hasPlus = cleaned.startsWith("+");
        const digits = cleaned.replace(/[^0-9]/g, "");
        return hasPlus && digits.length >= 7 && digits.length <= 15; // E.164-like
      }, "Enter a valid international number"),

    // Country / State / City (conditionally required)
    country: z
      .object({ id: z.number(), name: z.string(), hasStates: z.boolean().optional() })
      .nullable()
      .refine((v) => !!v, { message: "Select a country" }),
    state: z
      .object({ id: z.number(), name: z.string() })
      .nullable()
      .optional(),
    city: z
      .object({ id: z.number(), name: z.string() })
      .nullable()
      .optional(),
  })
  .superRefine((val, ctx) => {
    const c = val.country as (RCSC_Country | null) | undefined;
    if (c?.hasStates) {
      if (!val.state) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["state"], message: "Select a state" });
      if (!val.city) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["city"], message: "Select a city" });
    }
  });

const terms= z.boolean().refine((val) => val === true, { message: "You must accept the terms" })

const email = z.string({ required_error: "Email is required" }).email("Enter a valid email")

const password = z
  .string({ required_error: "Password is required" })
  .min(8, "Must be at least 8 characters");

const confirmPassword = z
  .string({ required_error: "Confirm Password is required" });

const oldPassword = z
  .string({ required_error: "Old Password is required" })
  .nonempty("Old Password is required")

export const UpdatePasswordSchema = z
  .object({
    oldPassword,
    password,
    confirmPassword,
  })
  .superRefine(({ password, confirmPassword, oldPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
    if (oldPassword && password && oldPassword === password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "New password must be different from old password",
      });
    }
  });

export type UpdatePasswordFormValue = z.infer<typeof UpdatePasswordSchema>;


export const SignUpSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .min(2, "Please enter at least 2 characters"),
  email: email,
  password: password,
  role: z.string({ required_error: "Please select a role" }).min(1),
  terms: z.boolean().refine((val) => val === true, { message: "You must accept the terms" }),
})

export type SignUpFormValue = z.infer<typeof SignUpSchema>

export const LoginInSchema = z.object({
  email: email,
  password: password,
  terms:terms
})

export type LoginInFormValue = z.infer<typeof LoginInSchema>


export const ForgotPasswordSchema = z.object({
  email: email
})

export type ForgotFormValue = z.infer<typeof ForgotPasswordSchema>

export const ResetPasswordSchema = z
  .object({
    password: password,
    confirmPassword:confirmPassword,
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type ResetFormValue = z.infer<typeof ResetPasswordSchema>;

