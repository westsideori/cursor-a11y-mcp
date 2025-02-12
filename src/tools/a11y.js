import puppeteer from 'puppeteer';
import { z } from 'zod';

/**
 * A11y tool
 *   - Takes in either "url" (a full URL) or "relativePath" to open on localhost:5000
 *   - Returns accessibility violations found using axe-core
 */
export const a11yToolName = 'a11y';
export const a11yToolDescription =
  'Run accessibility tests on a URL or a local path (relative URL appended to http://localhost:5000).';

export const A11yToolSchema = z.object({
  url: z.string().optional(),
  relativePath: z.string().optional(),
});

export async function runA11yTool(args) {
  // Determine final URL
  let finalUrl = args.url;
  if (!finalUrl) {
    if (!args.relativePath) {
      throw new Error("Must provide either 'url' or 'relativePath'");
    }
    finalUrl = `http://localhost:5000/${args.relativePath.replace(/^\//, '')}`;
  }

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();

  // Navigate to URL
  await page.goto(finalUrl);

  // Inject and run axe-core
  await page.addScriptTag({
    url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js',
  });

  // Run axe
  const results = await page.evaluate(() => {
    return new Promise((resolve) => {
      axe.run((err, results) => {
        if (err) throw err;
        resolve(results);
      });
    });
  });

  await browser.close();

  // Format results for output
  const violations = results.violations.map((violation) => ({
    impact: violation.impact,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.map((node) => ({
      html: node.html,
      failureSummary: node.failureSummary,
      target: node.target,
    })),
  }));

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            violationCount: violations.length,
            violations: violations,
          },
          null,
          2
        ),
      },
    ],
  };
}
