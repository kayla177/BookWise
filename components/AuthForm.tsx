"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import FileUpload from "@/components/FileUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// FieldValues ensures that T follows the correct structure for a form.
// This makes AuthForm flexible and reusable for different forms.
interface AuthFormProps<T extends FieldValues> {
  // ZodType<T> is a generic type from the Zod library that represents a schema definition for validating data in TypeScript.
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: AuthFormProps<T>) => {
  const router = useRouter();
  const isSignIn = type === "SIGN_IN";

  // 1. Define your form.
  const form: UseFormReturn<T> = useForm({
    // the schema is a variable, depends on the component calling is sign-in or sign-up
    resolver: zodResolver(schema),

    // TypeScript sometimes doesn’t automatically recognize that defaultValues matches T.
    // So we explicitly tell TypeScript that defaultValues is of type DefaultValues<T> " I know defaultValues matches T, so trust me on this!".
    defaultValues: defaultValues as DefaultValues<T>,
  });

  // 2. Define a submit handler.
  // In your AuthForm.tsx - update handleSubmit
  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      const result = await onSubmit(data);
      console.log("Authentication result:", result);

      if (result?.success) {
        toast.success("Success", {
          description: isSignIn
            ? "You have successfully signed in."
            : "You have successfully signed up.",
        });

        router.push("/");
      } else {
        // Display the specific error message
        toast.error(`${isSignIn ? "Sign In" : "Sign Up"} Failed`, {
          description: result?.error ?? "An error occurred.",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn
          ? "Welcome Back to the BookWise"
          : "Create Your Library Account"}
      </h1>

      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full"
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {/*pulling the names from constants/index.ts*/}
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {field.name === "universityCard" ? (
                      <FileUpload
                        type="image"
                        accept="image/*"
                        placeholder="Upload your ID"
                        folder="ids"
                        variant="dark"
                        onFileChange={field.onChange}
                      />
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        {...field}
                        className="form-input"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="form-btn">
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "New to BookWise? " : "Already have an account? "}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-bold text-primary"
        >
          {isSignIn ? "Create an Account " : "Sign In "}
        </Link>
      </p>
    </div>
  );
};
export default AuthForm;
