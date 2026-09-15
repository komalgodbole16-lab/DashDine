import { useState } from "react";

export function calculateAdvanceAmount(
  specialOccasion: string,
  specialRequests: string
): number {
  const hasOccasion = specialOccasion && specialOccasion !== "None";
  const hasRequest = specialRequests.trim().length > 0;
  return hasOccasion || hasRequest ? 500 : 300;
}

interface AdvancePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  restaurantName: string;
  upiId: string;
  onPaymentConfirmed: () => void;
}

export function AdvancePaymentModal({
  isOpen,
  onClose,
  amount,
  restaurantName,
  upiId,
  onPaymentConfirmed,
}: AdvancePaymentModalProps) {
  const [confirming, setConfirming] = useState(false);

  if (!isOpen) return null;

  const upiLink = `upi://pay?pa=${upiId}&pn=DashDine&am=${amount}&cu=INR&tn=${encodeURIComponent(
    `Advance for ${restaurantName}`
  )}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiLink
  )}`;

  const handleConfirm = async () => {
    setConfirming(true);
    await onPaymentConfirmed();
    setConfirming(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-md border border-outline-variant/20 bg-white p-8">
        <h2 className="font-display text-lg font-semibold text-primary">Advance Payment</h2>
        <p className="mt-1 text-sm text-black/55">
          Reserve your table at {restaurantName}
        </p>

        <div className="mt-6 flex flex-col items-center border-y border-outline-variant/20 py-6">
          <img src={qrSrc} alt="Scan to pay" width={200} height={200} />
          <p className="mt-4 text-3xl font-semibold text-primary">₹{amount}</p>
          <p className="mt-1 text-xs text-black/55">Scan with any UPI app to pay</p>
        </div>

        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="mt-6 w-full bg-primary hover:bg-secondary text-white py-3 text-xs font-medium tracking-widest uppercase transition-colors disabled:opacity-50"
        >
          {confirming ? "Confirming…" : "I've Paid — Confirm Booking"}
        </button>
        <button
          onClick={onClose}
          className="mt-3 w-full py-2 text-xs text-black/55 hover:text-primary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}