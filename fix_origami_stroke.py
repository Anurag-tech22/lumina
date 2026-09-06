import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('<Origami className="w-4 h-4 text-white" strokeWidth={2.5} />', '<Origami className="w-4 h-4 text-white" strokeWidth={2} />')
content = content.replace('<Origami className="w-4 h-4 text-blue-600 animate-pulse" />', '<Origami className="w-4 h-4 text-blue-600 animate-pulse" strokeWidth={1.5} />')
content = content.replace('<Origami className="w-4 h-4 text-blue-600" />', '<Origami className="w-4 h-4 text-blue-600" strokeWidth={1.5} />')

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

with open('src/pages/Login.tsx', 'r') as f:
    content = f.read()

content = content.replace('<Origami className="w-4 h-4 text-white" />', '<Origami className="w-4 h-4 text-white" strokeWidth={1.5} />')

with open('src/pages/Login.tsx', 'w') as f:
    f.write(content)
