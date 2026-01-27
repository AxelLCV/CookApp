// src/server.ts
import app from "./app.js"; // app.ts exporté en ES Module

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
