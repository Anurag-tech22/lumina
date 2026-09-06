import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Fix synthRes to handle errors
synth_repl = """        const synthRes = await fetch('/api/prism', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
          body: JSON.stringify({ 
            prompt: `User asked: ${currentInput}\\n\\nVisionary said: ${streams[0]}\\n\\nAnalyst said: ${streams[1]}\\n\\nCritic said: ${streams[2]}`, 
            persona: 'synthesizer' 
          })
        });

        if (synthRes.ok && synthRes.body) {"""
content = re.sub(r'const synthRes = await fetch\(\'/api/prism\', \{\s*method: \'POST\',\s*headers: \{ \'Content-Type\': \'application/json\', \'Authorization\': `Bearer \$\{idToken\}` \},\s*body: JSON\.stringify\(\{ \s*prompt: `User asked: \$\{currentInput\}\\n\\nVisionary said: \$\{streams\[0\]\}\\n\\nAnalyst said: \$\{streams\[1\]\}\\n\\nCritic said: \$\{streams\[2\]\}`, \s*persona: \'synthesizer\' \s*\}\)\s*\}\);\s*if \(synthRes\.body\) \{', synth_repl, content, flags=re.DOTALL)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)
