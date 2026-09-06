const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const { execSync } = require('child_process');

const ARTIFACTS_DIR = 'C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\dbcbeca6-ca28-4390-a75a-6fa31ff5b9ef';
const VIDEOS_DIR = path.join(__dirname, 'videos_temp');
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

// Ensure Playwright has ffmpeg mapped
const pwFfmpegDir = path.join(process.env.LOCALAPPDATA || 'C:\\Users\\Lenovo\\AppData\\Local', 'ms-playwright', 'ffmpeg-1011');
try {
  fs.mkdirSync(pwFfmpegDir, { recursive: true });
  const pwFfmpegExe = path.join(pwFfmpegDir, 'ffmpeg-win64.exe');
  if (!fs.existsSync(pwFfmpegExe)) {
    fs.copyFileSync(ffmpegPath, pwFfmpegExe);
  }
} catch (e) {
  console.warn('Playwright ffmpeg check:', e.message);
}

async function smoothScrollBy(page, distance, steps = 24, interval = 25) {
  const stepDistance = distance / steps;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((d) => window.scrollBy(0, d), stepDistance);
    await page.waitForTimeout(interval);
  }
}

(async () => {
  console.log('🚀 Recording floral blooming reveal at 390px...');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--disable-gpu', '--no-sandbox']
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

  // 1. Cover
  console.log('1. Loading cover...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // 2. Open button click
  console.log('2. Clicking OPEN INVITATION...');
  const openBtn = page.locator('#btn-open-invitation');
  await openBtn.click();

  // 3. Watching intro note
  console.log('3. Watching intro note...');
  await page.waitForTimeout(3000);

  // 4. Capture mid-bloom snapshot as florals are actively unfolding
  console.log('4. Capturing blooming in-progress...');
  await page.waitForTimeout(500); // florals are 40-50% grown
  const bloomingShot = path.join(ARTIFACTS_DIR, 'floral-blooming-midway-390px.png');
  await page.screenshot({ path: bloomingShot });
  console.log('Saved mid-bloom screenshot at:', bloomingShot);

  // 5. Allow florals to fully settle into full botanical form
  await page.waitForTimeout(1600);
  const settledShot = path.join(ARTIFACTS_DIR, 'floral-blooming-settled-390px.png');
  await page.screenshot({ path: settledShot });
  console.log('Saved settled floral screenshot at:', settledShot);

  // 6. Smooth natural scroll into countdown scene
  console.log('6. Scrolling smoothly into countdown scene...');
  await smoothScrollBy(page, 340, 25, 25);
  await page.waitForTimeout(1200);

  // Close context to finalize video
  await page.close();
  await context.close();
  await browser.close();

  // Find the recorded video file
  const videoFiles = fs.readdirSync(VIDEOS_DIR).filter(f => f.endsWith('.webm'));
  if (videoFiles.length > 0) {
    const rawVideo = path.join(VIDEOS_DIR, videoFiles[videoFiles.length - 1]);
    const finalMp4 = path.join(ARTIFACTS_DIR, 'floral_blooming_reveal_390px.mp4');
    const finalWebm = path.join(ARTIFACTS_DIR, 'floral_blooming_reveal_390px.webm');

    console.log('Converting video to MP4 and WebM...');
    try {
      execSync(`"${ffmpegPath}" -y -i "${rawVideo}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "${finalMp4}"`, { stdio: 'inherit' });
      fs.copyFileSync(rawVideo, finalWebm);
      console.log('SUCCESS: Video saved at ' + finalMp4);
    } catch (e) {
      console.error('FFmpeg conversion error:', e.message);
      fs.copyFileSync(rawVideo, finalWebm);
    }
  }

  console.log('🎉 Recording complete!');
})();
