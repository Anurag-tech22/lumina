import re

with open('src/pages/Login.tsx', 'r') as f:
    content = f.read()

content = content.replace('Gemini Clone', 'Reflect')
content = content.replace('Sparkles, Bot', 'BookOpen, Bot, Sparkles')
content = content.replace('<Sparkles className="w-4 h-4 text-white" />', '<BookOpen className="w-4 h-4 text-white" />')

with open('src/pages/Login.tsx', 'w') as f:
    f.write(content)
