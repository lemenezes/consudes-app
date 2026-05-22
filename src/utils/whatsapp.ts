import type { Listing } from '../types';

/**
 * Builds a wa.me URL with a pre-filled message.
 * For "venda" listings, includes the title, a direct link, and an availability question.
 * For other categories, sends a simple contact message.
 */
export function buildWhatsAppUrl(listing: Listing): string {
  const phone = `55${listing.whatsapp.replace(/\D/g, '')}`;
  const base = `https://wa.me/${phone}`;

  if (listing.category === 'venda' || listing.category === 'imoveis') {
    const message = [
      'Olá! Tenho interesse no anúncio:',
      '',
      `"${listing.title}"`,
      '',
      // Link removido: função buildListingUrl não existe mais
      '',
      'Ainda está disponível?',
    ].join('\n');

    return `${base}?text=${encodeURIComponent(message)}`;
  }

  // Other categories: simple message
  const message = `Olá! Vi seu anúncio "${listing.title}" no CONSUDES e gostaria de mais informações.`;
  return `${base}?text=${encodeURIComponent(message)}`;
}
