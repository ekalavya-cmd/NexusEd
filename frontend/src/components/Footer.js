import React from "react";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white dark:text-gray-200 p-6 shadow-lg border-t border-blue-200 dark:border-gray-600">
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
          }
        `}
      </style>
      <div className="container mx-auto flex justify-center items-center animate-fade-in-up">
        <p className="bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-amber-200 dark:to-amber-100">
          © 2025 NexusEd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
