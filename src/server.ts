// src/server.ts
import app from "./app.js"; // app.ts exporté en ES Module

const PORT = parseInt(process.env.PORT || '8080', 10);
console.log('PORT from Railway:', process.env.PORT);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
