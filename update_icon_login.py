import re

with open('src/pages/Login.tsx', 'r') as f:
    content = f.read()

content = content.replace('BookOpen, Bot, Sparkles', 'Fingerprint, Bot, Sparkles')
content = content.replace('<BookOpen className="w-4 h-4 text-white" />', '<Fingerprint className="w-4 h-4 text-white" />')

with open('src/pages/Login.tsx', 'w') as f:
    f.write(content)
