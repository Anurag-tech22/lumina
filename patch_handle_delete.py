import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Wrap handleDeleteSession
content = content.replace(
    "const handleDeleteSession = async (sessionId: string) => {",
    "const handleDeleteSession = React.useCallback(async (sessionId: string) => {"
)
content = re.sub(
    r"(const handleDeleteSession = React\.useCallback\(async \(sessionId: string\) => {.*?showError\(\"Failed to delete session\.\"\);\n\s*}\n\s*})(\n)",
    r"\1}, [user, activeSessionId, showError]);\n",
    content,
    flags=re.DOTALL
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Patched handleDeleteSession")
