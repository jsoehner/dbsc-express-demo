const fs = require('fs');

let allFindings = [];

// Parse Gitleaks
if (fs.existsSync('gitleaks-report.json')) {
  try {
    const raw = fs.readFileSync('gitleaks-report.json', 'utf8');
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      for (const result of data) {
        allFindings.push({
          tool: 'Gitleaks',
          file: `${result.File}:${result.StartLine}`,
          description: `Secret detected: ${result.Description}`,
          severity: 'CRITICAL'
        });
      }
    }
  } catch (e) {
    console.error('Error parsing Gitleaks report:', e);
  }
}

// Parse Semgrep
if (fs.existsSync('semgrep-results.json')) {
  try {
    const raw = fs.readFileSync('semgrep-results.json', 'utf8');
    const data = JSON.parse(raw);
    if (data.results && Array.isArray(data.results)) {
      for (const result of data.results) {
        allFindings.push({
          tool: 'Semgrep',
          file: `${result.path}:${result.start.line}`,
          description: result.extra.message,
          severity: result.extra.severity || 'HIGH'
        });
      }
    }
  } catch (e) {
    console.error('Error parsing Semgrep report:', e);
  }
}

// Parse Trivy
if (fs.existsSync('trivy-results.json')) {
  try {
    const raw = fs.readFileSync('trivy-results.json', 'utf8');
    const data = JSON.parse(raw);
    if (data.Results && Array.isArray(data.Results)) {
      for (const result of data.Results) {
        if (result.Vulnerabilities && Array.isArray(result.Vulnerabilities)) {
          for (const vuln of result.Vulnerabilities) {
            allFindings.push({
              tool: 'Trivy',
              file: result.Target || 'Unknown',
              description: `${vuln.VulnerabilityID}: ${vuln.Title || vuln.PkgName}`,
              severity: vuln.Severity || 'HIGH'
            });
          }
        }
      }
    }
  } catch (e) {
    console.error('Error parsing Trivy report:', e);
  }
}

if (allFindings.length > 0) {
  let mdTable = `| Tool | File | Severity | Description |\n`;
  mdTable += `|------|------|----------|-------------|\n`;
  for (const f of allFindings) {
    // Escape pipes to not break markdown table
    const safeDesc = f.description ? f.description.replace(/\|/g, '-') : 'N/A';
    mdTable += `| ${f.tool} | \`${f.file}\` | ${f.severity} | ${safeDesc} |\n`;
  }
  
  fs.writeFileSync('findings-table.md', mdTable);
  console.log('Successfully generated findings-table.md');
} else {
  console.log('No findings to parse or all reports missing/empty.');
}
