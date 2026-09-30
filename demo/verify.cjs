const fs = require('node:fs');
const { chromium } = require('playwright');

(async () => {
  const data = JSON.parse(fs.readFileSync('../demo-evidence/movies.json', 'utf8'));
  if (!Array.isArray(data.movies) || data.movies.length === 0) {
    throw new Error('Backend returned no movies');
  }
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Movie List', exact: true }).waitFor();
    for (const movie of data.movies) {
      await page.getByText(movie.title, { exact: true }).waitFor({ timeout: 30000 });
    }
    await page.screenshot({ path: '../demo-evidence/frontend.png', fullPage: true });
    fs.writeFileSync('../demo-evidence/result.txt',
      `Verified ${data.movies.length} movies rendered from the Kubernetes backend.\n`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
