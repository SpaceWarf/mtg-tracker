import { serverSideGet } from "./Functions";

export class HTMLScraper {
  private readonly url: string;
  private doc: Document | null = null;

  constructor(url: string) {
    this.url = url;
  }

  async scrape(): Promise<void> {
    const html = await serverSideGet<string>(this.url);
    const parser = new DOMParser();
    this.doc = parser.parseFromString(html.data, "text/html");
  }

  getUrl(): string {
    return this.url;
  }

  getElementTextByClass(className: string): string {
    const el = this.getElementByClass(className);
    return el?.textContent ?? "";
  }

  getElementByClass(className: string): Element | null {
    return this.doc?.querySelector(`[class^='${className}']`) ?? null;
  }

  querySelector(selector: string): Element | null {
    return this.doc?.querySelector(selector) ?? null;
  }
}
