import { t, Trans } from '@lingui/macro'
import Row from 'components/Row'
import { ProtocolVersion, useDailyProtocolVolumeQuery } from 'graphql/data/__generated__/types-and-hooks'
import { useMemo } from 'react'
import { ArrowRightCircle } from 'react-feather'
import styled from 'styled-components'
import { ClickableStyle, ExternalLink } from 'theme/components'
import { NumberType, useFormatter } from 'utils/formatNumbers'

import { Body1, Box, H2 } from '../components/Generics'
import { StatCard } from '../components/StatCard'
import { useInView } from './useInView'

// Component has been removed as requested
export function Stats() {
  return null
}
