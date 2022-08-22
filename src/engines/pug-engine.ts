import pug from 'pug';
import { RenderEngine } from './render-engine.js';

export class PugTemplateEngine implements RenderEngine<pug.Options> {
  private readonly pugOptions: pug.Options = new (class implements pug.Options {})();

  configure(engineConsumer: (engine: pug.Options) => void): void {
    engineConsumer(this.pugOptions);
  }

  render(input: string, context: object): string {
    const compiledFunction = pug.compile(input, this.pugOptions);
    return compiledFunction(context);
  }

  renderInline(input: string, context: object): string {
    return this.render(input, context);
  }
}
