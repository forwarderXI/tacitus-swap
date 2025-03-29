import { css, keyframes } from 'styled-components'
import { opacify } from './utils'

export const flexColumnNoWrap = css`
  display: flex;
  flex-flow: column nowrap;
`

export const flexRowNoWrap = css`
  display: flex;
  flex-flow: row nowrap;
`

export enum TRANSITION_DURATIONS {
  slow = 500,
  medium = 250,
  fast = 125,
}

const transitions = {
  duration: {
    slow: `${TRANSITION_DURATIONS.slow}ms`,
    medium: `${TRANSITION_DURATIONS.medium}ms`,
    fast: `${TRANSITION_DURATIONS.fast}ms`,
  },
  timing: {
    ease: 'ease',
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
  },
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const textFadeIn = css`
  animation: ${fadeIn} ${transitions.duration.fast} ${transitions.timing.in};
`

const slideDown = keyframes`
from {
  transform: translateY(-20px);
  opacity: 0;
}
to {
  transform: translateY(0);
  opacity: 1;
}
`

export const dropdownSlideDown = css`
  animation: ${slideDown} ${transitions.duration.fast} ${transitions.timing.inOut};
`

export const buttonTextMedium = css`
  font-weight: 535;
  font-size: 16px;
  line-height: 24px;
`

export const buttonTextSmall = css`
  font-weight: 535;
  font-size: 14px;
  line-height: 16px;
`

export function layer(css_: string) {
  return css`
    isolation: isolate;
    position: relative;
    ${css_}
  `
}

export const scrollbarStyle = css`
  overflow-y: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 4px;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.surface3};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.surface3};
  }
`

// Matrix cyberpunk styling utilities
export const matrixGlassCard = css`
  background: rgba(10, 11, 14, 0.8);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 243, 255, 0.2);
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.1);
  
  &:hover {
    border-color: rgba(0, 243, 255, 0.3);
    box-shadow: 0 0 30px rgba(0, 243, 255, 0.2);
  }
`

export const matrixNeonText = css`
  color: ${({ theme }) => theme.accent1};
  text-shadow: 0 0 10px ${({ theme }) => theme.accent1};
`

export const matrixButtonEffect = css`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.accent1};
  color: ${({ theme }) => theme.accent1};
  box-shadow: 0 0 10px ${({ theme }) => opacify(10, theme.accent1)};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => opacify(10, theme.accent1)};
    box-shadow: 0 0 20px ${({ theme }) => opacify(20, theme.accent1)};
  }
`

export const matrixGridBackground = css`
  background-image: 
    linear-gradient(rgba(0, 243, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
`
