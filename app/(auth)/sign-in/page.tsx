"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import { signInSchema } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/actions/auth";
import Link from "next/link";

const Page = () => (
  <>
    <AuthForm
      type="SIGN_IN"
      schema={signInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={signInWithCredentials}
    />
    <div className="text-center mt-4">
      <Link
        href="/forgot-password"
        className="text-primary hover:text-primary/80 text-sm"
      >
        Forgot your password?
      </Link>
    </div>
  </>
);
export default Page;
