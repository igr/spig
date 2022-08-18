class Fixtures {
  private readonly base: string = 'test/_fixture';

  of_1(path = ''): string {
    if (path !== '' && path.startsWith('/') == false) {
      throw Error(`Path must start with slash: ${path}`);
    }
    return `${this.base}/1${path}`;
  }
}

export const fixtures = new Fixtures();
