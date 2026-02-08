"use client";

import { useState } from "react";
import { z } from "zod";

const BACKEND_URL = process.env.NEXT_PUBLIC_AGENT_BACKEND_URL || 'http://localhost:8000';

export const signupFormSchema = z.object({
  message: z.string().optional(),
}).nullable();

type SignupFormProps = z.infer<typeof signupFormSchema>;

export function SignupForm(props: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      // Store token in localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("user_id", data.user._id);

      // Trigger auth-change event for header update
      window.dispatchEvent(new Event('auth-change'));

      // Show success message
      alert(`✅ ${data.message}\n\nYou can now add items to cart and checkout!`);
      
      // Clear form
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg border border-border">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Create Your Account</h2>
      
      {props?.message && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md text-sm">
          {props.message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="johndoe"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button 
          onClick={() => alert("Type 'login' in chat")}
          className="text-primary hover:underline font-medium"
        >
          Login
        </button>
      </div>
    </div>
  );
}
