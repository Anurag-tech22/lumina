with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Fix the SidebarItem background and text colors
old_sidebar_item_classes = """        isActive ? "bg-[#D3E3FD] text-[#041E49]" : "hover:bg-slate-100 text-slate-700" """
new_sidebar_item_classes = """        isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-300" """
content = content.replace(old_sidebar_item_classes, new_sidebar_item_classes)

# Fix hover color on the three dots
old_dots = 'className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-200 text-slate-500 hover:text-slate-50 transition-all"'
new_dots = 'className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-700 text-slate-400 hover:text-slate-50 transition-all"'
content = content.replace(old_dots, new_dots)

# Fix empty state text colors in chat area
content = content.replace(
    'className="text-4xl md:text-5xl font-medium tracking-tight text-slate-800 mb-4"',
    'className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-4"'
)
content = content.replace(
    'className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed"',
    'className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed"'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
