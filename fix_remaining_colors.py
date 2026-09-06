with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Fix New Entry Button
old_btn = 'className="w-full flex items-center justify-between gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-700 text-slate-50 rounded-lg px-4 py-2 transition-colors text-[13px] font-medium"'
new_btn = 'className="w-full flex items-center justify-between gap-2 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-lg px-4 py-2 transition-colors text-[13px] font-medium"'
content = content.replace(old_btn, new_btn)

# Fix shortcut key styling
old_key = 'className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded opacity-80 border border-slate-700"'
new_key = 'className="text-[10px] font-mono text-blue-200 bg-blue-700 px-1.5 py-0.5 rounded opacity-80 border border-blue-500"'
content = content.replace(old_key, new_key)

# Fix SidebarItem
old_sidebar_item = 'isActive ? "bg-[#D3E3FD] text-[#041E49]" : "hover:bg-slate-100 text-slate-700"'
new_sidebar_item = 'isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-300"'
content = content.replace(old_sidebar_item, new_sidebar_item)

# Fix delete button hover
old_delete = 'className="w-full text-left px-3 py-2 text-[12px] text-red-500 hover:bg-slate-100 flex items-center gap-2"'
new_delete = 'className="w-full text-left px-3 py-2 text-[12px] text-red-400 hover:bg-slate-700 flex items-center gap-2"'
content = content.replace(old_delete, new_delete)

# Fix empty state main text (which wasn't caught by previous regex)
content = content.replace(
    'className="text-4xl md:text-5xl font-medium tracking-tight text-slate-900 mb-4"',
    'className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4"'
)
content = content.replace(
    'className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed"',
    'className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed"'
)

# Fix message texts
content = content.replace(
    '<p className="text-[15px] leading-relaxed whitespace-pre-wrap  text-slate-900">{msg.text}</p>',
    '<p className="text-[15px] leading-relaxed whitespace-pre-wrap text-white">{msg.text}</p>'
)
content = content.replace(
    'className="px-5 py-3.5 rounded-2xl bg-transparent text-[#e3e3e3] max-w-full"',
    'className="px-5 py-3.5 rounded-2xl bg-transparent text-slate-100 max-w-full"'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
