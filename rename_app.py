import os

replacements = {
    'Vantage': 'Lumina'
}

files_to_update = [
    'metadata.json',
    'index.html',
    'src/pages/Dashboard.tsx',
    'src/pages/Login.tsx'
]

for file_path in files_to_update:
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            content = f.read()
        
        for old_val, new_val in replacements.items():
            content = content.replace(old_val, new_val)
            
        with open(file_path, 'w') as f:
            f.write(content)

