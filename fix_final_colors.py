with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Fix cyrillic text greeting
content = content.replace(
    '<p className="text-sm text-slate-400 leading-relaxed max-w-sm">',
    '<p className="text-sm text-slate-300 leading-relaxed max-w-sm">'
)

# Fix user message bubble
old_user_bubble = 'msg.role === \'user\' \n          ? "bg-slate-900 text-slate-50 rounded-br-sm shadow-sm shadow-black/50" \n          : "bg-transparent text-slate-50"'
new_user_bubble = 'msg.role === \'user\' \n          ? "bg-blue-600 text-white rounded-br-sm shadow-sm shadow-black/50" \n          : "bg-transparent text-slate-50"'
content = content.replace(old_user_bubble, new_user_bubble)

# Fix the big Origami icon background in empty state
content = content.replace(
    'className="w-16 h-16 bg-slate-900 border border-slate-700 rounded-[18px]',
    'className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-[18px]'
)

# Fix chat input box background
content = content.replace(
    'bg-slate-900 rounded-[24px]',
    'bg-slate-800 rounded-[24px]'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
