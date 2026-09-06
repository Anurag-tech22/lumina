with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Fix max-width of message bubbles and container layout
content = content.replace(
    'className="flex flex-col gap-4 max-w-4xl mx-auto"',
    'className="flex flex-col gap-6 max-w-4xl mx-auto w-full"'
)

# In case old_user_bubble wasn't caught due to formatting
content = content.replace(
    '"group relative max-w-[85%] rounded-[24px] px-6 py-4 text-[15px] leading-relaxed transition-all",',
    '"group relative rounded-[24px] px-1 md:px-4 py-4 text-[15px] leading-relaxed transition-all",',
)
content = content.replace(
    'msg.role === \'user\' \n          ? "bg-blue-600 text-white rounded-br-sm shadow-sm shadow-black/50" \n          : "bg-transparent text-slate-50"',
    'msg.role === \'user\' \n          ? "bg-blue-600 text-white rounded-3xl rounded-br-sm shadow-sm shadow-black/50 ml-auto max-w-[85%] md:max-w-[75%] px-6" \n          : "bg-transparent text-slate-50 w-full max-w-full"'
)
content = content.replace(
    'msg.role === \'user\' \n          ? "bg-blue-600 text-white rounded-br-sm shadow-sm shadow-black/50" \n          : "bg-transparent text-slate-50 w-full max-w-full"',
    'msg.role === \'user\' \n          ? "bg-blue-600 text-white rounded-3xl rounded-br-sm shadow-sm shadow-black/50 ml-auto max-w-[85%] md:max-w-[75%] px-6" \n          : "bg-transparent text-slate-50 w-full max-w-full"'
)


# Format markdown width and styling
old_markdown = 'className="prose prose-p:text-white prose-li:text-white prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 max-w-none prose-a:text-blue-400 prose-strong:text-white prose-headings:font-medium prose-headings:text-white text-white"'
new_markdown = 'className="prose prose-p:text-white prose-li:text-white prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:w-full prose-pre:overflow-x-auto max-w-full prose-a:text-blue-400 prose-strong:text-white prose-headings:font-medium prose-headings:text-white text-white"'
content = content.replace(old_markdown, new_markdown)

# Fix input area centering and width
content = content.replace(
    'className="p-4 md:p-6 bg-[#131314]"',
    'className="p-4 md:p-6 bg-slate-900 flex justify-center"'
)
content = content.replace(
    '<div className="max-w-4xl mx-auto relative">',
    '<div className="w-full max-w-4xl relative">'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
