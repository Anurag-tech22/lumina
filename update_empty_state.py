import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('<BrainCircuit className="w-8 h-8 text-blue-600 relative z-10" />', '<Fingerprint className="w-8 h-8 text-blue-600 relative z-10" strokeWidth={1.5} />')

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
