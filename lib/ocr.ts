/**
 * OCR pour scanner la liste d'ingrédients au dos d'un paquet
 */

export interface OCRIngredient {
  name: string;
  quantity?: string;
}

/**
 * Extrait le texte d'une image
 */
export async function extractTextFromImage(imageBase64: string): Promise<string> {
  // TODO: Intégrer Tesseract.js pour OCR réel
  // Pour l'instant, simulation
  return `
    INGRÉDIENTS: Farine de blé, sucre, huile de palme, cacao maigre en poudre 7%, 
    poudre à lever (carbonate acide de sodium, carbonate acide d'ammonium), 
    sel, arômes.
  `;
}

/**
 * Parse la liste d'ingrédients depuis le texte OCR
 */
export function parseIngredientsList(text: string): OCRIngredient[] {
  let cleanText = text
    .replace(/INGRÉDIENTS?\s*:/gi, '')
    .replace(/INGREDIENTS?\s*:/gi, '')
    .replace(/Ingrédients?\s*:/gi, '');

  const parts = cleanText.split(',').map((s) => s.trim());
  const ingredients: OCRIngredient[] = [];

  for (const part of parts) {
    if (!part) continue;

    const match = part.match(/^(.+?)\s+(\d+%?)$/);

    if (match) {
      ingredients.push({
        name: match[1].trim(),
        quantity: match[2],
      });
    } else {
      ingredients.push({
        name: part,
      });
    }
  }

  return ingredients;
}
