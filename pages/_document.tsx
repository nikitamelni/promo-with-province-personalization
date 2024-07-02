import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { enableNextSsr } from "@uniformdev/context-next";
import createUniformContext from "../lib/uniform/uniformContext";
import { ManifestClient } from "@uniformdev/context/api";
import { ManifestV2 } from "@uniformdev/context/*";

type CustomDocumentProps = DocumentInitialProps & { manifest: ManifestV2 };

async function getManifest() {
  const manifestClient = new ManifestClient({
    apiKey: process.env.UNIFORM_API_KEY,
    projectId: process.env.UNIFORM_PROJECT_ID,
  });
  return manifestClient.get();
}

class MyDocument extends Document<CustomDocumentProps> {
  // required to enable SSR personalization
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<CustomDocumentProps> {
    const manifest: ManifestV2 = await getManifest();
    const serverTracker = createUniformContext(manifest, ctx);
    enableNextSsr(ctx, serverTracker);
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, manifest };
  }

  render(): React.ReactElement {
    const { manifest } = this.props;
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <script
            id="manifest"
            type="application/json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(manifest) }}
          />
        </Head>
        <body>
          <main className="main">
            <Main />
          </main>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
