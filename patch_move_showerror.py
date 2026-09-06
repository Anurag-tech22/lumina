with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Extract showError block
import re
match = re.search(r'(  const showError = React\.useCallback\(\(message: string\) => \{\n    setToastError\(message\);\n    setTimeout\(\(\) => setToastError\(null\), 5000\);\n  \}, \[\]\);\n)', content)

if match:
    show_error_block = match.group(1)
    # Remove it from its current position
    content = content.replace(show_error_block, "")
    
    # Insert it right after the interactionMode state (around line 90)
    insert_point = content.find("const [interactionMode, setInteractionMode] = useState")
    insert_point = content.find("\n", insert_point) + 1
    
    content = content[:insert_point] + "\n" + show_error_block + content[insert_point:]
    
    with open('src/pages/Dashboard.tsx', 'w') as f:
        f.write(content)
    print("Moved showError")
else:
    print("Could not find showError block")

