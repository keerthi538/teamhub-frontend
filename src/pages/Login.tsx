export default function Login() {
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
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-[#5b6b8a]">
            Sign in to continue to TeamHub
          </p>
        </div>

        {/* Google login */}
        <button
          onClick={() => {
            window.location.href = "http://localhost:3000/auth/login";
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

        {/* Email / password (placeholder) */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#0b1220]">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
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
              className="w-full rounded-lg border border-[#e6ebf5] px-3 py-2 text-sm text-[#0b1220] placeholder:text-[#8a97b3] focus:border-[#4f7cff] focus:outline-none focus:ring-2 focus:ring-[#4f7cff]/30"
            />
          </div>

          <button
            disabled
            className="w-full rounded-lg bg-[#4f7cff] py-2.5 text-sm font-semibold text-white opacity-60 cursor-not-allowed"
          >
            Sign in (coming soon)
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-[#5b6b8a]">
          Don’t have an account?{" "}
          <span className="cursor-pointer font-medium text-[#4f7cff] hover:underline">
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
}
