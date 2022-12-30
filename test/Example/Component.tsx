import React from "react";
import { useClassComposer } from "../../src/hooks/useClassComposer";

interface Props {
  size: "small" | "medium" | "large";
  something: React.ReactNode;
}

export const Component: React.FC<Props> = (props) => {
  const { className } = useClassComposer<Props>(
    {
      base: "base-class",
      options: {
        size: {
          small: "small-class",
          medium: "medium-class",
          large: "large-class",
        },
      },
    },
    props
  );

  return (
    <div className={className}>
      your component
      {props.something}
    </div>
  );
};
