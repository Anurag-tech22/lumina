import re
import json

# 1. Update metadata.json
with open('metadata.json', 'r') as f:
    metadata = json.load(f)
metadata['name'] = "Vantage"
with open('metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

# 2. Update index.html
with open('index.html', 'r') as f:
    content = f.read()
content = content.replace('Hyperion', 'Vantage')
with open('index.html', 'w') as f:
    f.write(content)

# 3. Update src/pages/Login.tsx
with open('src/pages/Login.tsx', 'r') as f:
    content = f.read()
content = content.replace('Hyperion', 'Vantage')
with open('src/pages/Login.tsx', 'w') as f:
    f.write(content)

# 4. Update src/pages/Dashboard.tsx
with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()
content = content.replace('Hyperion', 'Vantage')
with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

# 5. Update README.md
with open('README.md', 'r') as f:
    content = f.read()
content = content.replace('Hyperion', 'Vantage')
content = content.replace('hyperion', 'vantage')
with open('README.md', 'w') as f:
    f.write(content)

print("Renaming to Vantage complete.")
