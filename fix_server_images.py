with open('server.ts', 'r') as f:
    content = f.read()

# Fix /api/research to use formattedMessages
research_old = """    const prompt = data.prompt || "Research this topic.";
    let historyContext = "";
    if (messages.length > 0) {
      historyContext = "Conversation History:\\n" + messages.map((m: any) => `${m.role.toUpperCase()}: ${m.text}`).join("\\n") + "\\n\\n";
    }
    const fullPrompt = historyContext + "Current Request:\\n" + prompt;

    if (!ai) throw new Error("Gemini AI client not initialized.");
    
    const stream = generateContentStreamWithFallback({
      model: 'gemini-3.6-flash',
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });"""

research_new = """    if (!ai) throw new Error("Gemini AI client not initialized.");
    
    const formattedMessages = messages.map((m: any) => {
      const parts: any[] = [{ text: m.text || '' }];
      if (m.images && Array.isArray(m.images)) {
        for (const img of m.images) {
          if (img.base64 && img.mimeType) {
            parts.push({
              inlineData: {
                data: img.base64,
                mimeType: img.mimeType
              }
            });
          }
        }
      }
      return {
        role: m.role === 'user' ? 'user' : 'model',
        parts
      };
    });
    
    if (formattedMessages.length === 0) {
        formattedMessages.push({ role: 'user', parts: [{ text: data.prompt || "Research this topic." }] });
    }

    const stream = generateContentStreamWithFallback({
      model: 'gemini-3.6-flash',
      contents: formattedMessages,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });"""

content = content.replace(
"""    const prompt = data.prompt || "Research this topic.";
    let historyContext = "";
    if (messages.length > 0) {
      historyContext = "Conversation History:\\n" + messages.map((m: any) => `${m.role.toUpperCase()}: ${m.text}`).join("\\n") + "\\n\\n";
    }
    const fullPrompt = historyContext + "Current Request:\\n" + prompt;

    if (!ai) throw new Error("Gemini AI client not initialized.");
    
    const stream = generateContentStreamWithFallback({
      model: 'gemini-3.5-flash',
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });""", research_new)

# Fix /api/prism to accept image
prism_old = """    const { prompt, persona } = data;
    if (!prompt) return res.status(400).json({ error: "Prompt is required." });"""

prism_new = """    const { prompt, persona, image } = data;
    if (!prompt) return res.status(400).json({ error: "Prompt is required." });
    
    const parts: any[] = [{ text: prompt }];
    if (image && image.base64 && image.mimeType) {
        parts.push({ inlineData: { data: image.base64, mimeType: image.mimeType } });
    }"""

content = content.replace(prism_old, prism_new)

prism_call_old = """    const stream = generateContentStreamWithFallback({
      model: 'gemini-3.6-flash',
      contents: prompt,"""

prism_call_new = """    const stream = generateContentStreamWithFallback({
      model: 'gemini-3.6-flash',
      contents: parts,"""

content = content.replace(prism_call_old, prism_call_new)

with open('server.ts', 'w') as f:
    f.write(content)
