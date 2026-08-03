import { spawn } from 'node:child_process';

const port = process.env.SMOKE_PORT ?? '3091';
const token = process.env.APP_ACCESS_TOKEN ?? 'smoke-test-token';
const baseUrl = `http://127.0.0.1:${port}`;

const env = {
  ...process.env,
  NODE_ENV: 'production',
  PORT: port,
  HOSTNAME: '127.0.0.1',
  NEXT_PUBLIC_APP_URL: baseUrl,
  DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://smoke-test',
  ENCRYPTION_KMS_KEY_REF: process.env.ENCRYPTION_KMS_KEY_REF ?? 'op://Shared – DevOps/flowgent-smoke/kms',
  APP_ACCESS_TOKEN: token,
  SESSION_SECRET_REF: process.env.SESSION_SECRET_REF ?? 'op://Shared – DevOps/flowgent-smoke/session',
};

const server = spawn('npm', ['start'], {
  env,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let output = '';
server.stdout.on('data', (chunk) => {
  output += chunk.toString();
});
server.stderr.on('data', (chunk) => {
  output += chunk.toString();
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealth() {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      // Server not ready yet.
    }
    await sleep(250);
  }
  throw new Error(`Server did not become healthy. Output:\n${output}`);
}

async function expectStatus(path, expectedStatus, headers = {}) {
  const response = await fetch(`${baseUrl}${path}`, { headers });
  if (response.status !== expectedStatus) {
    throw new Error(`${path} expected ${expectedStatus}, received ${response.status}`);
  }
  return response;
}

try {
  await waitForHealth();

  const health = await expectStatus('/api/health', 200);
  const healthBody = await health.json();
  if (healthBody.summary.failed !== 0) {
    throw new Error(`/api/health has failed checks: ${JSON.stringify(healthBody.summary)}`);
  }

  await expectStatus('/dashboard', 401);
  await expectStatus('/dashboard', 200, { Authorization: `Bearer ${token}` });
  await expectStatus('/clinical-notes', 200, { Authorization: `Bearer ${token}` });

  const notes = await expectStatus('/api/clinical-notes/drafts', 200, { Authorization: `Bearer ${token}` });
  const notesBody = await notes.json();
  if (!notesBody.safety?.providerApprovalRequired || !notesBody.safety?.noDiagnosisGeneration) {
    throw new Error('Clinical notes API did not return required safety flags.');
  }

  console.log('production smoke passed');
} finally {
  server.kill('SIGTERM');
  await new Promise((resolve) => server.once('exit', resolve));
}
