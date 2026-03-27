import { CategoryInfo, PresetService } from '@/types/password';

export const categories: CategoryInfo[] = [
  { id: 'banks', label: 'Bancos', icon: '🏦', color: 'from-emerald-500 to-teal-600' },
  { id: 'social', label: 'Redes Sociais', icon: '📱', color: 'from-pink-500 to-rose-600' },
  { id: 'games', label: 'Jogos', icon: '🎮', color: 'from-violet-500 to-purple-600' },
  { id: 'work', label: 'Trabalho', icon: '💼', color: 'from-amber-500 to-orange-600' },
  { id: 'email', label: 'Emails', icon: '📧', color: 'from-blue-500 to-cyan-600' },
  { id: 'favorites', label: 'Favoritos', icon: '⭐', color: 'from-yellow-400 to-amber-500' },
  { id: 'other', label: 'Outros', icon: '📦', color: 'from-slate-500 to-gray-600' },
];

export const presetServices: PresetService[] = [
  // Bancos
  { name: 'Nubank', domain: 'nubank.com.br', category: 'banks' },
  { name: 'Itaú', domain: 'itau.com.br', category: 'banks' },
  { name: 'Bradesco', domain: 'bradesco.com.br', category: 'banks' },
  { name: 'Banco do Brasil', domain: 'bb.com.br', category: 'banks' },
  { name: 'Caixa', domain: 'caixa.gov.br', category: 'banks' },
  { name: 'Santander', domain: 'santander.com.br', category: 'banks' },
  { name: 'Inter', domain: 'bancointer.com.br', category: 'banks' },
  { name: 'C6 Bank', domain: 'c6bank.com.br', category: 'banks' },
  // Redes Sociais
  { name: 'Instagram', domain: 'instagram.com', category: 'social' },
  { name: 'Facebook', domain: 'facebook.com', category: 'social' },
  { name: 'TikTok', domain: 'tiktok.com', category: 'social' },
  { name: 'Twitter (X)', domain: 'x.com', category: 'social' },
  { name: 'WhatsApp', domain: 'whatsapp.com', category: 'social' },
  // Jogos
  { name: 'Steam', domain: 'steampowered.com', category: 'games' },
  { name: 'Epic Games', domain: 'epicgames.com', category: 'games' },
  { name: 'PlayStation', domain: 'playstation.com', category: 'games' },
  { name: 'Xbox', domain: 'xbox.com', category: 'games' },
  // Trabalho
  { name: 'Slack', domain: 'slack.com', category: 'work' },
  { name: 'Microsoft Teams', domain: 'microsoft.com', category: 'work' },
  { name: 'Notion', domain: 'notion.so', category: 'work' },
  { name: 'Trello', domain: 'trello.com', category: 'work' },
  // Emails
  { name: 'Gmail', domain: 'gmail.com', category: 'email' },
  { name: 'Outlook', domain: 'outlook.com', category: 'email' },
  { name: 'Yahoo Mail', domain: 'yahoo.com', category: 'email' },
];

export const LOGO_TOKEN = 'pk_DSf9P8WsTAalUMT6FM5wRQ';

export function getLogoUrl(domain: string): string {
  return `https://img.logo.dev/${domain}?token=${LOGO_TOKEN}`;
}

export function guessDomain(name: string): string {
  const clean = name.toLowerCase().replace(/\s+/g, '');
  return `${clean}.com`;
}
