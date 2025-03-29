import { Trans } from '@lingui/macro'
import { useScreenSize } from 'hooks/useScreenSize'
import { Link } from 'react-router-dom'
import { useTogglePrivacyPolicy } from 'state/application/hooks'
import styled, { css } from 'styled-components'
import { ExternalLink } from 'theme/components'

import { Wiggle } from '../components/animations'
import { Body1, Box, H3 } from '../components/Generics'
import { Email, Github, LinkedIn } from '../components/Icons'

const FooterContainer = styled(Box)`
  position: relative;
  padding-top: 40px;
  background: linear-gradient(180deg, rgba(0, 243, 255, 0.02) 0%, rgba(0, 102, 255, 0.03) 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 25%;
    right: 25%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.3), transparent);
  }
`

const SocialIcon = styled(Wiggle)`
  flex: 0;
  fill: ${(props) => props.theme.neutral1};
  cursor: pointer;
  transition: fill 0.2s ease;
  margin-right: 16px;
  
  &:hover {
    fill: ${(props) => props.$hoverColor};
    filter: drop-shadow(0 0 8px ${(props) => props.$hoverColor}80);
  }
`

const TextSocialLink = styled.span<{ hoverColor: string }>`
  font-family: 'Basel';
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => props.theme.neutral1};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${(props) => props.hoverColor};
    text-shadow: 0 0 8px ${(props) => props.hoverColor}60;
    transform: translateY(-1px);
  }
`

const FooterSection = styled(Box)`
  display: flex;
  flex-direction: column;
`

const FooterGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`

const MenuItemStyles = css`
  padding: 0;
  margin: 0;
  text-align: left;
  font-family: Basel;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.neutral2};
  stroke: none;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  position: relative;
  display: block;
  margin-bottom: 12px;
  
  &:hover {
    color: ${({ theme }) => theme.neutral1};
    opacity: 1;
    text-shadow: 0 0 8px ${({ theme }) => theme.white}40;
    transform: translateX(2px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, ${({ theme }) => theme.accent1}, transparent);
    transition: width 0.2s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`

const StyledInternalLink = styled(Link)`
  ${MenuItemStyles}
`

const StyledExternalLink = styled(ExternalLink)`
  ${MenuItemStyles}
`

const ContactInfo = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(3px);
  }
  
  svg {
    margin-right: 10px;
    color: ${({ theme }) => theme.neutral2};
  }
`

const ContactText = styled.span`
  color: ${({ theme }) => theme.neutral2};
  font-size: 14px;
  font-family: Basel;
  transition: all 0.2s ease;
  
  ${StyledExternalLink}:hover & {
    color: ${({ theme }) => theme.neutral1};
  }
`

const ModalItem = styled.div`
  ${MenuItemStyles}
  cursor: pointer;
  user-select: none;
`

const CopyrightText = styled(H3)`
  background: linear-gradient(to right, #00f3ff, #2ABDFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  text-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
  margin-bottom: 4px;
`

const SectionTitle = styled(Body1)`
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.accent1};
  text-shadow: 0 0 8px ${({ theme }) => theme.accent1}30;
`

const SocialLinks = styled(Box)`
  display: flex;
  align-items: center;
  margin-top: 24px;
`

// Export this component to be used by other parts of the application
export function Socials({ iconSize }: { iconSize?: string }) {
  return (
    <Box style={{ display: 'flex', alignItems: 'center' }}>
      <SocialIcon $hoverColor="#00C32B">
        <StyledExternalLink href="https://github.com/TacitusXI">
          <Github size={iconSize || "24"} fill="inherit" />
        </StyledExternalLink>
      </SocialIcon>
      
      <SocialIcon $hoverColor="#0077B5">
        <StyledExternalLink href="https://www.linkedin.com/in/ivan-leskov/">
          <LinkedIn size={iconSize || "24"} fill="inherit" />
        </StyledExternalLink>
      </SocialIcon>
      
      <StyledExternalLink href="https://medium.com/@ivanlieskov" style={{ marginLeft: '6px' }}>
        <TextSocialLink hoverColor="#00AB6C">Medium</TextSocialLink>
      </StyledExternalLink>
    </Box>
  )
}

export function Footer() {
  const screenIsLarge = useScreenSize()['lg']
  const togglePrivacyPolicy = useTogglePrivacyPolicy()

  return (
    <FooterContainer as="footer" direction="column" align="center" padding={screenIsLarge ? '0 40px 48px' : '0 24px 40px'}>
      <Box direction="column" width="100%" maxWidth="1280px">
        <FooterGrid>
          <FooterSection>
            <Box style={{ marginBottom: '20px' }}>
              <CopyrightText>© 2025</CopyrightText>
              <CopyrightText>TacitusXI</CopyrightText>
            </Box>
            
            <StyledExternalLink href="mailto:ivan.leskov@protonmail.com">
              <ContactInfo>
                <Email size="16px" fill="currentColor" />
                <ContactText>ivan.leskov@protonmail.com</ContactText>
              </ContactInfo>
            </StyledExternalLink>
            
            <SocialLinks>
              <Socials />
            </SocialLinks>
          </FooterSection>
          
          <FooterSection>
            <SectionTitle>Navigation</SectionTitle>
            <StyledInternalLink to="/swap">
              <Trans>Swap</Trans>
            </StyledInternalLink>
            <StyledInternalLink to="/tokens/ethereum">
              <Trans>Tokens</Trans>
            </StyledInternalLink>
            <StyledInternalLink to="/nfts">
              <Trans>NFTs</Trans>
            </StyledInternalLink>
            <StyledInternalLink to="/pool">
              <Trans>Pool</Trans>
            </StyledInternalLink>
          </FooterSection>
          
          <FooterSection>
            <SectionTitle>Legal</SectionTitle>
            <ModalItem onClick={togglePrivacyPolicy}>
              <Trans>Third-Party Services</Trans>
            </ModalItem>
          </FooterSection>
        </FooterGrid>
      </Box>
    </FooterContainer>
  )
}
