with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="p-4 md:p-6 bg-slate-950 relative z-20"',
    'className="p-4 md:pb-8 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent flex justify-center fixed bottom-0 left-0 md:left-64 right-0 z-20"'
)

content = content.replace(
    '<div className="max-w-3xl mx-auto relative">',
    '<div className="w-full max-w-3xl relative">'
)

content = content.replace(
    'className="relative flex-1 overflow-y-auto px-4 py-8 md:px-8 flex flex-col items-center"',
    'className="relative flex-1 overflow-y-auto px-4 py-8 pb-40 md:px-8 flex flex-col items-center"'
)


with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
