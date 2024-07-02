import { useUniformContext } from "@uniformdev/context-react";
import { useEffect } from "react";

function getParameters(
  testIdParameter: string,
  variantIdParameter: string
): { test?: string; variant?: string, url: URL } {
  const url = new URL(location.href);
  const test = url.searchParams.get(testIdParameter);
  const variant = url.searchParams.get(variantIdParameter);
  if (test && variant) {
    url.searchParams.delete(variantIdParameter);
    url.searchParams.delete(testIdParameter);
  }
  return { test, variant, url };
}

export type UniformAbTestControllerProps = {
  testIdParameter: string;
  variantIdParameter: string;
};

export function UniformAbTestController(props: UniformAbTestControllerProps) {
  const { testIdParameter, variantIdParameter } = props;
  const { context } = useUniformContext();
  useEffect(() => {
    const { test, variant, url } = getParameters(testIdParameter, variantIdParameter);
    if (test && variant) {
      context.storage
        .updateData([
          {
            type: "settest",
            data: {
              test,
              variant,
            },
          },
        ])
        .then(() => {
          location.replace(url);
        });
    }
  });
  return <></>
}
