export interface RenderEngine<E> {
  /**
   * Configure engine after initialization.
   */
  configure(engineConsumer: (engine: E) => void): void;

  /**
   * Renders input string.
   */
  render(input: string, context?: object): string;

  /**
   * Renders input string as an inline text.
   */
  renderInline(input: string, context?: object): string;
}
