import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add aria-labels to icon buttons
content = content.replace('<button onClick={() => setSidebarOpen(true)}', '<button onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"')
content = content.replace('<button onClick={() => setSidebarOpen(false)}', '<button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"')
content = content.replace('<button onClick={startNewSession}', '<button onClick={startNewSession} aria-label="Start new session"')
content = content.replace('<button onClick={() => setShowCommandPalette(true)}', '<button onClick={() => setShowCommandPalette(true)} aria-label="Open search command palette"')
content = content.replace('<button\n                    type="button"\n                    onClick={() => fileInputRef.current?.click()}', '<button\n                    type="button"\n                    aria-label="Upload an image"\n                    onClick={() => fileInputRef.current?.click()}')
content = content.replace('<button\n                    type="submit"\n                    disabled={(!currentInput.trim() && !attachedImage) || isGenerating || isUploading}', '<button\n                    type="submit"\n                    aria-label="Send message"\n                    disabled={(!currentInput.trim() && !attachedImage) || isGenerating || isUploading}')
content = content.replace('<button\n                      type="button"\n                      onClick={() => setInteractionMode(interactionMode === \'prism\' ? \'standard\' : \'prism\')}', '<button\n                      type="button"\n                      aria-label="Toggle Quantum Prism mode"\n                      onClick={() => setInteractionMode(interactionMode === \'prism\' ? \'standard\' : \'prism\')}')
content = content.replace('<button\n                      type="button"\n                      onClick={() => setInteractionMode(interactionMode === \'research\' ? \'standard\' : \'research\')}', '<button\n                      type="button"\n                      aria-label="Toggle Deep Research mode"\n                      onClick={() => setInteractionMode(interactionMode === \'research\' ? \'standard\' : \'research\')}')

# Add proper semantics to the text area
content = content.replace('<textarea\n                  ref={textareaRef}', '<textarea\n                  ref={textareaRef}\n                  aria-label="Message input"')

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

with open('src/pages/Login.tsx', 'r') as f:
    content = f.read()

content = content.replace('<button\n            onClick={handleGoogleSignIn}', '<button\n            onClick={handleGoogleSignIn}\n            aria-label="Sign in with Google"')
content = content.replace('<button\n            onClick={handleAnonymousSignIn}', '<button\n            onClick={handleAnonymousSignIn}\n            aria-label="Continue as Guest"')

with open('src/pages/Login.tsx', 'w') as f:
    f.write(content)

print("Accessibility fixes applied.")
