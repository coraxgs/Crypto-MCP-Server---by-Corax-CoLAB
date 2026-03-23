with open('gui/backend/server.js', 'r') as f:
    content = f.read()

content = content.replace('const symbolRegex = /^[A-Z0-9-]+/[A-Z0-9-]+$/i;', 'const symbolRegex = /^[A-Z0-9-]+\\\\/[A-Z0-9-]+$/i;')

with open('gui/backend/server.js', 'w') as f:
    f.write(content)
