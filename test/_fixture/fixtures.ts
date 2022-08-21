class Fixtures {
  private readonly base: string = 'test/_fixture';

  of_1(path = ''): string {
    return this.of(1, path);
  }

  of_2(path = ''): string {
    return this.of(2, path);
  }

  private of(num: number, path: string): string {
    if (path !== '' && path.startsWith('/') == false) {
      throw Error(`Path must start with slash: ${path}`);
    }
    return `${this.base}/${num}${path}`;
  }
}

export const fixtures = new Fixtures();
