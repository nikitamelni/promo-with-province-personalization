import {
  Context,
  ManifestV2,
  ContextPlugin,
  enableDebugConsoleLogDrain,
  enableContextDevTools,
} from "@uniformdev/context";
import { NextCookieTransitionDataStore } from "@uniformdev/context-next";
import { NextPageContext } from "next";
// import manifest from "./contextManifest.json";
// import { getUpdatedManifest } from "@/pages/api/webhooks/update-manifest";
 

export default function createUniformContext(
  manifest: ManifestV2,
  serverContext?: NextPageContext
): Context {
  console.log("createUniformContext executed");
  console.log(manifest);
  // 30 minutes
  const sessionExpirationInSeconds = 1800;
  const secondsInDay = 60 * 60 * 24;
  const expires = sessionExpirationInSeconds / secondsInDay;
  const plugins: ContextPlugin[] = [
    enableContextDevTools(),
    enableDebugConsoleLogDrain("debug"),
  ];

  // const updatedManifest = getUpdatedManifest();
  // console.log('updatedManifest', updatedManifest);
  // const manifestToUse = updatedManifest
  //   ? updatedManifest
  //   : manifest as ManifestV2;
  
  //console.log("manifestToUse", manifestToUse);

  const context = new Context({
    defaultConsent: true,
    manifest: manifest,
    transitionStore: new NextCookieTransitionDataStore({
      serverContext,
      cookieAttributes: {
        expires,
      },
    }),
    plugins: plugins,
    visitLifespan: sessionExpirationInSeconds * 1000,
  });
  return context;
}