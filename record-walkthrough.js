const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

// Ensure Playwright has ffmpeg mapped
const pwFfmpegDir = 'C:\\Users\\rotai\\AppData\\Local\\ms-playwright\\ffmpeg-1011';
try {
  fs.mkdirSync(pwFfmpegDir, { recursive: true });
  const pwFfmpegExe = path.join(pwFfmpegDir, 'ffmpeg-win64.exe');
  if (!fs.existsSync(pwFfmpegExe)) {
    fs.copyFileSync(ffmpegPath, pwFfmpegExe);
  }
} catch (e) {
  console.warn('Playwright ffmpeg check:', e.message);
}

const VIDEOS_DIR = path.join(__dirname, 'videos');
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

const ARTIFACTS_DIR = 'C:\\Users\\rotai\\.gemini\\antigravity-ide\\brain\\f7a1b87b-4159-417e-a85d-0e29d1b2f3cf';

async function smoothScrollBy(page, distance, steps = 14, interval = 30) {
  const stepDistance = distance / steps;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((d) => window.scrollBy(0, d), stepDistance);
    await page.waitForTimeout(interval);
  }
}

(async () => {
  console.log('🚀 Starting refined mobile screen recording at 390px width...');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: [
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--autoplay-policy=no-user-gesture-required'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    recordVideo: {
      dir: VIDEOS_DIR,
      size: { width: 390, height: 844 }
    }
  });

  const page = await context.newPage();

  // 1. Initial Opening Cover Screen
  console.log('1. Loading opening cover...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800); // Admire initial screen

  // 2. Click OPEN INVITATION
  console.log('2. Opening invitation...');
  const openBtn = page.locator('#btn-open-invitation');
  await openBtn.hover();
  await page.waitForTimeout(400);
  await openBtn.click();
  await page.waitForTimeout(2000); // Cover dissolves into the continuous embossed suite

  // 3. Continuous Embossed Suite (Names, Date, Whisper Countdown & Ceremony)
  console.log('3. Flowing through embossed invitation & ceremony suite...');
  await smoothScrollBy(page, 280, 16, 30);
  await page.waitForTimeout(1500);

  // 4. Moment 1: Childhood Memory to Adult Transformation
  console.log('4. Transitioning into Visual Love Journey: Childhood to Adult Transformation...');
  const childhoodNode = page.locator('#node-childhood');
  await childhoodNode.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Scroll smoothly down into the childhood stage to trigger progressive crossfade
  for (let s = 0; s < 12; s++) {
    await page.evaluate(() => window.scrollBy(0, 18));
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1400); // Hold on transformed adult portrait

  // 5. Moment 2: Tactile Stacked Candid Memories
  console.log('5. Stacked Candid Prints - tactile peeling...');
  const stackedSection = page.locator('#stacked-sequence-section');
  await stackedSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);

  // Smoothly peel Card 1 and Card 2
  const stackedSteps = 22;
  for (let s = 0; s < stackedSteps; s++) {
    await page.evaluate(() => window.scrollBy(0, 36));
    await page.waitForTimeout(65);
  }
  await page.waitForTimeout(1400); // Admire revealed final print

  // 6. Moment 3: Intimate Overlapping Portraits ("just us.")
  console.log('6. Intimate Overlapping Composition...');
  await smoothScrollBy(page, 520, 20, 30);
  await page.waitForTimeout(1600);

  // 7. Moment 4: Flowing Horizontal Memory Ribbon
  console.log('7. Flowing Horizontal Ribbon...');
  const horizontalModule = page.locator('#horizontal-module');
  await horizontalModule.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);

  // Smooth scroll across horizontal ribbon
  await page.evaluate(() => {
    const container = document.querySelector('#horizontal-module .ribbon-viewport');
    if (container) container.scrollTo({ left: 240, behavior: 'smooth' });
  });
  await page.waitForTimeout(1300);

  await page.evaluate(() => {
    const container = document.querySelector('#horizontal-module .ribbon-viewport');
    if (container) container.scrollTo({ left: 520, behavior: 'smooth' });
  });
  await page.waitForTimeout(1300);

  await page.evaluate(() => {
    const container = document.querySelector('#horizontal-module .ribbon-viewport');
    if (container) container.scrollTo({ left: 120, behavior: 'smooth' });
  });
  await page.waitForTimeout(900);

  // 8. Moment 5: Cinematic Parallax Immersion ("And somehow, it became everything.")
  console.log('8. Cinematic Parallax Immersion...');
  const cinematicBreak = page.locator('#cinematic-break');
  await cinematicBreak.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);

  // 9. Moment 6: Final Paired-Photo Spread ("Now, we begin forever.")
  console.log('9. Final Paired-Photo Spread...');
  const nodePair = page.locator('.node-pair');
  await nodePair.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);

  // 10. Stationery Handwritten Guestbook
  console.log('10. Intimate Stationery Guestbook...');
  const guestbookSection = page.locator('.stationery-guestbook');
  await guestbookSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);

  // Type on the minimal ruled lines
  const nameInput = page.locator('#guest-name');
  await nameInput.click();
  await nameInput.pressSequentially('Peter & Mary', { delay: 60 });
  await page.waitForTimeout(250);

  const msgInput = page.locator('#guest-message');
  await msgInput.click();
  await msgInput.pressSequentially('May every chapter be filled with joy and grace! ♡', { delay: 35 });
  await page.waitForTimeout(500);

  console.log('Submitting wish...');
  const submitBtn = page.locator('.btn-note-submit');
  await submitBtn.click();
  await page.waitForTimeout(1500); // Toast & feed reveal

  // Scroll to show the wishes stream
  await smoothScrollBy(page, 160, 10, 30);
  await page.waitForTimeout(1400);

  // 11. Final Closing Section (SEE YOU THERE)
  console.log('11. Final Closing Section...');
  const closingSection = page.locator('.closing-journey');
  await closingSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2800); // Lingering final moment

  console.log('🏁 Recording complete. Finalizing video...');
  const video = page.video();
  await context.close();
  await browser.close();

  const rawVideoPath = await video.path();
  console.log('Raw WebM video saved at:', rawVideoPath);

  const webmDest = path.join(__dirname, 'walkthrough_mobile_390px.webm');
  const mp4Dest = path.join(__dirname, 'walkthrough_mobile_390px.mp4');

  fs.copyFileSync(rawVideoPath, webmDest);

  console.log('Transcoding to universal MP4 with faststart...');
  const ffmpegCmd = `"${ffmpegPath}" -y -i "${rawVideoPath}" -c:v libx264 -pix_fmt yuv420p -profile:v main -level 3.1 -movflags +faststart -r 30 "${mp4Dest}"`;
  execSync(ffmpegCmd, { stdio: 'inherit' });

  if (fs.existsSync(ARTIFACTS_DIR)) {
    const artifactWebm = path.join(ARTIFACTS_DIR, 'walkthrough_mobile_390px.webm');
    const artifactMp4 = path.join(ARTIFACTS_DIR, 'walkthrough_mobile_390px.mp4');
    fs.copyFileSync(webmDest, artifactWebm);
    fs.copyFileSync(mp4Dest, artifactMp4);
  }

  const mp4Size = (fs.statSync(mp4Dest).size / (1024 * 1024)).toFixed(2);
  const webmSize = (fs.statSync(webmDest).size / (1024 * 1024)).toFixed(2);
  console.log(`✨ DONE! Refined mobile walkthrough recorded.`);
  console.log(`📹 MP4:  ${mp4Dest} (${mp4Size} MB)`);
  console.log(`📹 WebM: ${webmDest} (${webmSize} MB)`);
})();
