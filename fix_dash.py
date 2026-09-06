import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Fix fetchPersona to handle errors
fetch_persona_repl = """        const fetchPersona = async (personaId: string, index: number) => {
          const res = await fetch('/api/prism', {
            method: 'POST',
            signal: abortControllerRef.current?.signal,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
            body: JSON.stringify({ prompt: currentInput, persona: personaId })
          });
          
          if (!res.ok) {
            streams[index] = 'Error generating response for this persona.';
            return;
          }
          
          if (!res.body) return;"""
content = re.sub(r'const fetchPersona = async \(personaId: string, index: number\) => \{\s*const res = await fetch\(\'/api/prism\', \{\s*method: \'POST\',\s*signal: abortControllerRef\.current\?\.signal,\s*headers: \{ \'Content-Type\': \'application/json\', \'Authorization\': `Bearer \$\{idToken\}` \},\s*body: JSON\.stringify\(\{ prompt: currentInput, persona: personaId \}\)\s*\}\);\s*if \(\!res\.body\) return;', fetch_persona_repl, content, flags=re.DOTALL)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
