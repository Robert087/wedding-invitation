const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Click OPEN INVITATION button
  const openBtn = page.locator('#btn-open-invitation');
  await openBtn.click();
  await page.waitForTimeout(3800);

  // Scroll down to Hathor Hotel section
  const hathorSection = page.locator('#hathor-celebration');
  await hathorSection.scrollIntoViewIfNeeded();

  await page.evaluate(() => {
    document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-revealed', 'is-visible'));
    const audioBtn = document.getElementById('audio-toggle');
    if (audioBtn) audioBtn.style.display = 'none';
  });

  await page.waitForTimeout(600);

  // 1. Capture focused Hathor Hotel section
  const hathorEl = await page.$('#hathor-celebration');
  if (hathorEl) {
    const artifactHathor = path.resolve('C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\dbcbeca6-ca28-4390-a75a-6fa31ff5b9ef', 'hathor-hotel-moment-390px.png');
    await hathorEl.screenshot({ path: artifactHathor });
    console.log('SUCCESS: Captured Hathor Hotel moment at ' + artifactHathor);
  }

  // 2. Also capture flow with calendar + hathor hotel + gallery transition
  const countdownAndHathor = await page.evaluate(() => {
    window.scrollTo(0, document.getElementById('countdown-moment').offsetTop + 200);
  });
  await page.waitForTimeout(400);

  const flowPath = path.resolve('C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\dbcbeca6-ca28-4390-a75a-6fa31ff5b9ef', 'hathor-flow-context-390px.png');
  await page.screenshot({ path: flowPath });
  console.log('SUCCESS: Captured flow context at ' + flowPath);

  await browser.close();
})();
