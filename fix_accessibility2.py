import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add aria-labels to the remaining icon buttons manually
content = content.replace('onClick={startNewSession}', 'onClick={startNewSession} aria-label="Start new session"')
content = content.replace('onClick={() => setShowCommandPalette(true)}', 'onClick={() => setShowCommandPalette(true)} aria-label="Open search command palette"')
content = content.replace('onClick={() => fileInputRef.current?.click()}', 'aria-label="Upload an image" onClick={() => fileInputRef.current?.click()}')
content = content.replace('onClick={() => setInteractionMode(interactionMode === \'prism\' ? \'standard\' : \'prism\')}', 'aria-label="Toggle Quantum Prism mode" onClick={() => setInteractionMode(interactionMode === \'prism\' ? \'standard\' : \'prism\')}')
content = content.replace('onClick={() => setInteractionMode(interactionMode === \'research\' ? \'standard\' : \'research\')}', 'aria-label="Toggle Deep Research mode" onClick={() => setInteractionMode(interactionMode === \'research\' ? \'standard\' : \'research\')}')

# Add semantics to text area
content = content.replace('<textarea', '<textarea aria-label="Message input"')

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

with open('src/pages/Login.tsx', 'r') as f:
    content = f.read()

content = content.replace('onClick={handleGoogleSignIn}', 'onClick={handleGoogleSignIn} aria-label="Sign in with Google"')
content = content.replace('onClick={handleAnonymousSignIn}', 'onClick={handleAnonymousSignIn} aria-label="Continue as Guest"')

with open('src/pages/Login.tsx', 'w') as f:
    f.write(content)
