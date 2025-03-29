import { Trans } from '@lingui/macro'
import styled from 'styled-components'
import { ExternalLink, ThemedText } from 'theme/components'

const StyledLink = styled(ExternalLink)`
  font-weight: 535;
  color: ${({ theme }) => theme.neutral2};
`

const LastUpdatedText = styled.span`
  color: ${({ theme }) => theme.neutral3};
`

const LAST_UPDATED_DATE = '2.16.24'

export default function PrivacyPolicyNotice() {
  // Return null to remove the privacy policy notice
  return null
}
