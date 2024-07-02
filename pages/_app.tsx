import { UniformContext } from "@uniformdev/context-react";
import { UniformAppProps } from "@uniformdev/context-next";
import createUniformContext from "lib/uniform/uniformContext";

// IMPORTANT: importing all components registered in Canvas
import "../components/canvasComponents";

import "../styles/styles.css";
import { UniformAbTestController } from "@/components/UniformAbTestController";
import { ManifestV2 } from "@uniformdev/context/*";

function MyApp({
  Component,
  pageProps,
  serverUniformContext,
}: UniformAppProps) {
  let manifest: ManifestV2 = { project: {} };
  if (typeof window !== "undefined") {
    const json = document.getElementById("manifest")?.innerHTML;
    console.log('manifest data on client', json);
    if (json) {
      manifest = JSON.parse(json);
      console.log('manifest json isn\'t empty');
    }
  }
  console.log('manifest value outside of if', manifest);
  const clientContext = createUniformContext(manifest);
  return (
    <UniformContext
      context={serverUniformContext ?? clientContext}
      outputType={"standard"}
      // enable for edge-side rendering (will need a special context-edge npm package)
      //outputType={"edge"}
    >
      <Component {...pageProps} />
      <UniformAbTestController
        testIdParameter="uniform-test"
        variantIdParameter="uniform-variant"
      />
    </UniformContext>
  );
}

export default MyApp;
