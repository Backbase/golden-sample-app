import fs from 'fs';

export function readFile<T>(path: string | undefined): T {
  if (!path) {
    throw new Error(
      'Failed to read config file, since path to the file provided was "undefined"'
    );
  }
  const configContents = fs.readFileSync(path, 'utf-8');
  return JSON.parse(configContents) as T;
}
