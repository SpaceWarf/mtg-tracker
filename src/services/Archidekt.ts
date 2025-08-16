import { ArchidektClasses } from "../state/ArchidektClasses";
import {
  ArchidektReduxCard,
  ArchidektReduxCardMap,
  ArchidektReduxCategory,
  ArchidektReduxCategoryMap,
  ArchidektReduxDeck,
} from "../state/ArchidektRedux";
import { CacheKey } from "../state/CacheKey";
import { DeckDetails } from "../state/DeckDetails";
import { getCacheKey, getItemFromCache, setCacheKey } from "../utils/Cache";
import { serverSideGet } from "./Functions";
import { HTMLScrapper } from "./HTMLScrapper";

const BASE_URL = "https://archidekt.com";

async function getDeckHTMLById(id: string) {
  const res = await serverSideGet<string>(`${BASE_URL}/decks/${id}`);
  return Promise.resolve(res.data);
}

function getDeckDetailsFromHTML(html: string, id: string): DeckDetails {
  const doc = HTMLScrapper.getDocumentFromHTML(html);
  const reduxData = HTMLScrapper.getReduxDataFromHTML(html);
  const deckData = reduxData?.deck as ArchidektReduxDeck;
  console.log(reduxData);

  if (!reduxData || !deckData) {
    return {
      id: id,
      url: `${BASE_URL}/decks/${id}`,
      title: HTMLScrapper.getTextFromElementByClass(
        doc,
        ArchidektClasses.TITLE
      ),
      price: HTMLScrapper.getTextFromElementByClass(
        doc,
        ArchidektClasses.PRICE
      ),
      saltSum: HTMLScrapper.getTextFromElementByClass(
        doc,
        ArchidektClasses.SALT_SUM
      ),
      size: getDeckSize(doc),
      viewCount: HTMLScrapper.getTextFromElementByClass(
        doc,
        ArchidektClasses.VIEW_COUNT
      ),
      format: HTMLScrapper.getTextFromElementByClass(
        doc,
        ArchidektClasses.FORMAT
      ),
      featured: "",
      createdAt: "",
      updatedAt: "",
      commanders: [],
    };
  }

  return {
    id: id,
    url: `${BASE_URL}/decks/${id}`,
    title: deckData.name,
    price: HTMLScrapper.getTextFromElementByClass(doc, ArchidektClasses.PRICE),
    saltSum: HTMLScrapper.getTextFromElementByClass(
      doc,
      ArchidektClasses.SALT_SUM
    ),
    size: getDeckSize(doc),
    viewCount: `${deckData.viewCount}`,
    format: HTMLScrapper.getTextFromElementByClass(
      doc,
      ArchidektClasses.FORMAT
    ),
    featured: deckData.featured,
    createdAt: deckData.createdAt,
    updatedAt: deckData.updatedAt,
    commanders: getCommanders(deckData),
  };
}

function getDeckSize(doc: Document): string {
  const sizeEl = doc.querySelector("[class^='deckHeader_row_'] > div");
  const sizeTextContent = sizeEl?.textContent ?? "";
  return sizeTextContent.split(" ")[2];
}

function getCommanders(deckData: ArchidektReduxDeck): string[] {
  const categories = deckData.categories;
  const cardMap = deckData.cardMap;
  const premierCategories = getPremierCategories(categories);
  const premierCards = getPremierCards(cardMap, premierCategories);
  return premierCards.map((card) => card.name);
}

function getPremierCategories(
  categories: ArchidektReduxCategoryMap
): ArchidektReduxCategory[] {
  return Object.values(categories).filter((category) => category.isPremier);
}

function getPremierCards(
  cards: ArchidektReduxCardMap,
  premierCategories: ArchidektReduxCategory[]
): ArchidektReduxCard[] {
  return Object.values(cards).filter((card) =>
    premierCategories.some((category) =>
      card.categories.includes(category.name)
    )
  );
}

export class ArchidektService {
  static async getDeckDetailsById(id: string) {
    const cache = getCacheKey(CacheKey.DECKS_DETAILS);
    const cachedDeckDetails = getItemFromCache<DeckDetails>(cache, id);

    if (cachedDeckDetails) {
      return Promise.resolve(cachedDeckDetails);
    }

    const deckHTML = await getDeckHTMLById(id);
    const deckDetails = getDeckDetailsFromHTML(deckHTML, id);
    cache.set(deckDetails.id, {
      value: deckDetails,
      expiry: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    });
    setCacheKey(CacheKey.DECKS_DETAILS, cache);
    return Promise.resolve(deckDetails);
  }
}
