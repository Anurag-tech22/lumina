with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="relative flex-1 overflow-y-auto px-4 py-8 pb-40 md:px-8 flex flex-col items-center" ref={messagesContainerRef}>',
    '<div className="relative flex-1 overflow-y-auto px-4 py-8 pb-40 md:px-8 flex flex-col items-center">'
)


with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
