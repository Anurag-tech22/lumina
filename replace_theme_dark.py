import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Revert to premium dark mode

# Text colors
content = content.replace('text-slate-900', 'text-white')
content = content.replace('text-slate-500', 'text-white/50')
content = content.replace('text-slate-400', 'text-white/40')
content = content.replace('text-indigo-600', 'text-[#eab308]')
content = content.replace('text-slate-600', 'text-white/60')

# Background colors
content = content.replace('bg-white', 'bg-[#050505]')
content = content.replace('bg-slate-50', 'bg-[#111111]')
content = content.replace('bg-slate-100', 'bg-[#1a1a1a]')
content = content.replace('bg-indigo-50', 'bg-[#eab308]/10')
content = content.replace('bg-indigo-100', 'bg-[#eab308]/20')
content = content.replace('bg-slate-900', 'bg-white') # Button bg etc

# Hover states
content = content.replace('hover:text-slate-900', 'hover:text-white')
content = content.replace('hover:bg-slate-100', 'hover:bg-white/10')
content = content.replace('hover:bg-slate-50', 'hover:bg-white/5')
content = content.replace('hover:bg-slate-200', 'hover:bg-white/20')
content = content.replace('hover:bg-slate-800', 'hover:bg-gray-200')
content = content.replace('hover:bg-indigo-700', 'hover:bg-[#eab308]/80')

# Borders
content = content.replace('border-slate-200', 'border-white/10')
content = content.replace('border-indigo-100', 'border-[#eab308]/20')
content = content.replace('border-indigo-200', 'border-[#eab308]/30')
content = content.replace('border-slate-300', 'border-white/20')

# Markdown fixes
content = content.replace('prose-pre:bg-slate-900', 'prose-pre:bg-[#111111]')
content = content.replace('prose-pre:border-slate-800', 'prose-pre:border-white/10')

# Specific fixes for send button and chat bubbles
content = content.replace('bg-white text-white rounded-br-sm shadow-sm', 'bg-[#eab308] text-[#050505] rounded-br-sm shadow-sm')
content = content.replace('bg-[#050505] text-white rounded-bl-sm border border-white/10 shadow-sm', 'bg-[#111111] text-white rounded-bl-sm border border-white/10 shadow-sm')

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

with open('src/components/CommandPalette.tsx', 'r') as f:
    content = f.read()

# Do the same for CommandPalette
content = content.replace('text-slate-900', 'text-white')
content = content.replace('text-slate-500', 'text-white/50')
content = content.replace('text-slate-400', 'text-white/40')
content = content.replace('text-indigo-600', 'text-[#eab308]')

content = content.replace('bg-white', 'bg-[#050505]')
content = content.replace('bg-slate-50', 'bg-[#111111]')
content = content.replace('bg-slate-100', 'bg-[#1a1a1a]')
content = content.replace('bg-indigo-50', 'bg-[#eab308]/10')

content = content.replace('hover:text-slate-900', 'hover:text-white')
content = content.replace('hover:bg-slate-100', 'hover:bg-white/10')
content = content.replace('hover:bg-slate-50', 'hover:bg-white/5')

content = content.replace('border-slate-200', 'border-white/10')

content = content.replace('aria-selected:bg-slate-100', 'aria-selected:bg-white/10')
content = content.replace('aria-selected:text-slate-900', 'aria-selected:text-white')

with open('src/components/CommandPalette.tsx', 'w') as f:
    f.write(content)

