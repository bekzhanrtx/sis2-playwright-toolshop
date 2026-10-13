/**
 * Prefer project-local portable Node (.tools/node) when present,
 * so system Node used by other projects is left alone.
 */
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const portableNode = path.join(root, '.tools', 'node', 'node.exe');
const nodeBin = fs.existsSync(portableNode) ? portableNode : 'node';
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const child = spawn(npxCmd, ['playwright', 'test', ...process.argv.slice(2)], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    PATH: fs.existsSync(portableNode)
      ? `${path.dirname(portableNode)}${path.delimiter}${process.env.PATH}`
      : process.env.PATH,
  },
});

child.on('exit', (code) => process.exit(code ?? 1));
