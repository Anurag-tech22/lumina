with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Fix AI response text color which is still rendering dark
content = content.replace(
    '<ReactMarkdown rehypePlugins={[rehypeRaw]}>{msg.text || "..."}</ReactMarkdown>',
    '<div className="text-white"><ReactMarkdown rehypePlugins={[rehypeRaw]}>{msg.text || "..."}</ReactMarkdown></div>'
)

# And fix any leftover slate-900 in prose
content = content.replace(
    'prose-strong:text-slate-900',
    'prose-strong:text-white'
)
content = content.replace(
    'prose-headings:text-slate-900',
    'prose-headings:text-white'
)
content = content.replace(
    'prose-headings:font-medium prose-headings:text-slate-50',
    'prose-headings:font-medium prose-headings:text-white text-white'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
