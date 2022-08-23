import { Spig } from "spignite";

Spig
  .on("/**/*.md")

  ._("RENDER")
  .pageLinks()
  .render()
  .applyTemplate()
;

Spig.run();
