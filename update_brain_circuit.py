import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Replace in loading indicator
content = content.replace('<BrainCircuit className="w-4 h-4 text-blue-600 animate-pulse" />', '<Fingerprint className="w-4 h-4 text-blue-600 animate-pulse" />')

# Replace in message avatar
content = content.replace('<BrainCircuit className="w-4 h-4 text-blue-600" />', '<Fingerprint className="w-4 h-4 text-blue-600" />')

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
