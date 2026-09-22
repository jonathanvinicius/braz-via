import { execSync } from 'child_process';
import { join } from 'path';

const MAX_ATTEMPTS = 12;
const RETRY_DELAY_MS = 10_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runSequelizeCli(command: string, cwd: string): string {
  const sequelizeCli = join(cwd, 'node_modules', 'sequelize-cli', 'lib', 'sequelize');
  return execSync(`node "${sequelizeCli}" ${command}`, {
    cwd,
    env: { ...process.env, NODE_ENV: 'production' },
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

async function runWithRetry(label: string, fn: () => string): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const output = fn();
      console.log(`${label} concluído (tentativa ${attempt})`);
      if (output) {
        console.log(output);
      }
      return output;
    } catch (error) {
      lastError = error;
      const err = error as { stderr?: string; stdout?: string; message?: string };
      console.error(
        `${label} falhou (tentativa ${attempt}/${MAX_ATTEMPTS}):`,
        err.stderr ?? err.stdout ?? err.message,
      );

      if (attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  throw lastError;
}

export const handler = async (): Promise<{ ok: boolean; seeded: boolean }> => {
  const cwd = process.env.LAMBDA_TASK_ROOT ?? process.cwd();

  await runWithRetry('db:migrate', () => runSequelizeCli('db:migrate', cwd));

  const shouldSeed = process.env.RUN_DB_SEED === 'true';
  if (shouldSeed) {
    await runWithRetry('db:seed:all', () => runSequelizeCli('db:seed:all', cwd));
  } else {
    console.log('RUN_DB_SEED=false — seeders ignorados');
  }

  return { ok: true, seeded: shouldSeed };
};
