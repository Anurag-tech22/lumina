import re

files_to_update = ['src/pages/Login.tsx', 'src/pages/Dashboard.tsx']

for filepath in files_to_update:
    with open(filepath, 'r') as f:
        content = f.read()

    # Update imports
    content = content.replace('Fingerprint', 'Origami')
    
    with open(filepath, 'w') as f:
        f.write(content)
