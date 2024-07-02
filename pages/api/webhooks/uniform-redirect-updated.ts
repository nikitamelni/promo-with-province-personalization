import type { NextApiRequest, NextApiResponse } from 'next';
import { purgeEdgioCache } from '@/lib/edgioPurger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers['x-verification-secret'] === process.env.UNIFORM_PREVIEW_SECRET) {
    const payloadObject = req.body;

    const sourceUrl = payloadObject?.source_url;
    const targetUrl = payloadObject?.target_url;

    if (sourceUrl && targetUrl) {
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
      const paths: string[] = [];
      paths.push('/' + sourceUrl.replace(/:w+((\/|$))/g, '*$2'));

      try {
        await purgeEdgioCache(paths);
      } catch (err) {
        console.error('edgio cache was not cleared', err);
        res.status(400).send(JSON.stringify({ reason: 'edgio cache was not cleared', err }));
        return;
      }
    } else {
      console.error('Source or target URLs are empty', payloadObject);
      res.status(400).send(
        JSON.stringify({
          reason: 'Source or target URLs are empty',
          payloadObject: payloadObject,
        })
      );
    }

    res.status(200).send('OK');
    return;
  } else {
    res.status(403).send(JSON.stringify({ reason: 'not authorized' }));
    return;
  }
}
