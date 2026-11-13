/** Checks the app's ZIP writer produces an archive standard tools accept. Usage: npx tsx tools/test-zip.ts <out.zip> <file...> */
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { makeZip } from '../src/lib/zip';

const [out, ...inputs] = process.argv.slice(2);
const zip = await makeZip(inputs.map((p) => ({ name: basename(p), blob: new Blob([readFileSync(p)]) })));
writeFileSync(out, Buffer.from(await zip.arrayBuffer()));
console.log('wrote', out, zip.size, 'bytes');
