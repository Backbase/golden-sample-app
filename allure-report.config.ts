export const allureConfig = {
  detail: false,
  resultsDir: process.env['OUTPUT_DIR'] ?? 'reports/allure-results',
  suiteTitle: true,
  links: {
    issue: {
      nameTemplate: "Issue #%s",
      urlTemplate: "https://golden-sample-app.com/jira/browse/%s",
    },
  },
}
