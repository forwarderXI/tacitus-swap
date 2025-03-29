import { t } from '@lingui/macro'
import styled from 'styled-components'
import { motion } from 'framer-motion'

import { Bars } from '../Icons'
import { PillButton } from './PillButton'
import ValuePropCard from './ValuePropCard'

const GlowingCircle = styled(motion.div)`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(158, 98, 255, 0.2) 0%, rgba(158, 98, 255, 0) 70%);
  right: -50px;
  top: -50px;
  z-index: 0;
  pointer-events: none;
`

const CyberLines = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(158, 98, 255, 0.2), transparent);
    height: 1px;
  }
  
  &::before {
    width: 60%;
    bottom: 30%;
    left: 0;
  }
  
  &::after {
    width: 40%;
    bottom: 40%;
    right: 0;
  }
`

const GridPattern = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  right: 10px;
  bottom: 10px;
  opacity: 0.2;
  background-image: linear-gradient(rgba(158, 98, 255, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(158, 98, 255, 0.3) 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: center center;
  transform: perspective(500px) rotateX(45deg) rotateZ(15deg);
  z-index: 0;
`

const CyberIcon = styled.div`
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  height: 80px;
  opacity: 0.5;
  z-index: 1;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background-color: rgba(158, 98, 255, 0.8);
    border-radius: 4px;
  }
  
  &::before {
    width: 60%;
    height: 8px;
    top: 36px;
    left: 16px;
    box-shadow: 0 0 10px rgba(158, 98, 255, 0.8);
  }
  
  &::after {
    width: 8px;
    height: 60%;
    top: 16px;
    left: 36px;
    box-shadow: 0 0 10px rgba(158, 98, 255, 0.8);
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`

type LiquidityCardProps = {
  isDarkMode?: boolean
}

const primary = '#9E62FF'

export function LiquidityCard(props: LiquidityCardProps) {
  return (
    <ValuePropCard
      to="/pool"
      tagText={t`Provide Liquidity`}
      height="340px"
      isDarkMode={props.isDarkMode}
      textColor={primary}
      backgroundColor={{ dark: 'rgba(136, 63, 255, 0.12)', light: 'rgba(136, 63, 255, 0.06)' }}
      button={<PillButton color={primary} label={t`Liquidity`} icon={<Bars size="24px" fill={primary} />} />}
      titleText={t`Provide liquidity to pools on Tacitus Swap and earn rewards from trading fees.`}
      paddingRight="10%"
      alignTextToBottom
    >
      <GlowingCircle 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <CyberLines />
      <GridPattern />
      <CyberIcon />
    </ValuePropCard>
  )
}
