import React, { useCallback } from 'react';

interface Props {
  campaign: string;
  campaignLabel: string;
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  labelKey?: string;
  /** Custom CTA text — overrides default "Donasi Sekarang" */
  label?: string;
}
export default function CampaignDonateButton({ campaign, campaignLabel, variant = 'primary', size = 'md', className = '', labelKey = 'nav.donate', label }: Props) {
  const text = label || 'Donasi Sekarang';
  const handleClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent('campaign:donate', { detail: { campaign, campaignLabel } }));
  }, [campaign, campaignLabel]);

  const baseClasses = 'inline-flex items-center justify-center font-heading font-semibold rounded-lg transition-all duration-200 active:scale-95';
  const variantClasses = variant === 'primary'
    ? 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-soft'
    : 'border-2 border-white text-white hover:bg-white/10';
  const sizeClasses = size === 'sm' ? 'px-4 py-2 text-sm' : size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base';

  return (
    <button onClick={handleClick} className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} data-i18n={labelKey}>
      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {text}
    </button>
  );
}
