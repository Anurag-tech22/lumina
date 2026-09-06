with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Make the chat messages container strictly centered and capped at 4xl
content = content.replace(
    '<div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 scroll-smooth" ref={messagesContainerRef}>',
    '<div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center scroll-smooth" ref={messagesContainerRef}>'
)

# Replace the inner message map container
content = content.replace(
    '{messages.map((msg, idx) => (',
    '<div className="w-full max-w-4xl flex flex-col gap-6 md:gap-8 pb-8">\n            {messages.map((msg, idx) => ('
)

content = content.replace(
    'isGenerating && <div className="text-slate-400 text-sm animate-pulse ml-12">Generating...</div>',
    'isGenerating && <div className="text-slate-400 text-sm animate-pulse ml-12">Generating...</div>\n          </div>'
)


with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
