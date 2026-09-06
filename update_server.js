const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

serverCode = serverCode.replace(
  /const formattedMessages = messages\.map[^;]+;/,
  `const formattedMessages = messages.map((m: any) => {
      const parts: any[] = [{ text: m.text || '' }];
      if (m.images && Array.isArray(m.images)) {
        for (const img of m.images) {
          if (img.base64 && img.mimeType) {
            parts.push({
              inlineData: {
                data: img.base64,
                mimeType: img.mimeType
              }
            });
          }
        }
      }
      return {
        role: m.role === 'user' ? 'user' : 'model',
        parts
      };
    }).filter((m: any) => m.parts.length > 0 && (m.parts[0].text || m.parts.length > 1));`
);

fs.writeFileSync('server.ts', serverCode);
