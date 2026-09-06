import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'showError\("Failed to delete session\."\);\s*}\s*};',
    r'showError("Failed to delete session.");\n    }\n  }, [user, activeSessionId, showError]);',
    content
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

