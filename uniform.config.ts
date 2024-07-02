import type { CLIConfiguration } from "@uniformdev/cli";

const config: CLIConfiguration = {
  serialization: {
    format: "json",
    allowEmptySource: true,
    entitiesConfig: {
      signal: {},
      composition: { publish: true },
      entry: { publish: true },
      pattern: { publish: true },
      redirect: {},
      asset: {},
      component: {},
      projectMapDefinition: {},
      projectMapNode: {},
    },
  },
};

module.exports = config;
