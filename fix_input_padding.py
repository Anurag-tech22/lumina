with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="w-full max-h-[200px] bg-transparent border-none focus:ring-0 resize-none py-4 pl-2 pr-28 text-[#e3e3e3] placeholder-[#c4c7c5] text-[16px]"',
    'className="w-full max-h-[200px] bg-transparent border-none focus:ring-0 resize-none py-4 pl-2 pr-40 text-[#e3e3e3] placeholder-[#c4c7c5] text-[16px]"'
)

# And fix the right padding on the controls wrapper so the buttons don't overlay the text
content = content.replace(
    'className="absolute right-2 bottom-2.5 flex items-center gap-1"',
    'className="absolute right-3 bottom-3 flex items-center gap-1 bg-slate-800 pl-2 rounded-xl"'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
