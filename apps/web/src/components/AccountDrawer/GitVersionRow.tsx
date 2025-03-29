import { Trans } from '@lingui/macro'
import Tooltip from 'components/Tooltip'
import useCopyClipboard from 'hooks/useCopyClipboard'
import styled from 'styled-components'
import { ThemedText } from 'theme/components'

const Container = styled.div`
  width: 100%;
  cursor: pointer;
`

export function GitVersionRow() {
  // Return null to remove the version information from the UI
  return null
}
