import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/axios";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);

  const navigate = useNavigate();

  const clearError = () => {
    setError("");
    setErrorDetails([]);
  };

  const handleSignup = () => {
    apiClient
      .post("/auth/signup", { name, email, password })
      .then((response) => {
        navigate("/");
      })
      .catch((err) => {
        const errorResponse = err.response?.data;

        setError(errorResponse?.error ?? "Sign up failed");
        setErrorDetails(errorResponse?.details ?? []);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSignup();
  };

  useEffect(() => {
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#c3cef6] to-white px-4">
      {/* Background accent */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#e9efff] blur-3xl opacity-70" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#e9efff] blur-3xl opacity-60" />

      {/* Card */}
      <div className="relative w-full max-w-md rounded-xl border border-[#e6ebf5] bg-white p-8 shadow-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-[#0b1220]">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-[#5b6b8a]">
            Sign up to get started with TeamHub
          </p>
        </div>

        {/* Google sign up */}
        <button
          onClick={() => {
            window.location.href =
              import.meta.env.VITE_API_BASE_URL + "/auth/login";
          }}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#e6ebf5] bg-white py-2.5 text-sm font-medium text-[#0b1220] transition hover:bg-[#f6f8ff]"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e6ebf5]" />
          <span className="text-xs text-[#5b6b8a]">OR</span>
          <div className="h-px flex-1 bg-[#e6ebf5]" />
        </div>

        {/* Name / Email / Password */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#0b1220]">
              Full name
            </label>
            <input
              type="text"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError();
              }}
              className="w-full rounded-lg border border-[#e6ebf5] px-3 py-2 text-sm text-[#0b1220] placeholder:text-[#8a97b3] focus:border-[#4f7cff] focus:outline-none focus:ring-2 focus:ring-[#4f7cff]/30"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#0b1220]">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
              }}
              className="w-full rounded-lg border border-[#e6ebf5] px-3 py-2 text-sm text-[#0b1220] placeholder:text-[#8a97b3] focus:border-[#4f7cff] focus:outline-none focus:ring-2 focus:ring-[#4f7cff]/30"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#0b1220]">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              className="w-full rounded-lg border border-[#e6ebf5] px-3 py-2 text-sm text-[#0b1220] placeholder:text-[#8a97b3] focus:border-[#4f7cff] focus:outline-none focus:ring-2 focus:ring-[#4f7cff]/30"
            />
          </div>

          <Button
            disabled={name === "" || email === "" || password === ""}
            type="submit"
            className="w-full"
            style={{
              backgroundColor: "#155DFC",
              cursor: "pointer",
            }}
          >
            Create account
          </Button>

          {error.length > 0 && (
            <Alert variant="destructive" className="max-w-md">
              <AlertCircleIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                {errorDetails.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {errorDetails.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-[#5b6b8a]">
            Already have an account?{" "}
            <Button
              variant="link"
              style={{ color: "#155DFC", cursor: "pointer" }}
              onClick={() => navigate("/signin")}
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
