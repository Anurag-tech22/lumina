import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Change main background
content = content.replace('bg-white text-slate-900 overflow-hidden font-sans selection:bg-blue-600/100/30', 'bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-blue-600/100/30')

# Optional: change sidebar background if it relies on being different
# Actually, the sidebar is a <aside> let's check what it has.
# We can just change the root bg to bg-slate-50
with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

with open('src/pages/Login.tsx', 'r') as f:
    content = f.read()

# Change main background
content = content.replace('bg-white text-slate-900 font-sans selection:bg-blue-200', 'bg-slate-50 text-slate-900 font-sans selection:bg-blue-200')

with open('src/pages/Login.tsx', 'w') as f:
    f.write(content)

