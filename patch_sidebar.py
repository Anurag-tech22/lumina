import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# 1. Define SidebarItem component at the end of the file
sidebar_item_code = """
interface SidebarItemProps {
  session: Session;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
}

const SidebarItem = React.memo(({ session, isActive, onSelect, onDelete, openMenuId, setOpenMenuId }: SidebarItemProps) => {
  return (
    <div
      className={cn(
        "group flex items-center justify-between w-full px-2 py-2 rounded-lg cursor-pointer transition-colors relative",
        isActive ? "bg-white/10" : "hover:bg-white/5"
      )}
      onClick={() => onSelect(session.id)}
    >
      <div className="flex flex-col items-start min-w-0 flex-1">
        <span className="text-[12px] font-medium text-white/90 truncate w-full px-1">{session.title}</span>
        <span className="text-[10px] text-white/40 px-1">{format(new Date(session.createdAt), 'MMM d, h:mm a')}</span>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenuId(openMenuId === session.id ? null : session.id);
        }}
        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 text-white/50 hover:text-white transition-all"
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>

      {openMenuId === session.id && (
        <div className="absolute right-8 top-8 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(session.id);
            }}
            className="w-full text-left px-3 py-2 text-[12px] text-red-500 hover:bg-white/5 flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
});
"""

import re

start_idx = content.find("sessions.map(session => (")
if start_idx == -1:
    print("Could not find sessions.map")
    exit(1)

# We need to find the matching closing brackets for the map. 
# It's at:
#       )}
#     </div>
#   ))
# )
# Let's find exactly `</div>\n                  ))\n                )`

end_string = "</div>\n                  ))\n                )"
end_idx = content.find(end_string, start_idx)
if end_idx == -1:
    # Let's try simpler regex
    pass

# We will just replace it cleanly.
replacement_regex = r"sessions\.map\(session => \(\s*<div\s*key=\{session\.id\}.*?</div>\s*\)\s*\)\s*\)"

replacement_text = """sessions.map(session => (
              <SidebarItem 
                key={session.id} 
                session={session} 
                isActive={activeSessionId === session.id} 
                onSelect={setActiveSessionId} 
                onDelete={handleDeleteSession}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
              />
            ))
          )"""

new_content = re.sub(replacement_regex, replacement_text, content, flags=re.DOTALL)

# Add SidebarItem to the bottom of the file
new_content += "\n" + sidebar_item_code

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(new_content)

print("Patched SidebarItem")
