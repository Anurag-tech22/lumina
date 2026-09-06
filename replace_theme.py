import re

with open('src/components/CommandPalette.tsx', 'r') as f:
    content = f.read()

# Text colors
content = content.replace('text-[#e3e3e3]', 'text-slate-900')
content = content.replace('text-white', 'text-slate-900')
content = content.replace('text-[#9ca3af]', 'text-slate-500')
content = content.replace('text-[#6b7280]', 'text-slate-400')
content = content.replace('text-[#a8c7fa]', 'text-indigo-600')

# Background colors
content = content.replace('bg-[#1e2026]', 'bg-white')
content = content.replace('bg-[#13151a]', 'bg-slate-50')
content = content.replace('bg-[#2a2d35]', 'bg-slate-100')
content = content.replace('bg-[#a8c7fa]/10', 'bg-indigo-50')

# Hover states
content = content.replace('hover:text-white', 'hover:text-slate-900')
content = content.replace('hover:bg-[#2a2d35]', 'hover:bg-slate-100')
content = content.replace('hover:bg-[#1e2026]', 'hover:bg-slate-50')

# Borders
content = content.replace('border-[#26282e]', 'border-slate-200')
content = content.replace('border-[#2a2d35]', 'border-slate-200')

# Specific focus / cmdk states which use classes
content = content.replace('aria-selected:bg-[#2a2d35]', 'aria-selected:bg-slate-100')
content = content.replace('aria-selected:text-white', 'aria-selected:text-slate-900')

with open('src/components/CommandPalette.tsx', 'w') as f:
    f.write(content)
