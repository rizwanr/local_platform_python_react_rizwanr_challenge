type BannerProps = {
  message: string | React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'info' | 'warning' | 'error' | 'success';
};

const variantStyles = {
  info: 'bg-blue-100 text-blue-800 border-blue-300',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  error: 'bg-red-100 text-red-800 border-red-300',
  success: 'bg-green-100 text-green-800 border-green-300',
};

export const Banner = ({
  message,
  actionLabel,
  onAction,
  variant = 'info',
}: BannerProps) => {
  return (
    <div
      className={`mb-4 flex w-full items-center justify-between rounded-md border p-4 text-xl ${variantStyles[variant]}`}
    >
      <span>{message}</span>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="ml-4 font-medium underline hover:opacity-80"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
