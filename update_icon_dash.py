import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add Fingerprint to imports
content = content.replace('BookOpen, BrainCircuit', 'BookOpen, BrainCircuit, Fingerprint')

# Replace the specific logo instance
logo_html = """<div className="bg-white p-1.5 rounded-lg border border-slate-200">
              <BrainCircuit className="w-4 h-4 text-blue-600" strokeWidth={2} />
            </div>
            <h1 className="font-medium text-[14px] text-slate-900 tracking-tight">Journal</h1>"""

new_logo_html = """<div className="bg-blue-600 p-1.5 rounded-lg border border-blue-700">
              <Fingerprint className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="font-medium text-[16px] text-slate-900 tracking-tight">Reflect</h1>"""

content = content.replace(logo_html, new_logo_html)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
