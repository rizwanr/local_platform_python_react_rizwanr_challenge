import { Spinner } from './ui';

export default function LoadingOverlay() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <Spinner />
        <p className="text-text-color mt-4 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}
