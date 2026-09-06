with open('server.ts', 'r') as f:
    content = f.read()

# Replace the default model in the fallback arrays to prioritize gemini-3.1-flash-lite for maximum speed
content = content.replace('["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"]', '["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-flash-latest", "gemini-3.7-flash"]')

with open('server.ts', 'w') as f:
    f.write(content)
