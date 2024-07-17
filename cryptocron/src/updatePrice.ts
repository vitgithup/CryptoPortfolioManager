require('dotenv').config()
import { PrismaClient } from "@prisma/client";
import { exit } from "process";
const prisma = new PrismaClient();
const axios = require('axios');

async function getQuotes(name: String) {
  const strSlug = name.toLowerCase().replace(/ /g, '-');
  console.log("getQuotes :", strSlug);
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
    console.error('Error fetching data:', (error as Error).message);
  }

  return 0 ;
}


async function updatePrice() {
  const cryptocurrencies = await prisma.cryptocurrency.findMany();
  for (let i = 0; i < cryptocurrencies.length; i++) {
    const item = cryptocurrencies[i];
    const price = await getQuotes(item.name);
    item.price = price+""; 
    console.log("price", item.price);
    await prisma.cryptocurrency.update({
      where: {
        id: Number(item.id),
      },
      data: {
        price: item.price,
      },
    });
  }

  console.log("done");
  exit(0);
}
updatePrice()