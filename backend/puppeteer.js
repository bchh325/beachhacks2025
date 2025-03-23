const puppeteer = require("puppeteer");
const fs = require("fs");

/**
 * Polls the given selector for text changes.
 * Resolves when the text remains unchanged for stableTime milliseconds.
 *
 * @param {Page} page - Puppeteer's page instance.
 * @param {string} selector - The selector for the response container.
 * @param {number} stableTime - Time in ms for which the response must remain unchanged.
 * @param {number} pollInterval - How often to check (in ms).
 * @returns {Promise<string>} - The stable text content.
 */
async function waitForStableResponse(page, selector, stableTime = 3000, pollInterval = 500) {
  let lastText = "";
  let unchangedTime = 0;
  
  while (true) {
    try {
      const newText = await page.$eval(selector, el => el.innerText);
      if (newText === lastText) {
        unchangedTime += pollInterval;
      } else {
        lastText = newText;
        unchangedTime = 0;
      }
      
      if (unchangedTime >= stableTime) {
        return lastText;
      }
    } catch (e) {
      // The element might not be present yet.
      unchangedTime = 0;
    }
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
}

(async () => {
  try {
    // Connect to the running Chromium instance.
    const browser = await puppeteer.connect({
      browserURL: "http://localhost:9222",
    });
    const page = await browser.newPage();

    // Log page console messages.
    page.on("console", (msg) => {
      console.log("PAGE LOG:", msg.text());
    });

    console.log("Navigating to Butterfly homepage...");
    await page.goto("https://beachhacks-assistant.dain.org/", { waitUntil: "networkidle2" });
    console.log("Page loaded.");

    // (Optional) Take an initial screenshot.
    await page.screenshot({ path: "initial_debug.png", fullPage: true });

    // Check if logged in.
    const loggedIn = await page.evaluate(() => Boolean(document.querySelector("button.logout")));
    if (!loggedIn) {
      console.log("User is NOT logged in. Please log in manually in the connected browser.");
    }

    // Wait for the textarea.
    const textAreaSelector = 'textarea[placeholder="Analyze and summarize this research paper..."]';
    console.log("Waiting for the target textarea using selector:", textAreaSelector);
    await page.waitForSelector(textAreaSelector, { timeout: 30000 });
    console.log("Textarea found.");

    // Clear and type in the textarea.
    await page.focus(textAreaSelector);
    await page.evaluate((selector) => {
      const ta = document.querySelector(selector);
      if (ta) {
        ta.value = "";
        const event = new Event("input", { bubbles: true });
        ta.dispatchEvent(event);
      }
    }, textAreaSelector);
    const message = "Hello from Puppeteer via direct DOM modification!";
    console.log("Typing message:", message);
    await page.type(textAreaSelector, message, { delay: 100 });
    console.log("Message typed.");

    // Wait for the submit button and click it.
    const sendButtonSelector = 'button[type="submit"]';
    console.log("Waiting for the submit button using selector:", sendButtonSelector);
    await page.waitForSelector(sendButtonSelector, { timeout: 10000 });
    console.log("Submit button found, clicking it...");
    await page.click(sendButtonSelector);

    // Wait for the response container to appear.
    const responseSelector = ".mdx";
    console.log("Waiting for AI response using selector:", responseSelector);
    await page.waitForSelector(responseSelector, { timeout: 15000 });
    console.log("Response container found. Waiting for stable response...");

    // Poll for a stable response.
    const finalResponse = await waitForStableResponse(page, responseSelector, 3000, 500);
    console.log("Stable final response:", finalResponse);

    // Store the full HTML of the response container.
    const fullResponseHTML = await page.$eval(responseSelector, el => el.outerHTML);
    fs.writeFileSync("full_response.html", fullResponseHTML, "utf8");
    console.log("Full response HTML saved as full_response.html");

    // Also save a screenshot of the response.
    await page.screenshot({ path: "response.png", fullPage: true });
    console.log("Screenshot of response saved as response.png");

    // Wait for a few seconds for manual inspection.
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log("Automation script finished.");
  } catch (error) {
    console.error("Error during automation:", error);
  }
})();
