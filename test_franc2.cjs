const { franc } = require('franc-min');
console.log("English:", franc('Hello how are you doing today?', {minLength: 3}));
console.log("Hindi:", franc('नमस्ते, आप कैसे हैं?', {minLength: 3}));
console.log("Spanish:", franc('Hola, como estas?', {minLength: 3}));
console.log("French:", franc('Bonjour, comment allez vous?', {minLength: 3}));
