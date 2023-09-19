import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
:root {
  --c-neutral: hsl(0 0% 50%);
  --c-surface: hsl(50 10% 90%);
  --c-on-surface: hsl(230 80% 5%);
  --c-danger: hsl(350 75% 50%);
  --c-success: hsl(140 75% 50%);
}



* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  padding: 2rem;
  max-width: 600px;
  margin-inline: auto;
  color: var(--c-on-surface);
  background: var(--c-surface);
}

a {
  color: inherit;
  text-decoration: none;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
}

`;
