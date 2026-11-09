import "./confirmation.css";

export default function ConfirmationMark() {
  return <svg aria-hidden="true" viewBox="0 0 80 80" className="checkout-confirmation-mark h-16 w-16 shrink-0">
    <rect x="8" y="24" width="48" height="48" rx="12" fill="#fff1f6" stroke="#d90049" strokeWidth="2.5" />
    <path d="M21 29V19a11 11 0 0 1 22 0v10" fill="none" stroke="#d90049" strokeWidth="3" strokeLinecap="round" />
    <path d="M23 45h18M23 53h12" stroke="#d90049" strokeWidth="3" strokeLinecap="round" />
    <circle cx="59" cy="52" r="18" fill="#166534" stroke="white" strokeWidth="3" />
    <path className="checkout-confirmation-check" d="m50 52 6 6 12-13" pathLength="1" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
