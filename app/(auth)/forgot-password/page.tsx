"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/lib/actions/auth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await requestPasswordReset(data.email);

      if (result.success) {
        setIsSubmitted(true);
        toast.success("Password reset email sent", {
          description: "Please check your email for further instructions.",
        });
      } else {
        toast.error("Error sending reset email", {
          description:
            result.error || "An unexpected error occurred. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-white">Check Your Email</h1>
        <p className="text-light-100">
          We've sent a password reset link to your email address. Please check
          your inbox and follow the instructions to reset your password.
        </p>
        <p className="text-light-100 mt-2">
          If you don't receive an email within a few minutes, please check your
          spam folder or try again.
        </p>
        <div className="mt-4">
          <Button asChild className="w-full">
            <Link href="/sign-in">Return to Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">Reset Your Password</h1>
      <p className="text-light-100">
        Enter your email address below, and we'll send you a link to reset your
        password.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    required
                    type="email"
                    placeholder="Enter your email address"
                    {...field}
                    className="form-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="form-btn w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        Remember your password?{" "}
        <Link href="/sign-in" className="font-bold text-primary">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
