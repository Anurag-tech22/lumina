const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// 1. Remove franc-min
code = code.replace("import { franc } from 'franc-min';\n", "");
code = code.replace(/const ISO6393_TO_ISO6391[^;]+;\n/, "");

// 2. Add language state
code = code.replace(
  "const [attachedImage, setAttachedImage]",
  "const [preferredLang, setPreferredLang] = useState(navigator.language || 'en-US');\n  const [attachedImage, setAttachedImage]"
);

// 3. Update Speech Recognition
code = code.replace(
  /recognitionRef\.current\.lang = '';.*\n/,
  "recognitionRef.current.lang = preferredLang;\n"
);
code = code.replace(
  "  }, []);",
  "  }, [preferredLang]);"
);

// 4. Update playAudio
code = code.replace(
  /\/\/ Auto-detect language[\s\S]*?utterance\.lang = detected2;/,
  "utterance.lang = preferredLang;"
);
code = code.replace(
  /const targetVoice = voices\.find\(v => v\.lang\.startsWith\(detected2\)[^;]+;/,
  "const targetVoice = voices.find(v => v.lang.startsWith(preferredLang.split('-')[0]) && v.name.includes('Google')) || voices.find(v => v.lang.startsWith(preferredLang.split('-')[0]));"
);

// 5. Add language selector in UI
// Find the mic button and inject the selector before it
const micButtonRegex = /<button[^>]+onClick=\{toggleListen\}[^>]+>[\s\S]*?<\/button>/;
const selectorHTML = `
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value)}
                  className="bg-transparent text-[#c4c7c5] hover:text-[#e3e3e3] border-none text-xs focus:ring-0 cursor-pointer appearance-none rounded-full px-2 outline-none transition-colors"
                  title="Spoken Language"
                >
                  <option value="en-US">English</option>
                  <option value="hi-IN">Hindi</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                  <option value="zh-CN">Chinese</option>
                  <option value="ja-JP">Japanese</option>
                  <option value="ar-SA">Arabic</option>
                  <option value="ru-RU">Russian</option>
                </select>
                `;

code = code.replace(
  /(<button[^>]+onClick=\{toggleListen\}[^>]+>)/,
  selectorHTML + "$1"
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
