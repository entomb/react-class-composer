import { createComponent } from "../../src/functions/createComponent";

type BoxProps = {
  display?: "flex" | "block" | "inline";
};

export const Box = createComponent<BoxProps>("div", {
  base: "box-base",
  options: {
    display: {
      flex: "display-flex",
      block: "display-block",
      inline: "display-inline",
    },
  },
});
