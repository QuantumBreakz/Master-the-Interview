// AI-generated web scraping example
// Fetches HTML from multiple URLs and extracts product info

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// List of URLs to scrape
const urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3'
];

// Function to fetch HTML content
async function fetchHTML(url) {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        console.error(`Error fetching ${url}:`, err.message);
        return null;
    }
}

// Function to parse product information
function parseProducts(html) {
    const $ = cheerio.load(html);
    const products = [];

    $('div.product').each((i, elem) => {
        const title = $(elem).find('h2').text();
        const price = $(elem).find('span.price').text();
        const link = $(elem).find('a').attr('href');
        products.push({ title, price, link });
    });

    return products;
}

// Function to save products to JSON
function saveJSON(data, filename) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`Saved ${data.length} items to ${filename}`);
}

// Main function
(async () => {
    let allProducts = [];

    for (const url of urls) {
        const html = await fetchHTML(url);
        if (html) {
            const products = parseProducts(html);
            allProducts = allProducts.concat(products);
        }
    }

    saveJSON(allProducts, 'products.json');
})();
