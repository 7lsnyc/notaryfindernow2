import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-1" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2">
            <p className="text-sm text-red-700">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 