with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '        "group relative rounded-[20px] px-0 py-3 text-[16px] leading-relaxed transition-all w-full flex",\n        msg.role === \'user\' \n          ? "bg-slate-700 text-slate-50 rounded-2xl shadow-sm ml-auto max-w-[85%] md:max-w-[75%] px-5 py-3" \n          : "bg-transparent text-slate-50 w-full max-w-full py-2"\n      )}>',
    '        "group relative rounded-[20px] px-0 py-3 text-[16px] leading-relaxed transition-all w-full flex flex-col",\n        msg.role === \'user\' \n          ? "bg-slate-700 text-slate-50 rounded-2xl shadow-sm ml-auto max-w-[85%] md:max-w-[75%] px-5 py-3" \n          : "bg-transparent text-slate-50 w-full max-w-full py-2"\n      )}>'
)
with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
