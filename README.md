# React Class Composer
![image](https://user-images.githubusercontent.com/57768/198602737-edb226d8-e482-48a1-b7e6-d1b61821108f.png)

Simple tool to compose css classnames based on component props

## How does it work?

use `createComponent()` we can create and forward a native HTML component:

```ts
import { HTMLAttributes } from 'react';
import { createComponent } from 'react-class-composer';

type BoxProps = {
  display?: "flex" | "block" | "inline";
};

export const Box = createComponent<BoxProps>("div", {
  $base: "box-base",
  $options: {
    display: {
      flex: "display-flex",
      block: "display-block",
      inline: "display-inline",
    },
  },
});
```

### Using the component:

```jsx
  <Box display='flex'><Box>
  <Box display='inline'><Box>
  <Box display='block'><Box>
```

### HTML Output:
```html
  <div className="box-base display-flex"></div>
  <div className="box-base display-inline"></div>
  <div className="box-base display-block"></div>
```
