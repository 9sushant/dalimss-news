import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    const nextData = this.props.__NEXT_DATA__;
    const page = nextData.page;
    const pageProps = nextData.props?.pageProps as { htmlLang?: unknown } | undefined;
    // Identify if this is a web story page (excluding edit/new pages)
    const isStory =
      page.startsWith("/stories/") &&
      !page.includes("/edit") &&
      !page.includes("/new");
    const lang = pageProps?.htmlLang === "hi" ? "hi" : "en";

    return (
      <Html lang={lang} {...(isStory ? { amp: "" } : {})}>
        <Head />
        <body>
          <Main />
          {!isStory && <NextScript />}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
