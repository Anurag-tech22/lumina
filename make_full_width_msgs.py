with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Make the outer container max-width wider to match standard ChatGPT UI
content = content.replace(
    'className="w-full max-w-3xl flex flex-col gap-6 md:gap-8 pb-8"',
    'className="w-full max-w-4xl flex flex-col gap-6 md:gap-8 pb-8"'
)

content = content.replace(
    '<div className="w-full max-w-3xl relative">',
    '<div className="w-full max-w-4xl relative">'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
