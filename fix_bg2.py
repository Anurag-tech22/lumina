with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('<div className="p-4 md:p-6 bg-white relative z-20">', '<div className="p-4 md:p-6 bg-slate-50 relative z-20">')

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
