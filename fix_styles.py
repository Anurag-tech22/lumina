with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Fix AI text color
content = content.replace(': "bg-white text-white rounded-bl-sm"', ': "bg-transparent text-slate-900"')

# Some headers might still be wrong color
content = content.replace('text-slate-900 overflow-hidden', 'text-slate-900 overflow-hidden')

# Let's just make sure all "text-white" in Dashboard is eliminated unless it's on a dark button
content = content.replace('text-white placeholder:text-slate-400', 'text-slate-900 placeholder:text-slate-400')
content = content.replace('text-white', 'text-slate-900')
content = content.replace('bg-indigo-600 text-slate-900', 'bg-blue-600 text-white')
content = content.replace('bg-blue-600 text-slate-900', 'bg-blue-600 text-white') # if we have any blue buttons
content = content.replace('bg-red-500 text-slate-900', 'bg-red-500 text-white')

# Ensure user bubble text is correct if we changed it.
# msg.role === 'user' ? "bg-[#F0F4F9] text-slate-900 rounded-br-sm shadow-sm"
# Actually, text-slate-900 is fine on #F0F4F9.

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
