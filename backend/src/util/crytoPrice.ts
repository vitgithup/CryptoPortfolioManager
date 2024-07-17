const axios = require('axios');

export default async function getQuotes(name: String) {
    const strSlug = name.toLowerCase().replace(/ /g, '-');
    // console.log("getQuotes :", strSlug);
    const apiKey = 'ff10371a-eb67-4e03-a4de-2e77274d5bd9';
    const endpoint = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest';
  
    // Define your request parameters
    const params = new URLSearchParams({
      //'bitcoin,ethereum'
      slug: strSlug, 
      // skip_invalid : 'true' //API error : Not work
    });
  
    try {
      const response = await axios.get(endpoint, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
          'Accept': 'application/json',
        },
        params,
      });
  
      const crytoId = Object.keys(response.data.data)[0];
      // console.log(response.data.data[crytoId].quote.USD.price); // Handle the response data as needed
      return response.data.data[crytoId].quote.USD.price
    } catch (error) {
      // console.error('Error fetching data:', (error as Error).message);
    }
  
    return 0 ;
  }