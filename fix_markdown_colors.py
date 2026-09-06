with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Make absolutely sure all prose text is white
old_prose = 'className="prose  prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 max-w-none prose-a:text-blue-600 prose-strong:text-slate-50 prose-headings:font-medium prose-headings:text-white text-white"'
new_prose = 'className="prose prose-p:text-white prose-li:text-white prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 max-w-none prose-a:text-blue-400 prose-strong:text-white prose-headings:font-medium prose-headings:text-white text-white"'
content = content.replace(old_prose, new_prose)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
