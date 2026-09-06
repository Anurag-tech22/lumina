with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="p-2.5 ml-0.5 rounded-lg text-slate-50 bg-slate-900 hover:bg-blue-600/80 disabled:opacity-30 disabled:bg-slate-900 transition-colors"',
    'className="p-2.5 ml-0.5 rounded-full text-white bg-slate-700 hover:bg-blue-600 disabled:opacity-30 disabled:bg-slate-700 transition-colors shadow-sm"'
)
content = content.replace(
    'className="p-2 rounded-lg text-red-600 hover:bg-red-400/10 transition-colors"',
    'className="p-2 rounded-full text-red-400 bg-red-950/30 hover:bg-red-900/50 transition-colors shadow-sm"'
)

# And fix the empty state to also be max-w-3xl
content = content.replace(
    'className="w-full mb-12"',
    'className="w-full max-w-3xl mb-12"'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
