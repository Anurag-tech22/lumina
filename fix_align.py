with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '        "flex gap-4",\n        msg.role === \'user\' ? "flex-row-reverse" : "flex-row"\n      )}',
    '        "flex gap-4",\n        msg.role === \'user\' ? "flex-row-reverse" : "flex-row"\n      )}\n      style={{ width: "100%" }}'
)


with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
