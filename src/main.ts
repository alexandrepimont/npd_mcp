import { startServer } from './stdioServer.js';

startServer().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});