import PageComposition from "@/components/PageComposition";
import { withUniformGetServerSideProps } from "@uniformdev/canvas-next/route";
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE, RouteClient } from "@uniformdev/canvas";
import { getCompositionsForNavigation, getRouteClient } from "@/lib/uniform/canvasClient";

// IMPORTANT: this starter is using SSR mode by default for simplicity. SSG mode can be enabled, please check Uniform docs here: https://docs.uniform.app/docs/guides/composition/routing#project-map-with-uniform-get-server-side-props-and-with-uniform-get-static-props
export const getServerSideProps = withUniformGetServerSideProps({
  // fetching draft composition in dev mode for convenience
  requestOptions: ((context) => {
    return {
      state: context?.query?.uniform_canvas_preview_override === process.env.UNIFORM_PREVIEW_SECRET ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE
    };
  }),
  client: getRouteClient(),
  handleComposition: async (
    { compositionApiResponse },
    _context,
    _defaultHandler
  ) => {
    const { composition } = compositionApiResponse || {};
    const { preview, res } = _context || {};
    const navLinks = await getCompositionsForNavigation(preview);

    // enable CDN caching of SSR pages by setting cache control
    // 7 days
    res.setHeader(
      "Cache-Control",
      "s-maxage=604800, stale-while-revalidate=30"
    );
    return {
      props: {
        data: composition,
        navLinks,
      },
    };
  },
});

export default PageComposition;
