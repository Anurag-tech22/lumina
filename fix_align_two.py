with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '        "flex gap-4",\n        msg.role === \'user\' ? "justify-end" : "justify-start"',
    '        "flex gap-4",\n        msg.role === \'user\' ? "flex-row-reverse" : "flex-row"'
)


with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
