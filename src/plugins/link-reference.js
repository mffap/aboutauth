const path = require('path');
const fs = require('fs/promises');
const glob = require('glob');
const url = require('url');

/**
 * Custom Docusaurus Plugin to compile a list of all external links after the build.
 * It reads all generated HTML files and outputs a CSV report.
 * * @param {import('@docusaurus/types').LoadContext} context
 * @param {object} options
 * @returns {import('@docusaurus/types').Plugin}
 */
module.exports = function pluginExternalLinks(context, options) {
  // Access siteDir from the context provided when the plugin is initialized
  const { siteDir } = context;
  
  return {
    name: 'docusaurus-plugin-external-links',

    // The postBuild hook runs after all assets have been generated in outDir.
    async postBuild({ outDir, siteConfig }) {
      console.log('Starting external link compilation...');

      // Ensure we have a valid site URL for comparison
      if (!siteConfig.url) {
        console.warn('siteConfig.url is required for external link detection. Skipping plugin.');
        return;
      }
      
      const baseUrl = siteConfig.baseUrl;
      const originHost = new url.URL(siteConfig.url).host;

      /** @type {{cleanUrl: string, originalUrl: string, text: string, originPage: string}[]} */
      const externalLinks = [];

      // 1. Find all HTML files in the build directory
      // Using glob.sync is fine in a postBuild hook as it is not blocking the main build process.
      const htmlFiles = glob.sync(path.join(outDir, '**/*.html'));

      for (const filePath of htmlFiles) {
        try {
          const fileContent = await fs.readFile(filePath, 'utf-8');

          // Determine the referring page/origin URL
          let relativePath = filePath.replace(outDir, '').replace(/\\/g, '/');
          
          // Clean up base URL prefix if present
          if (relativePath.startsWith(baseUrl)) {
            relativePath = relativePath.substring(baseUrl.length);
          }
          
          // Clean up relative path for index files (e.g., 'guide/index.html' -> '/guide/')
          let originPagePath = relativePath.endsWith('index.html') 
            ? relativePath.replace('index.html', '') 
            : relativePath;

          if (!originPagePath.startsWith('/')) {
            originPagePath = '/' + originPagePath;
          }
          
          // Full URL for the referring page (essential for the report)
          const originPage = siteConfig.url + originPagePath;


          // Regex to find all <a> tags with an href attribute. 
          // WARNING: Robust HTML parsing requires a dedicated library (like Cheerio), 
          // but this simple regex is used here for a self-contained example.
          const linkRegex = /<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
          let match;

          while ((match = linkRegex.exec(fileContent)) !== null) {
            const originalUrl = match[1].trim();
            
            // Simple link text extraction. Strips internal HTML tags but keeps inner text.
            const rawLinkText = match[2].trim();
            const linkText = rawLinkText.replace(/<[^>]*>/g, '').trim() || originalUrl;

            // Check if it is an absolute link (http, https, or protocol-relative //)
            const isAbsolute = originalUrl.startsWith('http') || originalUrl.startsWith('//');

            if (isAbsolute) {
              try {
                // Add 'https:' prefix for protocol-relative links for proper parsing
                const fullUrl = originalUrl.startsWith('//') ? 'https:' + originalUrl : originalUrl;
                const parsedUrl = new url.URL(fullUrl);
                const linkHost = parsedUrl.host;

                // 2. Filter: Skip internal links (links pointing to the same host)
                if (linkHost && linkHost !== originHost) {
                  
                  // 3. Extract the clean URL (without parameters/fragments)
                  const cleanUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`;

                  // Escape quotes in link text for safe CSV writing
                  const safeLinkText = `"${linkText.replace(/"/g, '""')}"`;

                  externalLinks.push({
                    cleanUrl,
                    originalUrl,
                    text: safeLinkText,
                    originPage, 
                  });
                }
              } catch (e) {
                // Handle malformed URLs gracefully
                console.warn(`[Link Error] Could not parse URL: ${originalUrl} in ${originPagePath}.`);
              }
            }
          }
        } catch (e) {
          console.error(`Error processing file ${filePath}: ${e.message}`);
        }
      }

      // 4. Write the results to a CSV file in the new path (project root)
      const reportContent = externalLinks.map(link => 
        // Format: Clean URL, Original Link URL, Link Text, Referring Page/Origin
        `${link.cleanUrl},${link.originalUrl},${link.text},${link.originPage}`
      ).join('\n');

      const csvHeader = 'Clean URL,Original URL,Link Text,Referring Page\n';
      const outputFilename = 'external_links_report.csv';
      
      // Define the new output directory (.aboutauth inside the project root: siteDir)
      const outputDir = path.join(siteDir, '.aboutauth');
      const outputPath = path.join(outputDir, outputFilename);

      // Create the directory recursively if it doesn't exist
      await fs.mkdir(outputDir, { recursive: true });

      await fs.writeFile(outputPath, csvHeader + reportContent);
      console.log(`\n✅ External link compilation finished. Report saved to: .aboutauth/${outputFilename}`);
    },
  };
};