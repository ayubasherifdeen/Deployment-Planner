
interface ConfirmationModalProps {
  title:       string;
  body:        string;
  warning:     string;
  confirmLabel: string;
  confirmClass: string; 
  onConfirm:   () => void;
  onCancel:    () => void;
  icon:        "remove" | "logout";
}

export default function ConfirmationModal({
  title,
  body,
  warning,
  confirmLabel,
  confirmClass,
  onConfirm,
  onCancel,
  icon,
}: ConfirmationModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4"
      onClick={onCancel} // clicking the backdrop cancels
    >
      {/* Modal card — stop clicks propagating to the backdrop */}
      <div
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl
          ${icon === "remove" ? "bg-red-100" : "bg-amber-100"}`}>
          {icon === "remove" ? (
            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M23 11l-4 4m0-4l4 4" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-base font-bold text-gray-900">{title}</h3>

        {/* Body */}
        <p className="mb-3 text-sm leading-relaxed text-gray-500">{body}</p>

        {/* Warning notice */}
        <div className={`mb-5 rounded-lg px-3 py-2.5 text-xs leading-relaxed
          ${icon === "remove"
            ? "bg-red-50 text-red-700"
            : "bg-amber-50 text-amber-700"
          }`}>
          {warning}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            {icon === "logout" ? "Stay signed in" : "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold text-white ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}