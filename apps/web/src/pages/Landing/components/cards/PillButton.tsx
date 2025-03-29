import { motion, MotionProps } from 'framer-motion'
import styled from 'styled-components'

import { Box } from '../Generics'
import { ArrowRight } from '../Icons'

const Button = styled(motion.button)<{ cursor?: string; color?: string }>`
  display: flex;
  padding: 12px 16px;
  border-radius: 24px;
  gap: 8px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ color }) => color ? `${color}30` : 'transparent'};
  background-color: ${({ theme }) => theme.surface1};
  overflow: hidden;
  cursor: ${({ cursor }) => cursor ?? 'pointer'};
  flex: none;
  position: relative;
  box-shadow: 0 0 10px ${({ color }) => color ? `${color}20` : 'transparent'};
  transition: box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out;
  
  &:hover {
    box-shadow: 0 0 20px ${({ color }) => color ? `${color}40` : 'transparent'};
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ color }) => color ? `linear-gradient(135deg, ${color}10, transparent 80%)` : 'transparent'};
    border-radius: inherit;
    z-index: 0;
  }
`

const Slider = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 1;
`

const Label = styled.span`
  color: ${(props) => props.color};
  font-family: Basel;
  font-size: 20px;
  @media (max-width: 1024px) {
    font-size: 18px;
  }
  font-style: normal;
  font-weight: 535;
  line-height: 24px; /* 120% */
  flex: none;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: ${(props) => props.color};
    transition: width 0.3s ease;
  }
  
  ${Button}:hover &::after {
    width: 100%;
  }
`

type OpacityProps = {
  opacity: number
}

const Opacity = styled(motion.div)<OpacityProps & MotionProps>`
  flex: 0;
  display: flex;
  overflow: visible;
  opacity: ${(props) => props.opacity};
`

type PillButtonProps = {
  label: string
  icon: React.ReactNode
  color?: string
  cursor?: string
  onClick?: () => void
}

export function PillButton(props: PillButtonProps) {
  const variants = {
    intial: {
      x: 0,
    },
    hover: {
      x: -24,
    },
  }
  const icnVars = {
    intial: {
      opacity: 1,
      scale: 1,
    },
    hover: {
      opacity: 0,
      scale: 0.8,
    },
  }

  const arrowVars = {
    intial: {
      opacity: 0,
      x: -10,
    },
    hover: {
      opacity: 1,
      x: 0,
    },
  }

  return (
    <Button transition={{ delayChildren: 0 }} cursor={props.cursor} color={props.color}>
      <Slider variants={variants}>
        <Opacity opacity={1} variants={icnVars}>
          {props.icon}
        </Opacity>
        <Label color={props.color}>{props.label}</Label>
        <Opacity opacity={0} variants={arrowVars}>
          <Box width="0px" overflow="visible">
            <ArrowRight size="24px" fill={props.color} />
          </Box>
        </Opacity>
      </Slider>
    </Button>
  )
}
