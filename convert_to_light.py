import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Core background and text
content = content.replace('bg-[#050505]', 'bg-[#F0F4F9]')
content = content.replace('bg-[#111111]', 'bg-white')
content = content.replace('bg-[#1a1a1a]', 'bg-white')

# Text colors
content = content.replace('text-white/40', 'text-slate-400')
content = content.replace('text-white/50', 'text-slate-500')
content = content.replace('text-white/60', 'text-slate-500')
content = content.replace('text-white/70', 'text-slate-600')
content = content.replace('text-white/80', 'text-slate-700')
content = content.replace('text-white/90', 'text-slate-800')

# Specific instances of text-white where they shouldn't be white anymore 
# (Wait, user bubble is still blue, so user bubble text should be white. Main text should be slate-900)
# Instead of replacing all 'text-white', I'll target specific ones:
content = content.replace('text-white overflow-hidden', 'text-slate-900 overflow-hidden')
content = content.replace('text-white truncate', 'text-slate-900 truncate')
content = content.replace('hover:text-white', 'hover:text-slate-900')

# Borders
content = content.replace('border-white/5', 'border-slate-200')
content = content.replace('border-white/10', 'border-slate-200')
content = content.replace('border-white/20', 'border-slate-300')
content = content.replace('border-white/30', 'border-slate-300')

# Hover backgrounds
content = content.replace('hover:bg-white/5', 'hover:bg-slate-100')
content = content.replace('hover:bg-white/10', 'hover:bg-slate-200')
content = content.replace('hover:bg-white/20', 'hover:bg-slate-300')

# Active backgrounds
content = content.replace('bg-white/5', 'bg-slate-100')
content = content.replace('bg-white/10', 'bg-blue-100')
content = content.replace('bg-white/20', 'bg-slate-200')

# Focus Mode overlay
content = content.replace('bg-black/80', 'bg-white/90')

# Accent color (Yellow/Gold -> Google Blue)
content = content.replace('text-[#eab308]', 'text-blue-600')
content = content.replace('bg-[#eab308]', 'bg-blue-600')
content = content.replace('bg-[#eab308]/10', 'bg-blue-50')
content = content.replace('bg-[#eab308]/100/30', 'bg-blue-200')
content = content.replace('text-[#eab308]/50', 'text-blue-400')
content = content.replace('border-[#eab308]/30', 'border-blue-200')
content = content.replace('shadow-[#eab308]/10', 'shadow-blue-600/10')
content = content.replace('prose-a:text-[#eab308]', 'prose-a:text-blue-600')

# Indigo buttons (User bubble, etc.)
content = content.replace('bg-indigo-600', 'bg-[#F0F4F9]') # Make user bubble light gray like Gemini! Wait, if user bubble is light gray, text should be slate-900
content = content.replace('bg-[#F0F4F9] text-white', 'bg-[#F0F4F9] text-slate-900')

# The main input area
content = content.replace('bg-[#0a0a0a]', 'bg-white')

# Sidebar active state text color (to match light mode)
content = content.replace('isActive ? "bg-blue-100" : "hover:bg-slate-100"', 'isActive ? "bg-[#D3E3FD] text-[#041E49]" : "hover:bg-slate-100 text-slate-700"')

# Markdown Prose
content = content.replace('prose-pre:bg-white', 'prose-pre:bg-slate-900') # Code blocks should still be dark
content = content.replace('prose-pre:border-white/10', 'prose-pre:border-slate-800')
content = content.replace('prose-strong:text-white', 'prose-strong:text-slate-900')
content = content.replace('prose-headings:text-white', 'prose-headings:text-slate-900')
content = content.replace('text-white placeholder:text-white/30', 'text-slate-900 placeholder:text-slate-400')

# Sidebar Item overrides
content = content.replace('text-white/90 truncate', 'text-slate-800 truncate')
# And in SidebarItem
content = content.replace('isActive ? "bg-white/10" : "hover:bg-white/5"', 'isActive ? "bg-[#D3E3FD] text-[#041E49]" : "hover:bg-slate-100 text-slate-700"')

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
