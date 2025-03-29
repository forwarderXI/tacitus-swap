import { ColumnCenter } from 'components/Column'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { vars } from 'nft/css/sprinkles.css'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { BREAKPOINTS } from 'theme'
import { ThemedText } from 'theme/components'

import { Menu } from './Menu'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex: grow;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 4px 0px;
`
const IconContainer = styled(ColumnCenter)<{ isActive: boolean }>`
  min-height: 100%;
  justify-content: center;
  border-radius: 14px;
  padding: 9px 14px;
  cursor: pointer;
  color: ${({ isActive, theme }) => (isActive ? theme.neutral1 : theme.neutral2)};
  :hover {
    background: ${vars.color.lightGrayOverlay};
  }
`

const MenuText = styled(ThemedText.SubHeader)<{ isActive: boolean }>`
  font-size: 14px;
  transition: color 0.2s ease;
  color: ${({ isActive, theme }) => (isActive ? theme.accent1 : theme.neutral2)};
`

export function More() {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setIsOpen(false))

  return (
    <Wrapper ref={ref}>
      <IconContainer isActive={isOpen} onClick={() => setIsOpen(!isOpen)} data-testid="nav-more-button">
        <MenuText isActive={isOpen}>Menu</MenuText>
      </IconContainer>
      {isOpen && <Menu close={() => setIsOpen(false)} />}
    </Wrapper>
  )
}
