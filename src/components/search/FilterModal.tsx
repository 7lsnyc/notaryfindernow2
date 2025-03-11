import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSearch } from '@/contexts/SearchContext';
import type { SearchFilters } from '@/types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const { state, setFilters, performSearch } = useSearch();
  const [localFilters, setLocalFilters] = React.useState<SearchFilters>(state.filters);

  // Reset local filters when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalFilters(state.filters);
    }
  }, [isOpen, state.filters]);

  const handleServiceToggle = (service: string) => {
    setLocalFilters(prev => ({
      ...prev,
      services: prev.services?.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...(prev.services || []), service]
    }));
  };

  const handleRadiusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalFilters(prev => ({
      ...prev,
      radius: parseInt(event.target.value)
    }));
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalFilters(prev => ({
      ...prev,
      rating: parseInt(event.target.value)
    }));
  };

  const handleToggleChange = (key: keyof SearchFilters) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleClearFilters = () => {
    console.log('Clearing filters...');
    console.log('Current filters:', state.filters);
    
    const defaultFilters: SearchFilters = {
      services: [],
      rating: 0,
      available_now: false,
      online_booking: false,
      radius: 25,
    };
    
    console.log('Setting filters to:', defaultFilters);
    
    // Update both local and global filters
    setLocalFilters(defaultFilters);
    setFilters(defaultFilters);
    
    // Perform the search immediately
    performSearch()
      .then(() => {
        console.log('Clear filters search complete');
        onClose();
      })
      .catch((error) => {
        console.error('Error performing search after clear:', error);
      });
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', localFilters);
    
    // Update filters and perform search
    setFilters(localFilters);
    
    // Perform the search immediately
    performSearch()
      .then(() => {
        console.log('Apply filters search complete');
        onClose();
      })
      .catch((error) => {
        console.error('Error performing search after applying filters:', error);
      });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-xl w-full bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-xl font-semibold">
              Filter Notaries
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Search Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Radius
              </label>
              <select
                value={localFilters.radius}
                onChange={handleRadiusChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value={10}>10 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
                <option value={100}>100 miles</option>
              </select>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <select
                value={localFilters.rating}
                onChange={handleRatingChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value={0}>Any rating</option>
                <option value={3}>3+ stars</option>
                <option value={4}>4+ stars</option>
                <option value={5}>5 stars only</option>
              </select>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  '24-hour',
                  'mobile',
                  'remote',
                  'loan-signing',
                  'real-estate',
                  'apostille',
                  'wedding',
                  'business',
                  'immigration',
                  'medical'
                ].map((service) => (
                  <label
                    key={service}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={localFilters.services?.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="capitalize">{service.replace(/-/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Filters
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={localFilters.available_now}
                    onChange={() => handleToggleChange('available_now')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Available Now</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={localFilters.online_booking}
                    onChange={() => handleToggleChange('online_booking')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Online Booking Available</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 