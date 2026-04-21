const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
    page.on('pageerror', error => console.error('BROWSER_PAGE_ERROR:', error.message));
    page.on('requestfailed', request => console.error('BROWSER_REQUEST_FAILED:', request.url(), request.failure()?.errorText));

    console.log('Navigating to http://localhost:4200/products/1...');
    try {
        await page.goto('http://localhost:4200/products/1', { waitUntil: 'networkidle2', timeout: 15000 });
        console.log('Page loaded. Waiting 2 seconds...');
        await new Promise(r => setTimeout(r, 2000));
        
        // Output body HTML to check if rendered
        const bodyHTML = await page.evaluate(() => document.body.innerHTML.substring(0, 500) + '...');
        console.log('BODY HTML START:', bodyHTML);

        // Check if .product-page exists
        const hasProductPage = await page.$('.product-page') !== null;
        console.log('Has .product-page:', hasProductPage);
        
        const hasErrorState = await page.$('.bi-exclamation-triangle') !== null;
        console.log('Has error state:', hasErrorState);
        
        console.log('Done.');
    } catch (e) {
        console.error('PUPPETEER_ERROR:', e);
    } finally {
        await browser.close();
    }
})();
