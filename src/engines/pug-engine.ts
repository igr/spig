import pug from 'pug';
import { RenderEngine } from './render-engine';

class PugTemplateEngine implements RenderEngine<pug.Options> {
  private readonly pubOptions: pug.Options = new (class implements pug.Options {})();

  configure(engineConsumer: (engine: pug.Options) => void): void {
    engineConsumer(this.pubOptions);
  }

  render(input: string, context: object): string {
    const compiledFunction = pug.compile(input, this.pubOptions);
    return compiledFunction.apply(context);
  }

  renderInline(input: string, context: object): string {
    return this.render(input, context);
  }
}

export const PugEngine: RenderEngine<pug.Options> = new PugTemplateEngine();
