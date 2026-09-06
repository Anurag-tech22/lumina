with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# For the AI messages, ensure the pre block doesn't force a weird padding layout
content = content.replace(
    'prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700',
    'prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:m-0 prose-pre:mt-4 prose-pre:mb-4'
)

# And remove the blue bubble from the model since ChatGPT just uses transparent background
content = content.replace(
    'bg-transparent text-slate-50 w-full max-w-full',
    'bg-transparent text-slate-50 w-full max-w-full py-2'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
