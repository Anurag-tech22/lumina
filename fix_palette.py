import re

with open('src/components/CommandPalette.tsx', 'r') as f:
    content = f.read()

content = content.replace('bg-black/60', 'bg-slate-900/40')
content = content.replace('border-white/10 bg-[#090b0f]', 'border-slate-200 bg-white')
content = content.replace('border-white/10', 'border-slate-200')
content = content.replace('text-white/50', 'text-slate-500')
content = content.replace('text-white placeholder:text-white/30', 'text-slate-900 placeholder:text-slate-400')
content = content.replace('text-white', 'text-slate-900')
content = content.replace('hover:bg-[#050505]', 'hover:bg-slate-100')
content = content.replace('aria-selected:bg-[#050505]', 'aria-selected:bg-slate-100')
content = content.replace('text-[#eab308]', 'text-blue-600')
content = content.replace('scrollbar-thumb-[#26282e]', 'scrollbar-thumb-slate-200')

with open('src/components/CommandPalette.tsx', 'w') as f:
    f.write(content)
