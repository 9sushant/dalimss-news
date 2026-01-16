import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  render() {
    const { page } = this.props.__NEXT_DATA__;
    // Identify if this is a web story page (excluding edit/new pages)
    const isStory = page.startsWith('/stories/') && !page.includes('/edit') && !page.includes('/new');

    return (
      <Html lang="en" {...(isStory ? { amp: "" } : {})}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
