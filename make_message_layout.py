with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()


content = content.replace(
    '          ? "bg-slate-700 text-slate-50 rounded-[20px] shadow-sm ml-auto max-w-[85%] md:max-w-[75%] px-5" ',
    '          ? "bg-slate-700 text-slate-50 rounded-2xl shadow-sm ml-auto max-w-[85%] md:max-w-[75%] px-5 py-3" '
)

content = content.replace(
    '        "group relative rounded-[20px] px-0 py-5 text-[16px] leading-relaxed transition-all",',
    '        "group relative rounded-[20px] px-0 py-3 text-[16px] leading-relaxed transition-all w-full flex",'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
