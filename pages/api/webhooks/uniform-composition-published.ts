import { Webhook } from "svix";
import type { NextApiRequest, NextApiResponse } from 'next'
import { ProjectMapClient } from '@uniformdev/project-map';
import { buffer } from 'micro';
import { purgeEdgioCache } from '@/lib/edgioPurger';

export const config = {
  api: {
    bodyParser: false,
  },
}

const payloadMock = {
  "id": "0b9d2118-f2d0-4fe6-9d46-7c661abaf474",
  "name": "About Us",
  "slug": "/about-us",
  "type": "page",
  "state": 64,
  "api_url": "https://uniform.app/api/v1/canvas?projectId=644ede73-d6aa-4159-bf98-14ad7fb4cb66&compositionId=0b9d2118-f2d0-4fe6-9d46-7c661abaf474&state=64",
  "project": {
    "id": "644ede73-d6aa-4159-bf98-14ad7fb4cb66",
    "url": "https://uniform.app/projects/644ede73-d6aa-4159-bf98-14ad7fb4cb66"
  },
  "edge_url": "https://uniform.global/api/v1/compositions?projectId=644ede73-d6aa-4159-bf98-14ad7fb4cb66&compositionId=0b9d2118-f2d0-4fe6-9d46-7c661abaf474&state=64",
  "edit_url": "https://uniform.app/projects/644ede73-d6aa-4159-bf98-14ad7fb4cb66/dashboards/canvas/edit/0b9d2118-f2d0-4fe6-9d46-7c661abaf474"
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = (await buffer(req)).toString();
  const headers = req.headers as Record<string, string>;

  /**
   * If you page retrieval does not depend on the Project Map and only using Composition Slugs
   * you can use the following code to clear the cache
   *
   * await purgeEdgioCache([payload.slug]);
   */

  /**
   * If you are using Project Map tree to retrieve the page path, you can use the following code to clear the cache
   */
  const client = new ProjectMapClient({
    projectId: process.env.UNIFORM_PROJECT_ID,
    apiHost: process.env.UNIFORM_CLI_BASE_URL,
    apiKey: process.env.UNIFORM_API_KEY,
  });

  const payloadObject = JSON.parse(payload);

  const projectMapNode = await client.getNodes({ compositionId: payloadObject.id, depth: 1, state: 64 });
  if (projectMapNode.nodes.length > 0) {
    const node = projectMapNode.nodes[0];
    console.log('Wehbook node was found', node);

    /**
     * Some project map nodes can have Dynamic Inputs which we don't know all possible values for
     * so naive approach would be just clearing everything using string temples
     * @see https://docs.edg.io/rest_api/#tag/purge-requests/operation/postCacheV01PurgeRequests
     * the part about "values" parameter for "path" purge type
     *
     * Alternatively you can implement a more sophisticated logic
     * to clear only the necessary paths if you know the structure of your urls
     */

    // Double grouping is needed to correctly retrieve $2 from the regex
    const path = node.path.replace(/:w+((\/|$))/g, '*$2');
    try {
      await purgeEdgioCache([path]);
    } catch (err) {
      console.error('edgio cache was not cleared', err);
      res.status(400).send(JSON.stringify({ reason: 'edgio cache was not cleared', err }));
      return;
    }
  } else {
    console.error('Project Map Node was not found for compositionID', payloadObject.id)
    res.status(400).send(JSON.stringify({ reason: 'Project Map Node was not found for compositionID', compositionID: payloadObject.id }));
  }

  res.status(200).send("OK");
}
