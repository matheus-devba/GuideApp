// services/media/TemplateRenderer.js
export class TemplateRenderer {

    static async render(html) {

       
    }
}


// const puppeteer = require("puppeteer");

// export class TemplateRenderer {

//     async render(html) {

//         const browser = await puppeteer.launch({
//             headless: true
//         });

//         const page = await browser.newPage();

//         await page.setViewport({
//             width: 1080,
//             height: 1920
//         });

//         await page.setContent(html);

//         const image = await page.screenshot({
//             type: "png"
//         });

//         await browser.close();

//         return image;

//     }

// }

// module.exports = new TemplateRenderer();