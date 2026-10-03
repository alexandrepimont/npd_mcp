import { startServer } from '../transport/stdio.js';

startServer().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});