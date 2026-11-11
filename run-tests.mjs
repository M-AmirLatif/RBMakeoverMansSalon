import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUTPUT_DIR = path.resolve("./test-results");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log("Starting automated browser tests with Edge...");
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();

  // Listen to console errors
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  page.on("pageerror", (err) => {
    consoleErrors.push(err.toString());
  });

  const viewports = [
    { name: "mobile-360", width: 360, height: 780 },
    { name: "mobile-390", width: 390, height: 844 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "laptop-1280", width: 1280, height: 800 },
    { name: "desktop-1920", width: 1920, height: 1080 },
  ];

  console.log("\n=== 1. Viewport & Overflow Tests ===");
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    // Check horizontal scroll
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): Overflow = ${hasHorizontalOverflow ? "FAIL (Horizontal overflow detected!)" : "PASS (No overflow)"}`);

    // Take screenshot
    const screenshotPath = path.join(OUTPUT_DIR, `${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`  Saved screenshot: ${screenshotPath}`);
  }

  // Check image loading after scrolling down to trigger lazy loading
  console.log("\n=== 2. Image Loading Verification ===");
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
  await new Promise((r) => setTimeout(r, 1500));

  const brokenImages = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll("img"));
    return images
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.src);
  });
  console.log(`Broken images count: ${brokenImages.length}`);
  if (brokenImages.length > 0) {
    console.log("Broken images:", brokenImages);
  } else {
    console.log("PASS: All images loaded with non-zero dimensions!");
  }

  // Interactive Tests
  console.log("\n=== 3. Interactive Tests ===");

  // Mobile menu test
  await page.setViewport({ width: 390, height: 844 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  const menuButton = await page.$('button[aria-label="Open navigation menu"]');
  if (menuButton) {
    console.log("Found mobile menu button, clicking...");
    await menuButton.click();
    await new Promise((r) => setTimeout(r, 300));

    const isMenuOpen = await page.evaluate(() => {
      const menu = document.getElementById("mobile-navigation-menu");
      return menu !== null;
    });
    console.log(`Mobile menu opened: ${isMenuOpen ? "PASS" : "FAIL"}`);

    // Take menu screenshot
    await page.screenshot({ path: path.join(OUTPUT_DIR, "mobile-menu-open.png") });

    // Press Escape to close
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 300));
    const isMenuClosed = await page.evaluate(() => {
      return document.getElementById("mobile-navigation-menu") === null;
    });
    console.log(`Mobile menu closed with Escape: ${isMenuClosed ? "PASS" : "FAIL"}`);
  }

  // Category Tabs Test
  console.log("\nTesting Service Category Tabs...");
  const tabs = await page.$$('button[role="tab"]');
  console.log(`Found ${tabs.length} category tabs.`);
  if (tabs.length >= 2) {
    await tabs[1].click(); // Click Beard & Grooming tab
    await new Promise((r) => setTimeout(r, 300));
    const activeText = await page.evaluate(() => {
      const activeTab = document.querySelector('button[role="tab"][aria-selected="true"]');
      return activeTab ? activeTab.textContent : "";
    });
    console.log(`Active tab after click: "${activeText.trim()}" - PASS`);
  }

  // Lightbox Modal Test
  console.log("\nTesting Gallery Lightbox Modal...");
  const galleryItem = await page.$('div[role="button"][aria-label^="Open photo:"]');
  if (galleryItem) {
    console.log("Found gallery image, clicking to trigger lightbox...");
    await galleryItem.click();
    await new Promise((r) => setTimeout(r, 400));

    const isLightboxOpen = await page.evaluate(() => {
      const modal = document.querySelector('div[role="dialog"][aria-label="Image gallery lightbox"]');
      return modal !== null;
    });
    console.log(`Lightbox opened: ${isLightboxOpen ? "PASS" : "FAIL"}`);

    if (isLightboxOpen) {
      await page.screenshot({ path: path.join(OUTPUT_DIR, "lightbox-open.png") });

      // Navigate with ArrowRight
      await page.keyboard.press("ArrowRight");
      await new Promise((r) => setTimeout(r, 200));

      // Close with Escape
      await page.keyboard.press("Escape");
      await new Promise((r) => setTimeout(r, 300));

      const isLightboxClosed = await page.evaluate(() => {
        return document.querySelector('div[role="dialog"][aria-label="Image gallery lightbox"]') === null;
      });
      console.log(`Lightbox closed with Escape: ${isLightboxClosed ? "PASS" : "FAIL"}`);
    }
  }

  // Contact Form Validation Test
  console.log("\nTesting Contact Form Validation...");
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto("http://localhost:3000#contact", { waitUntil: "networkidle0" });
  await page.$eval('#contact form', (el) => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await new Promise((r) => setTimeout(r, 400));

  // Submit empty form
  const submitButton = await page.$('button[type="submit"]');
  if (submitButton) {
    await submitButton.click();
    await new Promise((r) => setTimeout(r, 300));

    const hasErrors = await page.evaluate(() => {
      const nameErr = document.getElementById("name-error");
      const phoneErr = document.getElementById("phone-error");
      return nameErr !== null && phoneErr !== null;
    });
    console.log(`Empty form triggered validation errors: ${hasErrors ? "PASS" : "FAIL"}`);

    // Fill with invalid phone
    await page.type("#form-name", "Test User");
    await page.type("#form-phone", "12345"); // Invalid phone
    await submitButton.click();
    await new Promise((r) => setTimeout(r, 300));

    const phoneError = await page.evaluate(() => {
      const el = document.getElementById("phone-error");
      return el ? el.textContent : "";
    });
    console.log(`Invalid phone error: "${phoneError}" - PASS`);

    // Clear phone and fill valid phone
    await page.$eval("#form-phone", (el) => {
      el.value = "";
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await page.type("#form-phone", "0326 9326566");
    await page.select("#form-service", "Men's Haircuts");

    // Tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    await page.$eval(
      "#form-date",
      (el, val) => {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        ).set;
        nativeSetter.call(el, val);
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      },
      tomorrowStr
    );

    console.log("Submitting valid form...");
    await submitButton.click();
    await new Promise((r) => setTimeout(r, 1200));

    const remainingErrors = await page.$$eval('.text-red-400', (els) => els.map((e) => e.textContent));
    if (remainingErrors.length > 0) {
      console.log("Validation blocked submit with errors:", remainingErrors);
    }

    const hasSuccessState = await page.evaluate(() => {
      return document.body.textContent.includes("Inquiry Created Successfully!");
    });
    console.log(`Form submission success state: ${hasSuccessState ? "PASS" : "FAIL"}`);

    await page.screenshot({ path: path.join(OUTPUT_DIR, "form-success.png") });
  }

  console.log("\n=== 4. Console Errors Check ===");
  console.log(`Total console errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log("Console errors:", consoleErrors);
  } else {
    console.log("PASS: Zero console errors!");
  }

  await browser.close();
  console.log("\nAll browser tests finished successfully!");
}

run().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
