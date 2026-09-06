with open('index.html', 'r') as f:
    content = f.read()

content = content.replace('The journal that actually remembers you.', 'An advanced AI workspace with Omni-Cognitive Synthesis.')

with open('index.html', 'w') as f:
    f.write(content)
