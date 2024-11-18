import axios from 'axios';
import * as cheerio from 'cheerio'; 

interface ProductDetails {
  imageUrls: string[];
  description: string[];
  colors: string[];
  sizes: string[];
  price: string;
}

async function fetchProductDetails(url: string): Promise<ProductDetails | null> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
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

    const description: string[] = [];
    $('div.product-details__content-inner ul li').each((_, element) => {
        const text = $(element).find('span').text().trim();
        if (text) {
            description.push(text);
        }
    });
    const colors: string[] = [];
    $('div.product__offers div.product__swatches div.product__swatches a').each((_, element) => {
        const href = $(element).attr('href');
        if(href)
            colors.push(href)
    });
    const sizes: string[] = [];
    $('select#SingleOptionSelector-0 option').each((_, element) => {
      const size = $(element).text().trim();
      if (size) {
        sizes.push(size);
      }
    });
    const price = $('span[data-product-price]').text().trim();
    return {
      imageUrls,
      description,
      colors,
      sizes,
      price,
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

const productUrl = 'https://us.princesspolly.com/products/harmony-sweater-blue';
fetchProductDetails(productUrl).then((details) => {
  if (details) {
    let colors: string[] = details.colors; 
    const colorNames = colors.map((url) => {
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1];
    return lastSegment.replace(/-/g, ' '); 
    });
    details.colors = colorNames; 
    if (details.sizes && Array.isArray(details.sizes)) {
        details.sizes = details.sizes.slice(1); 
    }
    console.log('Product Details:', details);
  } else {
    console.log('Failed to fetch product details.');
  }
});
