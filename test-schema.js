const axios = require('axios');

const token = process.env.STRAPI_API_TOKEN;
const api = axios.create({
  baseURL: 'http://103.191.208.235:1337/api',
  headers: { Authorization: `Bearer ${token}` }
});

async function test() {
  try {
    console.log('Fetching existing article...');
    const res = await api.get('/articles?pagination[limit]=1');
    console.log('Response:', JSON.stringify(res.data, null, 2).substring(0, 500));
    if (res.data.data && res.data.data[0]) {
      console.log('\n✅ Article found! Field names:');
      console.log(Object.keys(res.data.data[0].attributes || {}).sort());
    } else {
      console.log('No articles found');
    }
  } catch (error) {
    console.log('ERROR:', error.response?.data || error.message);
  }
}

test();
