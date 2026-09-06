with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '        {msg.role === \'model\' && msg.text && (',
    '        {msg.role === \'model\' && msg.text && (\n          <div className="flex w-full justify-start mt-2 ml-1 opacity-0 group-hover:opacity-100 transition-opacity gap-2">'
)
content = content.replace(
    '          <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">\n            <button',
    '            <button'
)


with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
