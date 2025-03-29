import { Trans } from '@lingui/macro'
import { SharedEventName } from '@uniswap/analytics-events'
import { sendAnalyticsEvent } from 'analytics'
import { DarkGrayCard } from 'components/Card'
import Row, { AutoRow, RowBetween } from 'components/Row'
import { useEffect, useRef } from 'react'
import { Info, X } from 'react-feather'
import styled from 'styled-components'
import { ThemedText } from 'theme/components'
import { isMobile } from 'uniswap/src/utils/platform'

import { useModalIsOpen, useTogglePrivacyPolicy } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { AutoColumn } from '../Column'
import Modal from '../Modal'

const Wrapper = styled.div`
  max-height: 70vh;
  overflow: auto;
  padding: 0 1rem;
`

const HoverText = styled.div`
  text-decoration: none;
  color: ${({ theme }) => theme.neutral1};
  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }
`

const EXTERNAL_APIS = [
  {
    name: 'Auto Router',
    description: <Trans>The app fetches the optimal trade route from a Tacitus Swap server.</Trans>,
  },
  {
    name: 'Infura',
    description: <Trans>The app fetches on-chain data and constructs contract calls with an Infura API.</Trans>,
  },
  {
    name: 'TRM Labs',
    description: (
      <Trans>
        The app securely collects your wallet address and shares it with TRM Labs Inc. for risk and compliance
        reasons.
      </Trans>
    ),
  },
  {
    name: 'Google Analytics & Amplitude',
    description: <Trans>The app logs anonymized usage statistics in order to improve over time.</Trans>,
  },
  {
    name: 'The Graph',
    description: <Trans>The app fetches blockchain data from The Graph&apos;s hosted service.</Trans>,
  },
]

export function PrivacyPolicyModal() {
  const node = useRef<HTMLDivElement>()
  const open = useModalIsOpen(ApplicationModal.PRIVACY_POLICY)
  const toggle = useTogglePrivacyPolicy()

  useEffect(() => {
    if (!open) return

    sendAnalyticsEvent(SharedEventName.PAGE_VIEWED, {
      category: 'Modal',
      action: 'Show Legal',
    })
  }, [open])

  return (
    <Modal isOpen={open} onDismiss={() => toggle()}>
      <AutoColumn gap="md" ref={node as any}>
        <RowBetween padding="1rem 1rem 0.5rem 1rem">
          <ThemedText.DeprecatedMediumHeader>
            <Trans>Third-Party Services</Trans>
          </ThemedText.DeprecatedMediumHeader>
          <HoverText onClick={() => toggle()}>
            <X size={24} />
          </HoverText>
        </RowBetween>
        <PrivacyPolicy />
      </AutoColumn>
    </Modal>
  )
}

function PrivacyPolicy() {
  return (
    <Wrapper
      draggable="true"
      onTouchMove={(e) => {
        // prevent modal gesture handler from dismissing modal when content is scrolling
        if (isMobile) {
          e.stopPropagation()
        }
      }}
    >
      <AutoColumn gap="16px">
        <ThemedText.DeprecatedMain fontSize={14}>
          <Trans>This app uses the following third-party services:</Trans>
        </ThemedText.DeprecatedMain>
        <AutoColumn gap="md">
          {EXTERNAL_APIS.map(({ name, description }, i) => (
            <DarkGrayCard key={i}>
              <AutoColumn gap="sm">
                <AutoRow gap="4px">
                  <Info size={18} />
                  <ThemedText.DeprecatedMain fontSize={14} color="neutral1">
                    {name}
                  </ThemedText.DeprecatedMain>
                </AutoRow>
                <ThemedText.DeprecatedMain fontSize={14}>{description}</ThemedText.DeprecatedMain>
              </AutoColumn>
            </DarkGrayCard>
          ))}
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}
