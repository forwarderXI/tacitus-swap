import { t } from '@lingui/macro'
import { ChainId } from '@uniswap/sdk-core'
import { PortfolioLogo } from 'components/AccountDrawer/MiniPortfolio/PortfolioLogo'
import { DeltaArrow } from 'components/Tokens/TokenDetails/Delta'
import { LDO, NATIVE_CHAIN_ID, WBTC, USDT as USDT_MAINNET } from 'constants/tokens'
import { useTokenPromoQuery } from 'graphql/data/__generated__/types-and-hooks'
import { chainIdToBackendName, getTokenDetailsURL } from 'graphql/data/util'
import { useCurrency } from 'hooks/Tokens'
import { useScreenSize } from 'hooks/useScreenSize'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { NumberType, useFormatter } from 'utils/formatNumbers'

import { useCallback } from 'react'
import { Box } from '../Generics'
import { Computer } from '../Icons'
import { PillButton } from './PillButton'
import ValuePropCard from './ValuePropCard'

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 32px;
  padding-bottom: 32px;
  @media (max-width: 1024px) {
    padding: 24px;
    padding-bottom: 32px;
  }
  @media (max-width: 396px) {
    padding: 16px;
    padding-bottom: 24px;
  }
`

const TokenRow = styled.div`
  width: 100%;
  height: 72px;
  overflow: hidden;
  padding: 16px;
  padding-right: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.surface1};
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.1);
  border: 1px solid rgba(0, 243, 255, 0.1);
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(0, 243, 255, 0.03), transparent);
    z-index: -1;
    border-radius: inherit;
  }
  
  @media (max-width: 1024px) {
    height: 64px;
    padding-right: 16px;
  }
  @media (max-width: 768px) {
    height: 56px;
    padding-right: 16px;
  }
  @media (max-width: 468px) {
    height: 48px;
    padding: 12px;
    border-radius: 16px;
  }
  transition: all 200ms ease-in-out;
  
  &:hover {
    background-color: ${({ theme }) => theme.surface2};
    transform: scale(1.03) translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 243, 255, 0.2);
    border: 1px solid rgba(0, 243, 255, 0.2);
  }
`
const TokenName = styled.h3`
  padding: 0;
  margin: 0;
  font-family: Basel;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${(props) => props.color || props.theme.neutral1};
  @media (max-width: 1024px) {
    font-size: 18px;
    line-height: 24px;
  }
  @media (max-width: 468px) {
    font-size: 16px;
    line-height: 20px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoint.xs}px) {
    display: none;
  }
`
const TokenTicker = styled.h3`
  padding: 0;
  margin: 0;
  font-family: Basel;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
  color: ${(props) => props.color || props.theme.neutral2};
  @media (max-width: 1024px) {
    font-size: 18px;
    line-height: 24px;
  }
  @media (max-width: 468px) {
    font-size: 16px;
    line-height: 20px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoint.xs}px) {
    color: ${(props) => props.color || props.theme.neutral1};
  }
`
const TokenPrice = styled.h3`
  padding: 0;
  margin: 0;
  font-family: Basel;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 32px;
  color: ${(props) => props.color || props.theme.neutral1};
  @media (max-width: 1024px) {
    font-size: 18px;
    line-height: 24px;
  }
  @media (max-width: 468px) {
    font-size: 16px;
    line-height: 20px;
  }
`
const DeltaText = styled.h3`
  text-align: right;
  padding: 0;
  margin: 0;
  font-family: Basel;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 32px;
  color: ${(props) => (props.color === 'red' ? props.theme.critical : props.theme.success)};
  @media (max-width: 1024px) {
    font-size: 18px;
    line-height: 24px;
    width: 50px;
  }
  @media (max-width: 468px) {
    font-size: 16px;
    line-height: 20px;
    width: 50px;
  }
`
const DeltaContainer = styled(Box)`
  @media (min-width: 1030px) and (max-width: 1150px) {
    display: none;
  }
  @media (min-width: 767px) and (max-width: 915px) {
    display: none;
  }
`

type WebappCardProps = {
  isDarkMode?: boolean
  tagText?: string
}

const primary = '#2ABDFF'

const tokens = [
  {
    chainId: ChainId.MAINNET,
    address: 'ETH',
  },
  {
    chainId: ChainId.MAINNET,
    address: WBTC.address,
  },
  {
    chainId: ChainId.MAINNET,
    address: USDT_MAINNET.address,
  },
  {
    chainId: ChainId.MAINNET,
    address: LDO.address,
  },
]

function Token({ chainId, address }: { chainId: ChainId; address: string }) {
  const screenIsSmall = useScreenSize()['sm']
  const navigate = useNavigate()
  const { formatFiatPrice, formatDelta } = useFormatter()
  const currency = useCurrency(address, chainId)
  const tokenPromoQuery = useTokenPromoQuery({
    variables: {
      address: currency?.wrapped.address,
      chain: chainIdToBackendName(chainId),
    },
  })
  const price = tokenPromoQuery.data?.token?.market?.price?.value ?? 0
  const pricePercentChange = tokenPromoQuery.data?.token?.market?.pricePercentChange?.value ?? 0
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      navigate(
        getTokenDetailsURL({
          address: address === 'ETH' ? NATIVE_CHAIN_ID : address,
          chain: chainIdToBackendName(chainId),
        })
      )
    },
    [address, chainId, navigate]
  )
  return (
    <TokenRow onClick={handleClick}>
      <PortfolioLogo currencies={[currency]} chainId={chainId} size={screenIsSmall ? '32px' : '24px'} />
      <Box justify="space-between" gap="16px">
        <Box width="auto" gap="8px" align="center" overflow="hidden">
          <TokenName>{currency?.name}</TokenName>
          <TokenTicker>{currency?.symbol}</TokenTicker>
        </Box>
        <Box width="auto" gap="8px" align="center">
          <TokenPrice>
            {formatFiatPrice({
              price,
              type: NumberType.FiatTokenPrice,
            })}
          </TokenPrice>
          <DeltaContainer gap="4px" align="center" justify="flex-end">
            <DeltaArrow delta={pricePercentChange} />
            <DeltaText color={pricePercentChange < 0 ? 'red' : 'green'}>{formatDelta(pricePercentChange)}</DeltaText>
          </DeltaContainer>
        </Box>
      </Box>
    </TokenRow>
  )
}

export function WebappCard(props: WebappCardProps) {
  return (
    <ValuePropCard
      to="/tokens/ethereum"
      minHeight="450px"
      isDarkMode={props.isDarkMode}
      textColor={primary}
      backgroundColor={{ dark: 'rgba(0, 102, 255, 0.12)', light: 'rgba(0, 102, 255, 0.04)' }}
      button={<PillButton color={primary} label={t`Web app`} icon={<Computer size="24px" fill={primary} />} />}
      titleText={t`Access tokens, trading, and Tacitus Swap protocol features through our streamlined web interface.`}
    >
      <Contents>
        <Box direction="column" gap="8px" width="100%">
          {tokens.map((token) => (
            <Token key={`${token.chainId}-${token.address}`} chainId={token.chainId} address={token.address} />
          ))}
        </Box>
      </Contents>
    </ValuePropCard>
  )
}
