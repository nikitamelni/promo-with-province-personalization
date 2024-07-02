const { RedirectClient } = require('@uniformdev/redirect');
const dotenv = require('dotenv');
const fs = require('fs');

const getAllUniformRedirects = async () => {
  dotenv.config()

  const client = new RedirectClient({
    apiKey: process.env.UNIFORM_API_KEY,
    projectId: process.env.UNIFORM_PROJECT_ID,
  })
  console.log('📝 Fetching redirects...');
  const ret = []
  let redirects = (await client.getRedirects({ limit: 50, offset: 0 }))
    .redirects
  let count = 0
  while (redirects.length) {
    const redirect = redirects.pop()
    ret.push({
      source: redirect?.redirect.sourceUrl,
      destination: redirect?.redirect.targetUrl,
      permanent: redirect?.redirect.targetStatusCode === 301,
    })
    if (!redirects.length) {
      count++
      redirects = (await client.getRedirects({ limit: 50, offset: count * 50 }))
        .redirects
    }
  }
  return ret;

};

const main = async () => {
  console.log('🚀 Pushing Uniform redirects...');
  const redirects = await getAllUniformRedirects();

  fs.writeFileSync('./scripts/uniform-redirects.json', JSON.stringify(redirects));

  console.log('✅done');
};

main();
