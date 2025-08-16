export class HTMLScrapper {
  static getDocumentFromHTML(html: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }

  static getTextFromElementByClass(doc: Document, className: string): string {
    const el = HTMLScrapper.getElementByClass(doc, className);
    return el?.textContent ?? "";
  }

  static getElementByClass(doc: Document, className: string): Element | null {
    return doc.querySelector(`[class^='${className}']`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getReduxDataFromHTML(html: string): any | undefined {
    const doc = this.getDocumentFromHTML(html);
    const nextData = doc.querySelector("script#__NEXT_DATA__")?.childNodes[0]
      ?.textContent;

    if (nextData) {
      const nextDataJson = JSON.parse(nextData);
      return nextDataJson.props.pageProps.redux;
    }
  }
}
