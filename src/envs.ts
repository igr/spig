export function isEnvProduction(): boolean {
  return process.env.SPIG_PRODUCTION === 'true';
}
