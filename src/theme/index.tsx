import styled, {
  createGlobalStyle,
  css,
  DefaultTheme,
  ThemeProvider as StyledComponentsThemeProvider,
} from 'styled-components'
import {defaultThem, SIZE} from './Color';
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";

export default function ThemeProvider({children}: { children: ReactJSXElement }) {
  return <StyledComponentsThemeProvider theme={{...defaultThem, ...SIZE}}>{children}</StyledComponentsThemeProvider>
};

