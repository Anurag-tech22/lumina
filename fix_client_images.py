with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

old_fetch = """            body: JSON.stringify({ prompt: currentInput, persona: personaId })"""
new_fetch = """            body: JSON.stringify({ 
              prompt: currentInput, 
              persona: personaId,
              image: currentImage ? { base64: currentImage.base64, mimeType: currentImage.mimeType } : undefined
            })"""

content = content.replace(old_fetch, new_fetch)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
