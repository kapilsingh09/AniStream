import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const checkVideoFile = (animeId, epNum) => {
  const filename = `anime-${animeId}-ep${epNum}.mp4`;
  const filePath = path.join(__dirname, '..', 'videos', filename);
  return {
    exists: fs.existsSync(filePath),
    filename
  };
};
