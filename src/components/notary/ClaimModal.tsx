import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface ClaimModalProps {
  notaryName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClaimFormData) => Promise<void>;
}

interface ClaimFormData {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  message: string;
}

export function ClaimModal({
  notaryName,
  isOpen,
  onClose,
  onSubmit,
}: ClaimModalProps) {
  const [formData, setFormData] = useState<ClaimFormData>({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit claim');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Claim Your Listing
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <p className="mb-4 text-sm text-gray-600">
            You are claiming the listing for <strong>{notaryName}</strong>. Please
            provide the following information to verify your ownership.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <Input
              type="text"
              name="licenseNumber"
              placeholder="Notary License Number"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Additional Information
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                placeholder="Please provide any additional information to help verify your claim"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Submit Claim
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 