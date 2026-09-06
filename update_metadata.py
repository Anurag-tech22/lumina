import json

with open('metadata.json', 'r') as f:
    metadata = json.load(f)

metadata['name'] = "Reflect"
metadata['description'] = "The journal that actually remembers you."

with open('metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)
