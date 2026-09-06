with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Fix invisible text in chat bubbles
# The model messages use "prose-strong:text-slate-50 prose-headings:text-slate-50 text-slate-100" but the parent div has wrong classes
# Let's completely rewrite the message text rendering to force it to be bright white.
content = content.replace(
    'className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#1e1f20] prose-pre:border prose-pre:border-[#444746] max-w-none text-[#e3e3e3] prose-headings:text-[#e3e3e3] prose-a:text-[#a8c7fa] prose-strong:text-[#e3e3e3] prose-code:text-[#a8c7fa]"',
    'className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 max-w-none text-slate-100 prose-headings:text-white prose-strong:text-white prose-a:text-blue-400 prose-code:text-blue-200"'
)

# Fix user message bubble text
content = content.replace(
    'className="px-5 py-3.5 rounded-2xl bg-slate-900 border-transparent shadow-sm shadow-black/50 text-[#e3e3e3] rounded-tr-sm"',
    'className="px-5 py-3.5 rounded-2xl bg-blue-600 border-transparent shadow-sm shadow-black/50 text-white rounded-tr-sm"'
)
content = content.replace(
    'className="px-5 py-3.5 rounded-2xl bg-transparent text-[#e3e3e3] max-w-full"',
    'className="px-5 py-3.5 rounded-2xl bg-transparent text-slate-100 max-w-full"'
)

# Also fix the specific user text elements inside the bubble
content = content.replace(
    '<p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>',
    '<p className="text-[15px] leading-relaxed whitespace-pre-wrap text-white">{msg.text}</p>'
)
content = content.replace(
    '<p className="text-[15px] leading-relaxed whitespace-pre-wrap  text-slate-500">{msg.text}</p>',
    '<p className="text-[15px] leading-relaxed whitespace-pre-wrap text-slate-100">{msg.text}</p>'
)

# The new entry button in sidebar is invisible white on white
content = content.replace(
    '<button onClick={handleNewSession} className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 text-slate-50 rounded-xl transition-all shadow-sm shadow-black/50 group border border-slate-700">',
    '<button onClick={handleNewSession} className="w-full flex items-center justify-between p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-sm shadow-black/50 group border border-blue-500">'
)

# The selected timeline item is also invisible
content = content.replace(
    'activeSessionId === session.id ? "bg-slate-900 text-slate-900 shadow-sm shadow-black/50 border border-slate-700/50" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"',
    'activeSessionId === session.id ? "bg-blue-600 text-white shadow-sm shadow-black/50 border border-blue-500" : "text-slate-300 hover:bg-slate-800 hover:text-white"'
)
content = content.replace(
    'activeSessionId === session.id ? "text-slate-500" : "text-slate-500"',
    'activeSessionId === session.id ? "text-blue-200" : "text-slate-500"'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
