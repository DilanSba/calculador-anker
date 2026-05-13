/**
 * Promo Mes de las Madres 2026 — Anker
 *
 * Según comunicado oficial (José Alicea, 04/30/2026):
 *   - Anker Solix F2600: $3,490 (20% off)  → ya reflejado en precio cash
 *   - Anker Solix BP 2600: $1,990          → ya reflejado en precio cash
 *   - Regalo: cada venta durante la campaña incluye una batería Anker C300 GRATIS
 *
 *   Anuncia desde: 1 de mayo de 2026
 *   Vender solo del: 7 al 14 de mayo de 2026
 *   Solo en showroom (Roosevelt, Mayagüez, Ponce, Hatillo)
 */

export const MADRES_GIFT_NAME_ES = 'Batería Anker C300';
export const MADRES_GIFT_NAME_EN = 'Anker C300 Battery';

const ANNOUNCE_START = new Date('2026-05-01T00:00:00');
const SALE_START     = new Date('2026-05-07T00:00:00');
const SALE_END       = new Date('2026-05-14T23:59:59');

/** ¿Hay que mostrar el banner promo en el modal? (1 al 14 de mayo) */
export function isMadresAnnounceActive(now: Date = new Date()): boolean {
  return now >= ANNOUNCE_START && now <= SALE_END;
}

/** ¿Se puede APLICAR el descuento? (7 al 14 de mayo) */
export function isMadresSaleActive(now: Date = new Date()): boolean {
  return now >= SALE_START && now <= SALE_END;
}
