import re

with open('src/pages/Login.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<Origami className="w-4 h-4 text-white" strokeWidth={1.5} />',
    '<motion.div animate={{ rotateY: 360, y: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}><Origami className="w-4 h-4 text-white" strokeWidth={1.5} /></motion.div>'
)

with open('src/pages/Login.tsx', 'w') as f:
    f.write(content)

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<Origami className="w-4 h-4 text-white" strokeWidth={2} />',
    '<motion.div animate={{ rotateY: 360, y: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}><Origami className="w-4 h-4 text-white" strokeWidth={2} /></motion.div>'
)

content = content.replace(
    '<Origami className="w-8 h-8 text-blue-600 relative z-10" strokeWidth={1.5} />',
    '<motion.div animate={{ rotateY: 360, y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}><Origami className="w-8 h-8 text-blue-600 relative z-10" strokeWidth={1.5} /></motion.div>'
)

content = content.replace(
    '<Origami className="w-4 h-4 text-blue-600 animate-pulse" strokeWidth={1.5} />',
    '<motion.div animate={{ rotateY: 360, scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><Origami className="w-4 h-4 text-blue-600" strokeWidth={1.5} /></motion.div>'
)

content = content.replace(
    '<Origami className="w-4 h-4 text-blue-600" strokeWidth={1.5} />',
    '<motion.div animate={{ rotateY: [0, 20, 0, -20, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}><Origami className="w-4 h-4 text-blue-600" strokeWidth={1.5} /></motion.div>'
)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

