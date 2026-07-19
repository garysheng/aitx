import React from "react";
import { Still } from "remotion";
import { EventFlyer } from "./EventFlyer";
import { flyerSchema } from "./props";
import { SAMPLES } from "./samples";

export const RemotionRoot: React.FC = () => (
  <>
    {SAMPLES.map((s) => (
      <Still
        key={s.id}
        id={s.id}
        component={EventFlyer}
        width={s.width}
        height={s.height}
        schema={flyerSchema}
        defaultProps={s.props}
      />
    ))}
  </>
);
