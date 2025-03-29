import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Trans } from '@lingui/macro'
import { Box, H2 } from '../components/Generics'
import { LiquidityCard } from '../components/cards/LiquidityCard'
import { WebappCard } from '../components/cards/WebappCard'

const SectionLayout = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 40px;
  background: linear-gradient(180deg, rgba(0, 243, 255, 0.05) 0%, rgba(0, 102, 255, 0.05) 100%);
  border-radius: 48px;
  box-shadow: 0 0 40px rgba(0, 243, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.5), transparent);
  }

  @media (max-width: 768px) {
    padding: 40px 24px;
    border-radius: 32px;
  }
  
  @media (max-width: 468px) {
    padding: 30px 20px;
    border-radius: 24px;
  }
`

const RowToCol = styled(Box)`
  height: auto;
  flex-shrink: 1;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const SectionCol = styled(Box)`
  flex-direction: column;
  max-width: 1280px;
  gap: 40px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    gap: 32px;
  }
`

const StyledTitle = styled(H2)`
  background: linear-gradient(to right, #00f3ff, #2ABDFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  text-shadow: 0 0 15px rgba(0, 243, 255, 0.3);
  text-align: center;
  margin-bottom: 10px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 25%;
    width: 50%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.8), transparent);
  }
`

const GlowingBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.05;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(0, 243, 255, 0.4) 0%, transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(0, 102, 255, 0.4) 0%, transparent 30%);
`

const DigitalRain = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.03;
  pointer-events: none;
  
  &::before {
    content: '01010110 10101010 01001010 10101010 00110101 01010101';
    position: absolute;
    color: #00f3ff;
    font-family: monospace;
    font-size: 14px;
    white-space: nowrap;
    letter-spacing: 2px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: repeating-linear-gradient(
      transparent 0%,
      transparent 97%,
      #00f3ff 100%
    );
    background-size: 100% 30px;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: digitalRain 10s linear infinite;
  }
  
  @keyframes digitalRain {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(500px);
    }
  }
`

export function DirectToDefi() {
  return (
    <SectionLayout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <GlowingBackground />
      <DigitalRain />
      <SectionCol direction="column" gap="40px" maxWidth="1280px" align="center">
        <StyledTitle>
          <Trans>Go direct to DeFi</Trans>
        </StyledTitle>
        <Box direction="column" gap="24px" width="100%">
          <RowToCol direction="row" gap="24px">
            <WebappCard />
          </RowToCol>
          <RowToCol direction="row" gap="24px">
            <LiquidityCard />
          </RowToCol>
        </Box>
      </SectionCol>
    </SectionLayout>
  )
}
