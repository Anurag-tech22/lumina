import re

with open('src/contexts/AuthContext.tsx', 'r') as f:
    content = f.read()

replacement = """  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user') {
        console.log("Sign-in popup closed by user.");
      } else {
        console.error("Error signing in Firebase:", error);
      }
    }
  };"""

content = re.sub(r'  const signIn = async \(\) => \{\s*try \{\s*await signInWithPopup\(auth, provider\);\s*\} catch \(error\) \{\s*console\.error\("Error signing in", error\);\s*\}\s*\};', replacement, content)

with open('src/contexts/AuthContext.tsx', 'w') as f:
    f.write(content)
