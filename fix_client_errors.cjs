const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  /text: \`\[System Error\]: \$\{error\.message \|\| 'Failed to generate response\.'\}\`,/g,
  `text: \`[System Error]: \${error.message?.includes("429") || error.message?.includes("Too many") || error.message?.includes("requests") ? "I am currently receiving too many requests. Please try again in a moment." : "Failed to generate response. Please try again later."}\`,`
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
