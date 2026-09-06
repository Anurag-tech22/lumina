with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Massive replacement for Dark Theme
replacements = [
    # Backgrounds
    ("bg-slate-50", "bg-slate-950"),
    ("bg-[#F0F4F9]", "bg-slate-900"),
    ("bg-white", "bg-slate-800"),
    ("hover:bg-white", "hover:bg-slate-700"),
    ("focus-within:bg-white", "focus-within:bg-slate-800"),
    
    # Texts
    ("text-slate-900", "text-slate-50"),
    ("text-slate-800", "text-slate-100"),
    ("text-slate-500", "text-slate-400"),
    ("hover:text-slate-900", "hover:text-white"),
    ("text-slate-400", "text-slate-500"),
    ("text-[#F0F4F9]", "text-slate-900"),
    ("selection:bg-blue-600/100/30", "selection:bg-blue-500/30"),
    
    # Borders
    ("border-slate-200", "border-slate-700"),
    ("border-slate-300", "border-slate-600"),
    
    # Shadows
    ("shadow-sm", "shadow-sm shadow-black/50"),
]

for old, new in replacements:
    content = content.replace(old, new)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)


with open('src/pages/Login.tsx', 'r') as f:
    content = f.read()

for old, new in replacements:
    content = content.replace(old, new)

with open('src/pages/Login.tsx', 'w') as f:
    f.write(content)
