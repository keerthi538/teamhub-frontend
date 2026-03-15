import { FileSearch, ArrowLeft, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotFoundPageProps {
  title?: string;
  description?: string;
  onGoBack?: () => void;
  onBackToDashboard?: () => void;
}

export default function NotFoundPage({
  title = "Page not found",
  description = "The page you're looking for doesn't exist or may have been moved to a different location.",
  onGoBack = () => window.history.back(),
  onBackToDashboard = () => (window.location.href = "/"),
}: NotFoundPageProps) {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
            <img src="/teamhub-logo.png" alt="Team Logo" width={40} />
          </div>
          <span className="font-semibold text-gray-800 text-lg">Teamhub</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        {/* Icon circle */}
        <div className="relative mb-8">
          <div className="w-40 h-40 rounded-full bg-blue-100/60 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-blue-200/70 flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileSearch className="w-8 h-8 text-white" strokeWidth={1.75} />
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight max-w-sm">
          {title}
        </h1>
        <p className="text-gray-500 text-base max-w-xs leading-relaxed mb-10">
          {description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="outline"
            onClick={onGoBack}
            className="gap-2 px-6 py-2.5 rounded-xl border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            onClick={onBackToDashboard}
            className="gap-2 px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium"
          >
            <LayoutDashboard className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Error code */}
        <p className="mt-16 text-xs font-semibold tracking-widest text-gray-400 uppercase">
          Error Code: 404
        </p>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 flex items-center justify-between text-sm text-gray-400">
        <span>© {new Date().getFullYear()} Teamhub Inc.</span>
        <nav className="flex items-center gap-5">
          <a href="#" className="hover:text-gray-600 transition-colors">
            Help Center
          </a>
          <a href="#" className="hover:text-gray-600 transition-colors">
            Status Page
          </a>
          <a href="#" className="hover:text-gray-600 transition-colors">
            Contact Support
          </a>
        </nav>
      </footer>
    </div>
  );
}
