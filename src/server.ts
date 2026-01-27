import dotenv from 'dotenv';
import app from './app.js';
import { prisma } from './config/prisma.js';

// Charger les variables d'environnement
dotenv.config();

// Fonction de démarrage
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    const PORT = Number(process.env.PORT) || 8080;
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
      console.log('✅ Ready to accept connections');
    });

    // 💓 HEARTBEAT - Log toutes les 30 secondes
    setInterval(() => {
      console.log('💓 Heartbeat:', new Date().toISOString(), '- Server alive');
    }, 30000); // 30 secondes

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Gestion de l'arrêt propre
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Capturer les erreurs non gérées
process.on('uncaughtException', async (error) => {
  console.error('❌ Uncaught Exception:', error);
  await prisma.$disconnect();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  await prisma.$disconnect();
  process.exit(1);
});

// Démarrer le serveur
console.log('🚀 Starting server...');
startServer();