with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Make the outer container completely uniform and chat-gpt like (no visible borders for messages, full width content but centered)
old_ai_bubble = 'msg.role === \'user\' \n          ? "bg-blue-600 text-white rounded-3xl rounded-br-sm shadow-sm shadow-black/50 ml-auto max-w-[85%] md:max-w-[75%] px-6" \n          : "bg-transparent text-slate-50 w-full max-w-full"'
new_ai_bubble = 'msg.role === \'user\' \n          ? "bg-slate-700 text-slate-50 rounded-[20px] shadow-sm ml-auto max-w-[85%] md:max-w-[75%] px-5" \n          : "bg-transparent text-slate-50 w-full max-w-full"'
content = content.replace(old_ai_bubble, new_ai_bubble)

# Also fix the inner padding to map standard ChatGPT flow
old_padding = '"group relative rounded-[24px] px-1 md:px-4 py-4 text-[15px] leading-relaxed transition-all"'
new_padding = '"group relative rounded-[20px] px-0 py-5 text-[16px] leading-relaxed transition-all"'
content = content.replace(old_padding, new_padding)


# The input bar should be floating and centered
content = content.replace(
    'className="p-4 md:p-6 bg-slate-900 flex justify-center"',
    'className="p-4 md:pb-8 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent flex justify-center fixed bottom-0 left-0 md:left-64 right-0"'
)

# And we need to add padding to the bottom of the chat area so the fixed input doesn't cover messages
content = content.replace(
    'className="relative flex-1 overflow-y-auto px-4 py-8 md:px-8 flex flex-col items-center"',
    'className="relative flex-1 overflow-y-auto px-4 py-8 pb-40 md:px-8 flex flex-col items-center"'
)

# Update input box color
content = content.replace(
    'bg-slate-800 rounded-[24px]',
    'bg-slate-800 rounded-[24px] shadow-md shadow-black/20'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
