import re

with open('server.ts', 'r') as f:
    content = f.read()

# Fix /api/chat
chat_repl = """    const aiOptions: any = {
      contents: formattedMessages,
      config: {
        systemInstruction: `You are a highly intelligent, genuine, and supportive personal AI guide. Your purpose is to help the user in every situation they face. Explain concepts smartly and clearly, offer practical and wise guidance, and always respond with authenticity and care. Tailor your tone to be a deeply trusted, insightful, and highly capable mentor. ${systemLanguageInstruction}`,
      }
    };

    if (useDeepSearch) {
      aiOptions.config.tools = [{ googleSearch: {} }];
      aiOptions.model = 'gemini-3.5-flash';
    }"""
content = re.sub(r'const aiOptions: any = \{\s*contents: formattedMessages,\s*systemInstruction: `.*?`,\s*\};\s*if \(useDeepSearch\) \{\s*aiOptions\.tools = \[\{ googleSearch: \{\} \}\];\s*aiOptions\.model = \'gemini-3\.5-flash\';\s*\}', chat_repl, content, flags=re.DOTALL)

# Fix /api/research
res_repl = """    const stream = generateContentStreamWithFallback({
      model: 'gemini-3.5-flash',
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });"""
content = re.sub(r'const stream = generateContentStreamWithFallback\(\{\s*model: \'gemini-3\.5-flash\',\s*contents: fullPrompt,\s*// @ts-ignore\s*tools: \[\{ googleSearch: \{\} \}\]\s*\}\);', res_repl, content, flags=re.DOTALL)

# Fix /api/prism
prism_repl = """    const stream = generateContentStreamWithFallback({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction
      }
    });"""
content = re.sub(r'const stream = generateContentStreamWithFallback\(\{\s*model: \'gemini-3\.6-flash\',\s*contents: prompt,\s*// @ts-ignore\s*systemInstruction\s*\}\);', prism_repl, content, flags=re.DOTALL)

with open('server.ts', 'w') as f:
    f.write(content)
