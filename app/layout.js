import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const inter = Inter({subsets:["latin"]});

export const metadata = {
  title:"sensai - AI Career Coach",
  description: "Your intelligent companion for career growth and development",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme:dark,
    }}>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gray-900`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Header */}
          <Header/>
          
          {/* Main Content */}
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* Toast Notifications */}
          <Toaster richColors/>
          
          {/* Beautiful Footer */}
          <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/50">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            
            <div className="relative container mx-auto px-4 py-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                
                {/* Brand Section */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Sensai
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                    Your intelligent AI career coach, designed to guide you through every step of your professional journey with personalized insights and expert guidance.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-200">
                      <svg className="w-5 h-5 text-gray-400 hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-200">
                      <svg className="w-5 h-5 text-gray-400 hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-200">
                      <svg className="w-5 h-5 text-gray-400 hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.110.221.081.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                
                {/* Quick Links */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Quick Links</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Dashboard</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Career Assessment</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Learning Paths</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">AI Coaching</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Progress Tracking</a></li>
                  </ul>
                </div>
                
                {/* Support */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Support</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Help Center</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact Us</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">FAQ</a></li>
                  </ul>
                </div>
              </div>
              
              {/* Bottom Section */}
              <div className="border-t border-gray-700/50 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="text-center md:text-left">
                    <p className="text-gray-400 text-sm">
                      © 2024 Sensai. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Made with <span className="text-red-400">❤️</span> and <span className="text-purple-400">courage</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-400">All systems operational</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Version 1.0.0
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Bottom Border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"></div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}