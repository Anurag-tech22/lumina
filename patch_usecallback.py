import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add useCallback to imports if not there
if 'useCallback' not in content:
    content = content.replace("useState, useEffect, useRef", "useState, useEffect, useRef, useCallback")

# Wrap showError
content = content.replace(
    "const showError = (message: string) => {",
    "const showError = React.useCallback((message: string) => {"
)
# Note: we need to find the closing brace for showError, but it's small, let's just use regex
content = re.sub(
    r"(const showError = React\.useCallback\(\(message: string\) => {.*?setToastError\(message\);\n\s*setTimeout\(\(\) => setToastError\(null\), 5000\);\n\s*})(\n)",
    r"\1}, []);\2",
    content,
    flags=re.DOTALL
)

# Wrap playAudio
# Since playAudio uses `speakingMessageId`, `preferredLang`, we need to add them to dependencies
content = content.replace(
    "const playAudio = (text: string, messageId: string) => {",
    "const playAudio = React.useCallback((text: string, messageId: string) => {"
)
# Finding the end of playAudio is tricky. It's around line 208
# Let's find: `};` just before `  const stopAudio = () => {`
content = re.sub(
    r"(const playAudio = React\.useCallback\(\(text: string, messageId: string\) => {.*?)(  const stopAudio = \(\) => {)",
    r"\1}, [speakingMessageId, preferredLang]);\n\2",
    content,
    flags=re.DOTALL
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Added useCallback")
