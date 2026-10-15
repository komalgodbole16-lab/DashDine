import { useState } from "react";
import qrImage from "../../assets/qr.png";

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
  onPaymentConfirmed,
}: AdvancePaymentModalProps) {
  const [confirming, setConfirming] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  if (!isOpen) return null;

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
          <img src={qrImage} alt="Scan to pay" width={200} height={200} />
          <p className="mt-4 text-3xl font-semibold text-primary">₹{amount}</p>
          <p className="mt-1 text-xs text-black/55">Scan with any UPI app to pay</p>
        </div>

        <div className="flex items-start gap-3 mt-6">
          <input
            type="checkbox"
            id="paymentDone"
            checked={hasPaid}
            onChange={(e) => setHasPaid(e.target.checked)}
            className="mt-1 cursor-pointer"
          />
          <label htmlFor="paymentDone" className="text-xs text-black/70 leading-relaxed cursor-pointer select-none">
            I have completed the payment of ₹{amount}
          </label>
        </div>

        <button
          onClick={handleConfirm}
          disabled={confirming || !hasPaid}
          className="mt-6 w-full bg-primary hover:bg-secondary text-white py-3 text-xs font-medium tracking-widest uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {confirming ? "Confirming…" : "Confirm Booking"}
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