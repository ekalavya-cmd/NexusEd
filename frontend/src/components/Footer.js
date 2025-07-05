import React from "react";

function Footer() {
  return (
    <footer className="bg-gradient-primary text-white p-4 shadow-lg border-top">
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="container d-flex justify-content-center align-items-center animate-fade-in-up">
        <p className="m-0 fw-light">© 2025 NexusEd. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
