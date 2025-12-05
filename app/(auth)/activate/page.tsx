"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function ActivateContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    activateAccount();
  }, [token]);

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <span className="font-stix text-3xl font-bold text-primary">MV Travel</span>
        </Link>
      </div>

      <Card>
        <CardHeader className="space-y-1 text-center">
          {status === "loading" && (
            <>
              <div className="mx-auto mb-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
              <CardTitle className="text-2xl">Activating your account</CardTitle>
              <CardDescription>Please wait while we verify your email...</CardDescription>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Account Activated!</CardTitle>
              <CardDescription>
                Your account has been successfully activated. You can now sign in and start booking your Maldives adventure.
              </CardDescription>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Activation Failed</CardTitle>
              <CardDescription>
                We couldn&apos;t activate your account. The link may have expired or already been used.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="text-center">
          {status === "success" && (
            <Button asChild className="w-full">
              <Link href="/login">Sign in to your account</Link>
            </Button>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">Create new account</Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <Link href="/about#contact" className="text-primary hover:underline">
                  Contact support
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md text-center"><Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" /></div>}>
      <ActivateContent />
    </Suspense>
  );
}
