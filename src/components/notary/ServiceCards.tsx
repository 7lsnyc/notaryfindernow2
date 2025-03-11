import React from 'react';
import {
  DocumentTextIcon,
  HomeIcon,
  BriefcaseIcon,
  TruckIcon,
  VideoCameraIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const serviceIcons = {
  'Loan Signing': DocumentTextIcon,
  'Real Estate': HomeIcon,
  'Business': BriefcaseIcon,
  'Mobile': TruckIcon,
  'Remote': VideoCameraIcon,
  '24/7': ClockIcon,
} as const;

interface ServiceCardsProps {
  services: string[];
  className?: string;
}

export function ServiceCards({ services, className = '' }: ServiceCardsProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {services.map((service) => {
        const Icon = serviceIcons[service as keyof typeof serviceIcons] || DocumentTextIcon;
        
        return (
          <div
            key={service}
            className="flex items-start space-x-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="rounded-lg bg-blue-50 p-2">
              <Icon className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{service}</h4>
              <p className="mt-1 text-sm text-gray-500">
                {getServiceDescription(service)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getServiceDescription(service: string): string {
  const descriptions: Record<string, string> = {
    'Loan Signing': 'Professional loan document signing services for real estate transactions',
    'Real Estate': 'Notarization services for real estate documents and deeds',
    'Business': 'Corporate document notarization and business services',
    'Mobile': 'Convenient mobile notary services at your location',
    'Remote': 'Online remote notarization via video conference',
    '24/7': 'Available 24 hours a day, 7 days a week',
  };

  return descriptions[service] || 'Professional notary services';
} 