import { Loader2 as Loader } from 'lucide-react';

const LoaderPage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center py-[15%]">
      <Loader className="h-32 w-32 animate-spin" />
    </div>
  );
};

export default LoaderPage;
