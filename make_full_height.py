with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<main className="flex-1 flex flex-col min-w-0 bg-slate-900">',
    '<main className="flex-1 flex flex-col min-w-0 bg-slate-900 relative">'
)

content = content.replace(
    'className="w-full max-w-4xl flex flex-col gap-6 md:gap-8 pb-8"',
    'className="w-full max-w-3xl flex flex-col gap-6 md:gap-8 pb-8"'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
