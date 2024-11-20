import axios from 'axios';
import * as cheerio from 'cheerio'; 
import namer = require('color-namer');

interface ProductDetails {
  imageUrls: string[];
  description: string[];
  colors: string[];
  sizes: string[];
  price: string;
  colorsOnUrl: string[];
}

async function fetchProductDetails(url: string): Promise<ProductDetails | null> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Fetch images
    const imageUrls: string[] = [];
    $('div.product__thumb div.product__thumb-list.swiper')
      .find('div.swiper-wrapper div.product__thumb-item.product__thumb-item--image.swiper-slide')
      .find('div.product__image-holder picture.product__image img')
      .each((_, element) => {
        const src = $(element).attr('src');
        if (src) {
          imageUrls.push(src.startsWith('http') ? src : `https:${src}`);
        }
      });

    // Fetch descriptions
    const description: string[] = [];
    $('div.product-details__content-inner ul li').each((_, element) => {
      const text = $(element).find('span').text().trim();
      if (text) {
        description.push(text);
      }
    });

    // Fetch colors based on color code
    const colors: string[] = [];
    $('div.product__offers div.product__swatches div.product__swatches a').each((_, element) => {
      const style = $(element).attr('style');
      if (style) {
        const colorCodeMatch = style.match(/background-color:\s?(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgba?\(.*?\));/);
        if (colorCodeMatch) {
          const colorCode = colorCodeMatch[1]; // Extract color code
          const namedColor = namer(colorCode); // Convert to name
          const colorName = namedColor.ntc[0]?.name || 'Unknown Color'; // Use nearest match
          colors.push(colorName);
        }
      }
    });

    // Fetch colors based on product URL
    const colorsOnUrl: string[] = [];
    $('div.product__offers div.product__swatches div.product__swatches a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        colorsOnUrl.push(href);
      }
    });

    // Fetch sizes
    const sizes: string[] = [];
    $('select#SingleOptionSelector-0 option').each((_, element) => {
      const size = $(element).text().trim();
      if (size) {
        sizes.push(size);
      }
    });

    // Fetch price
    const price = $('span[data-product-price]').text().trim();

    // Return product details
    return {
      imageUrls,
      description,
      colors,
      sizes,
      price,
      colorsOnUrl,
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

// Function to extract only the color names from product URLs
const extractColors = (colorArray: string[]): string[] => {
    return colorArray.map(colorUrl => {
      const segments = colorUrl.split('/'); 
      const lastSegment = segments[segments.length - 1]; 
      return lastSegment
        .replace(/harmony|knit|jumper|sweater|arrowtown/gi, '') 
        .replace(/-+/g, ' ') 
        .trim(); 
    });
  };
  
const productUrl = 'https://us.princesspolly.com/products/harmony-sweater-blue';

fetchProductDetails(productUrl).then((details) => {
  if (details) {
    console.log('Product Details:', details);

    // Extract and clean color names from URLs
    const cleanedColors = extractColors(details.colorsOnUrl);
    console.log("Colors based on product URL:");
    console.log(cleanedColors);
  } else {
    console.log('Failed to fetch product details.');
  }
});
