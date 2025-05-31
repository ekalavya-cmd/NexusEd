export const profileStyles = `
  @keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes glow {
    0% { box-shadow: 0 0 5px rgba(209, 213, 219, 0.3); }
    50% { box-shadow: 0 0 15px rgba(209, 213, 219, 0.5); }
    100% { box-shadow: 0 0 5px rgba(209, 213, 219, 0.3); }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
  }
  .dark-glow {
    animation: glow 2s infinite ease-in-out;
  }
  .hover-underline::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background: linear-gradient(to right, #2563eb, #4f46e5);
    transition: width 0.3s ease-in-out;
  }
  .dark .hover-underline::after {
    background: linear-gradient(to right, #9ca3af, #d1d5db);
  }
  .hover-underline:hover::after {
    width: 100%;
  }
`;
