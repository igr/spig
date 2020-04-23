const production = process.env.SPIG_PRODUCTION === 'true';
const testing = process.env.JEST_WORKER_ID !== undefined;

export function isEnvProduction(): boolean {
  return production;
}

export function isEnvTestingWithJest(): boolean {
  return testing;
}
