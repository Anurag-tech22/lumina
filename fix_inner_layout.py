with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()


old_wrapper = '        {/* Chat Area */}\n        <div className="relative flex-1 overflow-y-auto px-4 py-8 md:px-8">'
new_wrapper = '        {/* Chat Area */}\n        <div className="relative flex-1 overflow-y-auto px-4 py-8 md:px-8 flex flex-col items-center" ref={messagesContainerRef}>'
content = content.replace(old_wrapper, new_wrapper)

old_inner = '                  </div>\n                </div>\n              ) : (\n                messages.map((msg) => ('
new_inner = '                  </div>\n                </div>\n              ) : (\n                <div className="w-full max-w-4xl flex flex-col gap-6 md:gap-8 pb-8">\n                  {messages.map((msg) => ('
content = content.replace(old_inner, new_inner)

content = content.replace(
    '<div ref={messagesEndRef} />\n            </div>',
    '<div ref={messagesEndRef} />\n                </div>\n            </div>'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
