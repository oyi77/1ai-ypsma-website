import React, { useCallback } from 'react';
import { getWaUrl, trackWaClick } from '../../lib/tracking';

interface Props {
  /** Slug campaign untuk greeting khusus */
  campaign?: string;
  /** Label campaign */
  campaignLabel?: string;
  /** Variasi tampilan */
  variant?: 'card' | 'minimal' | 'floating';
  /** Class tambahan */
  className?: string;
}

export default function WhatsappDonasi({ campaign, campaignLabel, variant = 'card', className = '' }: Props) {
  const { url, greeting } = getWaUrl(campaign);

  const handleClick = useCallback(() => {
    trackWaClick(campaign, 'click');
  }, [campaign]);

  if (variant === 'floating') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener"
        onClick={handleClick}
        className={`fixed bottom-6 left-6 z-40 flex items-center gap-3 px-5 py-3
          bg-green-500 hover:bg-green-600 text-white font-medium rounded-full shadow-strong
          transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
        aria-label="Chat via WhatsApp"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.585l-3.596 1.12 1.169-3.44a9.94 9.94 0 01-1.59-5.28c0-5.496 4.476-9.972 9.972-9.972 2.66 0 5.16 1.037 7.04 2.918a9.91 9.91 0 012.918 7.04c0 5.496-4.476 9.972-9.972 9.972z"/>
        </svg>
        <span>Chat Donasi</span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping-soft" />
      </a>
    );
  }

  if (variant === 'minimal') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener"
        onClick={handleClick}
        className={`inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors ${className}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.585l-3.596 1.12 1.169-3.44a9.94 9.94 0 01-1.59-5.28c0-5.496 4.476-9.972 9.972-9.972 2.66 0 5.16 1.037 7.04 2.918a9.91 9.91 0 012.918 7.04c0 5.496-4.476 9.972-9.972 9.972z"/>
        </svg>
        {greeting.label}
      </a>
    );
  }

  // card variant (default)
  return (
    <div className={`rounded-xl border border-green-200 bg-green-50 p-5 ${className}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.585l-3.596 1.12 1.169-3.44a9.94 9.94 0 01-1.59-5.28c0-5.496 4.476-9.972 9.972-9.972 2.66 0 5.16 1.037 7.04 2.918a9.91 9.91 0 012.918 7.04c0 5.496-4.476 9.972-9.972 9.972z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-heading font-bold text-green-800 mb-0.5">
            {campaignLabel ? `Donasi ${campaignLabel}` : 'Donasi via WhatsApp'}
          </h4>
          <p className="text-xs text-green-700 leading-relaxed">
            {greeting.message.length > 80
              ? greeting.message.slice(0, 80) + '…'
              : greeting.message
            }
          </p>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener"
        onClick={handleClick}
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-all active:scale-[0.98]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.585l-3.596 1.12 1.169-3.44a9.94 9.94 0 01-1.59-5.28c0-5.496 4.476-9.972 9.972-9.972 2.66 0 5.16 1.037 7.04 2.918a9.91 9.91 0 012.918 7.04c0 5.496-4.476 9.972-9.972 9.972z"/>
        </svg>
        {greeting.label}
      </a>
    </div>
  );
}
