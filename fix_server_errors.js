const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Update error handling in generateContentWithFallback
code = code.replace(
  /const statusCode = error\.status[\s\S]*?if \(statusStr\.includes\("400"\) \|\| statusStr\.includes\("403"\) \|\| statusStr\.includes\("404"\)\) \{\s*throw error;\s*\}/g,
  `let statusStr = String(error.status || error.code || (error.response && error.response.status) || "");
      if (!statusStr && error.message) {
        if (error.message.includes('"code": 400')) statusStr = "400";
        if (error.message.includes('"code": 403')) statusStr = "403";
        if (error.message.includes('"code": 404')) statusStr = "404";
        if (error.message.includes('"code": 429')) statusStr = "429";
        if (error.message.includes('"code": 503')) statusStr = "503";
      }
      
      if (!statusStr.includes("503") && !statusStr.toLowerCase().includes("unavailable") && !statusStr.includes("429")) {
        console.log(\`[Fallback Triggered] Model \${model} failed. Error:\`, error.message.substring(0, 200));
      }
      
      if (statusStr.includes("400") || statusStr.includes("403") || statusStr.includes("404")) {
        throw error;
      }`
);

// Update error handling in generateContentStreamWithFallback
code = code.replace(
  /const statusCode = error\.status[\s\S]*?if \(statusStr\.includes\("400"\) \|\| statusStr\.includes\("403"\) \|\| statusStr\.includes\("404"\)\) \{\s*throw error;\s*\}/g,
  `let statusStr = String(error.status || error.code || (error.response && error.response.status) || "");
      if (!statusStr && error.message) {
        if (error.message.includes('"code": 400')) statusStr = "400";
        if (error.message.includes('"code": 403')) statusStr = "403";
        if (error.message.includes('"code": 404')) statusStr = "404";
        if (error.message.includes('"code": 429')) statusStr = "429";
        if (error.message.includes('"code": 503')) statusStr = "503";
      }
      
      if (!statusStr.includes("503") && !statusStr.toLowerCase().includes("unavailable") && !statusStr.includes("429")) {
        console.log(\`[Fallback Triggered] Model \${model} stream failed. Error:\`, error.message.substring(0, 200));
      }
      
      if (statusStr.includes("400") || statusStr.includes("403") || statusStr.includes("404")) {
        throw error;
      }`
);

// Clean up the error returned by the server endpoints
code = code.replace(
  /res\.status\(500\)\.json\(\{ error: "Failed to generate content: " \+ error\.message \}\);/g,
  `let cleanMessage = "An unexpected error occurred.";
      if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
        cleanMessage = "I am currently receiving too many requests. Please try again in a few seconds.";
      } else if (error.message?.includes("403")) {
        cleanMessage = "Access denied. Please check API key permissions.";
      } else {
        cleanMessage = "Failed to generate response. Please try again.";
      }
      res.status(500).json({ error: cleanMessage });`
);

code = code.replace(
  /res\.status\(500\)\.json\(\{ error: "Failed to generate insights: " \+ error\.message \}\);/g,
  `let cleanMessage = "An unexpected error occurred.";
      if (error.message?.includes("429") || error.message?.includes("RESOURCE_EXHAUSTED")) {
        cleanMessage = "I am currently receiving too many requests. Please try again in a few seconds.";
      }
      res.status(500).json({ error: cleanMessage });`
);

fs.writeFileSync('server.ts', code);
