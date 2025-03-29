import styled from 'styled-components'
import tacitusLogo from '../../assets/images/tacitusswap-logo.png'

interface TacitusIconProps {
  width?: string | number
  height?: string | number
  clickable?: boolean
  onClick?: () => void
  className?: string
}

export const TacitusIcon = ({ 
  clickable, 
  width = '48', 
  height = '48', 
  onClick,
  className
}: TacitusIconProps) => (
  <Container clickable={clickable} onClick={onClick} className={className}>
    <img src={tacitusLogo} alt="Tacitus Swap" width={width} height={height} />
  </Container>
)

const Container = styled.div<{ clickable?: boolean }>`
  position: relative;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'auto')};
` 