/**
 * CLI arguments.
 */
export const ARGS: { taskName: string } = (() => {
  const args = process.argv.slice(2);
  let taskName = 'build';
  if (args.length !== 0) {
    taskName = args[0];
  }
  return {
    taskName,
  };
})();
