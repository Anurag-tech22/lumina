import re

with open('server.ts', 'r') as f:
    content = f.read()

# Fix the /api/chat model selection
replacement_chat = """    if (useDeepSearch) {
      aiOptions.tools = [{ googleSearch: {} }];
      aiOptions.model = 'gemini-3.5-flash';
    }"""
content = content.replace("""    if (useDeepSearch) {
      aiOptions.tools = [{ googleSearch: {} }];
    }""", replacement_chat)

# Fix the /api/research endpoint
replacement_research = """    const stream = generateContentStreamWithFallback({
      model: 'gemini-3.5-flash',
      contents: fullPrompt,
      // @ts-ignore
      tools: [{ googleSearch: {} }]
    });"""
content = re.sub(r'const stream = generateContentStreamWithFallback\(\{\s*model: \'gemini-2\.5-pro\',\s*contents: fullPrompt,\s*// @ts-ignore\s*tools: \[\{ googleSearch: \{\} \}\]\s*\}\);', replacement_research, content)

with open('server.ts', 'w') as f:
    f.write(content)
