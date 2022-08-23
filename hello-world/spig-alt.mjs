import { Spig } from "spignite";

const md = Spig.on("/**/*.md")

Spig.phase("RENDER", (on) => {
  on(md)
    .pageLinks()
    .render()
    .applyTemplate();
});

Spig.run();
