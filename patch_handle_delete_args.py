import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Make it a useCallback taking just sessionId
content = re.sub(
    r"const handleDeleteSession = async \(e: React\.MouseEvent, sessionId: string\) => \{\s*e\.stopPropagation\(\);",
    r"const handleDeleteSession = React.useCallback(async (sessionId: string) => {",
    content
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
