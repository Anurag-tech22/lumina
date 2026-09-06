import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('"Ask Gemini..."', '"Ask Reflect..."')
content = content.replace("'Gemini'", "'Reflect'")

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
