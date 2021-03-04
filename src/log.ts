import chalk from 'chalk';
import log from 'fancy-log';
import { isEnvProduction, isEnvTestingWithJest } from './envs';

function millisToSeconds(elapsedMilliseconds: number): { sec: string; ms: string } {
  const sec = Math.floor(elapsedMilliseconds / 1000).toString();
  const msValue = Math.floor((elapsedMilliseconds % 1000) / 10);
  let ms = msValue.toString();

  if (msValue < 10) {
    ms = '0' + ms;
  }
  return { sec, ms };
}

export function debug(message: string): void {
  if (isEnvTestingWithJest()) {
    return;
  }
  if (isEnvProduction()) {
    return;
  }
  log(chalk.dim(message));
}

export function error(errorOrMessage: string | Error): void {
  if (errorOrMessage instanceof Error) {
    log.error(chalk.red(errorOrMessage.stack));
  } else {
    log.error(chalk.red(errorOrMessage));
  }
}

export function phase(phaseName: string): void {
  if (isEnvTestingWithJest()) {
    return;
  }
  if (isEnvProduction()) {
    return;
  }
  log(chalk.blueBright(`◼ ${phaseName}`));
}

export function info(message: string): void {
  if (isEnvTestingWithJest()) {
    return;
  }
  log(chalk.magentaBright(message));
}

export function line(msg?: string): void {
  if (isEnvTestingWithJest()) {
    return;
  }
  if (isEnvProduction()) {
    return;
  }
  if (msg) {
    msg = `[${msg}]`;
  } else {
    msg = '';
  }
  let str = `---${msg}--------------------------------------------------`;
  str = str.substr(0, 50);

  console.log(chalk.dim(str));
}

export function banner(): void {
  if (isEnvTestingWithJest()) {
    return;
  }
  console.log();
  console.log(chalk.bgHex('0xF74B00').black(' -=[Spignite v2.3.0]=- '));
  console.log();
}

export function task(name: string): void {
  if (isEnvTestingWithJest()) {
    return;
  }
  log('⭐️ ' + chalk.yellowBright(name));
}

export function operation(name: string): void {
  if (isEnvTestingWithJest()) {
    return;
  }
  if (isEnvProduction()) {
    return;
  }
  log(chalk.dim('● ' + name));
}

export function pair(message: string, file: string): void {
  if (isEnvTestingWithJest()) {
    return;
  }
  log(message + ' ' + chalk.magenta(file));
}

export function env(value: string): void {
  if (isEnvTestingWithJest()) {
    return;
  }
  log('Environment: ' + chalk.green(value));
}

export function fromTo(left: string, leftMark: boolean, right?: string): void {
  if (isEnvTestingWithJest()) {
    return;
  }
  if (isEnvProduction()) {
    return;
  }
  const leftChalked: string = leftMark ? chalk.green(left) : chalk.yellow(left);

  if (!right) {
    console.log(leftChalked);
  } else {
    console.log(leftChalked + ' ⮜ ' + chalk.blue(right));
  }
}

export function notification(message: string): void {
  log(chalk.cyan(message));
}

export function totalTime(name: string, elapsedMilliseconds: number): void {
  const { sec, ms } = millisToSeconds(elapsedMilliseconds);
  log(chalk.whiteBright('🔥 Task ') + chalk.yellowBright(`'${name}'`) + chalk.whiteBright(` done in ${sec}.${ms}s.`));
}

// export function configTime(elapsedMilliseconds: number): void {
//   const { sec, ms } = millisToSeconds(elapsedMilliseconds);
//   log(chalk.white(`Up in ${sec}.${ms}s.`));
// }

export function hello(): void {
  log.info('👋 Booting up...');
}
