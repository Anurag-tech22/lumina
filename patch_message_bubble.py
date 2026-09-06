import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# 1. Define MessageBubble component at the end of the file
message_bubble_code = """
interface MessageBubbleProps {
  msg: Message;
  speakingMessageId: string | null;
  playAudio: (text: string, id: string) => void;
  showError: (message: string) => void;
}

const MessageBubble = React.memo(({ msg, speakingMessageId, playAudio, showError }: MessageBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4",
        msg.role === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {msg.role === 'model' && (
        <div className="w-8 h-8 shrink-0 rounded-full bg-[#eab308]/10 border border-transparent flex items-center justify-center mt-1">
          <BrainCircuit className="w-4 h-4 text-[#eab308]" />
        </div>
      )}
      
      <div className={cn(
        "group relative max-w-[85%] rounded-[24px] px-6 py-4 text-[15px] leading-relaxed shadow-sm transition-all",
        msg.role === 'user' 
          ? "bg-indigo-600 text-white rounded-br-sm shadow-sm" 
          : "bg-[#111111] text-white rounded-bl-sm"
      )}>
        {msg.role === 'model' ? (
          <div className="prose  prose-p:leading-relaxed prose-pre:bg-white prose-pre:border prose-pre:border-white/10 max-w-none prose-a:text-[#eab308] prose-strong:text-white prose-headings:font-medium prose-headings:text-white">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{msg.text || "..."}</ReactMarkdown>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{msg.text}</div>
        )}

        {msg.role === 'model' && msg.text && (
          <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(msg.text);
                  showError("Copied to clipboard!");
                } catch (e) {
                  try {
                    const textArea = document.createElement("textarea");
                    textArea.value = msg.text;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showError("Copied to clipboard!");
                  } catch (err) {
                    showError("Failed to copy");
                  }
                }
              }}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-[#111111] flex items-center justify-center transition-colors"
              title="Copy message"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => playAudio(msg.text, msg.id)}
              className={cn(
                "p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-[#111111] flex items-center justify-center transition-colors",
                speakingMessageId === msg.id && "text-[#eab308] bg-[#111111]"
              )}
              title={speakingMessageId === msg.id ? "Stop Reading" : "Read Aloud"}
            >
              {speakingMessageId === msg.id ? <Square className="w-3.5 h-3.5" fill="currentColor" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
});
"""

# Replace the inner map logic
map_logic = r"""messages\.map\(\(msg\) => \(\s*<motion\.div.*?(?=\s*\)\)\s*\}|\s*\{isGenerating && \()\s*\)"""

import re
# We need a safer replace. Let's find the boundaries precisely.
# The code to replace starts at `messages.map((msg) => (` and ends at the closing `))` just before `{isGenerating && (`

start_idx = content.find("messages.map((msg) => (")
if start_idx == -1:
    print("Could not find messages.map")
    exit(1)

end_string = "))\n              )}"
end_idx = content.find(end_string, start_idx)

if end_idx == -1:
    print("Could not find end of map")
    exit(1)

replacement = """messages.map((msg) => (
                  <MessageBubble 
                    key={msg.id} 
                    msg={msg} 
                    speakingMessageId={speakingMessageId} 
                    playAudio={playAudio} 
                    showError={showError} 
                  />
                ))
              )}"""

new_content = content[:start_idx] + replacement + content[end_idx + len(end_string):]

# Add MessageBubble to the bottom of the file
new_content += "\n" + message_bubble_code

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(new_content)

print("Patched Dashboard.tsx")
