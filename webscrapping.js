"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var cheerio = require("cheerio");
var namer = require("color-namer");
function fetchProductDetails(url) {
    return __awaiter(this, void 0, void 0, function () {
        var data, $_1, imageUrls_1, description_1, colors_1, colorsOnUrl_1, sizes_1, price, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    data = (_a.sent()).data;
                    $_1 = cheerio.load(data);
                    imageUrls_1 = [];
                    $_1('div.product__thumb div.product__thumb-list.swiper')
                        .find('div.swiper-wrapper div.product__thumb-item.product__thumb-item--image.swiper-slide')
                        .find('div.product__image-holder picture.product__image img')
                        .each(function (_, element) {
                        var src = $_1(element).attr('src');
                        if (src) {
                            imageUrls_1.push(src.startsWith('http') ? src : "https:".concat(src));
                        }
                    });
                    description_1 = [];
                    $_1('div.product-details__content-inner ul li').each(function (_, element) {
                        var text = $_1(element).find('span').text().trim();
                        if (text) {
                            description_1.push(text);
                        }
                    });
                    colors_1 = [];
                    $_1('div.product__offers div.product__swatches div.product__swatches a').each(function (_, element) {
                        var _a;
                        var style = $_1(element).attr('style');
                        if (style) {
                            var colorCodeMatch = style.match(/background-color:\s?(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgba?\(.*?\));/);
                            if (colorCodeMatch) {
                                var colorCode = colorCodeMatch[1]; // Extract color code
                                var namedColor = namer(colorCode); // Convert to name
                                var colorName = ((_a = namedColor.ntc[0]) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Color'; // Use nearest match
                                colors_1.push(colorName);
                            }
                        }
                    });
                    colorsOnUrl_1 = [];
                    $_1('div.product__offers div.product__swatches div.product__swatches a').each(function (_, element) {
                        var href = $_1(element).attr('href');
                        if (href) {
                            colorsOnUrl_1.push(href);
                        }
                    });
                    sizes_1 = [];
                    $_1('select#SingleOptionSelector-0 option').each(function (_, element) {
                        var size = $_1(element).text().trim();
                        if (size) {
                            sizes_1.push(size);
                        }
                    });
                    price = $_1('span[data-product-price]').text().trim();
                    // Return product details
                    return [2 /*return*/, {
                            imageUrls: imageUrls_1,
                            description: description_1,
                            colors: colors_1,
                            sizes: sizes_1,
                            price: price,
                            colorsOnUrl: colorsOnUrl_1,
                        }];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching product details:', error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to extract only the color names from product URLs
var extractColors = function (colorArray) {
    return colorArray.map(function (colorUrl) {
        var segments = colorUrl.split('/');
        var lastSegment = segments[segments.length - 1];
        return lastSegment
            .replace(/harmony|knit|jumper|sweater|arrowtown/gi, '')
            .replace(/-+/g, ' ')
            .trim();
    });
};
var productUrl = 'https://us.princesspolly.com/products/harmony-sweater-blue';
fetchProductDetails(productUrl).then(function (details) {
    if (details) {
        console.log('Product Details:', details);
        // Extract and clean color names from URLs
        var cleanedColors = extractColors(details.colorsOnUrl);
        console.log("Colors based on product URL:");
        console.log(cleanedColors);
    }
    else {
        console.log('Failed to fetch product details.');
    }
});
