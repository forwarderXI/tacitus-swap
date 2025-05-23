import { Currency, Token } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import ms from 'ms'
import { useMemo } from 'react'

import useFeeTierDistributionQuery from '../graphql/thegraph/FeeTierDistributionQuery'
import { PoolState, usePool } from './usePools'

// maximum number of blocks past which we consider the data stale
const MAX_DATA_BLOCK_AGE = 20

interface FeeTierDistribution {
  isLoading: boolean
  isError: boolean
  largestUsageFeeTier?: FeeAmount

  // distributions as percentages of overall liquidity
  distributions?: Record<FeeAmount, number | undefined>
}

export function useFeeTierDistribution(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined
): FeeTierDistribution {
  const { isLoading, error, distributions } = usePoolTVL(currencyA?.wrapped, currencyB?.wrapped)

  // fetch all pool states to determine pool state
  const [poolStateVeryLow] = usePool(currencyA, currencyB, FeeAmount.LOWEST)
  const [poolStateLow] = usePool(currencyA, currencyB, FeeAmount.LOW)
  const [poolStateMedium] = usePool(currencyA, currencyB, FeeAmount.MEDIUM)
  const [poolStateHigh] = usePool(currencyA, currencyB, FeeAmount.HIGH)

  return useMemo(() => {
    if (isLoading || error || !distributions) {
      return {
        isLoading,
        isError: !!error,
        distributions,
      }
    }

    const largestUsageFeeTier = Object.keys(distributions)
      .map((d) => Number(d))
      .filter((d: FeeAmount) => distributions[d] !== 0 && distributions[d] !== undefined)
      .reduce((a: FeeAmount, b: FeeAmount) => ((distributions[a] ?? 0) > (distributions[b] ?? 0) ? a : b), -1)

    const percentages =
      !isLoading &&
      !error &&
      distributions &&
      poolStateVeryLow !== PoolState.LOADING &&
      poolStateLow !== PoolState.LOADING &&
      poolStateMedium !== PoolState.LOADING &&
      poolStateHigh !== PoolState.LOADING
        ? {
            [FeeAmount.LOWEST]:
              poolStateVeryLow === PoolState.EXISTS ? (distributions[FeeAmount.LOWEST] ?? 0) * 100 : undefined,
            [FeeAmount.LOW]: poolStateLow === PoolState.EXISTS ? (distributions[FeeAmount.LOW] ?? 0) * 100 : undefined,
            [FeeAmount.MEDIUM]:
              poolStateMedium === PoolState.EXISTS ? (distributions[FeeAmount.MEDIUM] ?? 0) * 100 : undefined,
            [FeeAmount.HIGH]:
              poolStateHigh === PoolState.EXISTS ? (distributions[FeeAmount.HIGH] ?? 0) * 100 : undefined,
          }
        : undefined

    return {
      isLoading,
      isError: !!error,
      distributions: percentages,
      largestUsageFeeTier: largestUsageFeeTier === -1 ? undefined : largestUsageFeeTier,
    }
  }, [isLoading, error, distributions, poolStateVeryLow, poolStateLow, poolStateMedium, poolStateHigh])
}

function usePoolTVL(token0: Token | undefined, token1: Token | undefined) {
  const latestBlock = useBlockNumber()
  const { isLoading, error, data } = useFeeTierDistributionQuery(token0?.address, token1?.address, ms(`30s`))

  const { asToken0, asToken1, _meta } = data ?? {}

  return useMemo(() => {
    if (!latestBlock || !_meta || !asToken0 || !asToken1) {
      return {
        isLoading,
        error,
      }
    }

    if (latestBlock - (_meta?.block?.number ?? 0) > MAX_DATA_BLOCK_AGE) {
      console.log(`Graph stale (latest block: ${latestBlock})`)
      return {
        isLoading,
        error,
      }
    }

    const all = asToken0.concat(asToken1)

    // sum tvl for token0 and token1 by fee tier
    const tvlByFeeTier = all.reduce<{
      [feeAmount: number]: [number | undefined, number | undefined]
    }>(
      (acc, value) => {
        acc[value.feeTier][0] = (acc[value.feeTier][0] ?? 0) + Number(value.totalValueLockedToken0)
        acc[value.feeTier][1] = (acc[value.feeTier][1] ?? 0) + Number(value.totalValueLockedToken1)
        return acc
      },
      {
        [FeeAmount.LOWEST]: [undefined, undefined],
        [FeeAmount.LOW]: [undefined, undefined],
        [FeeAmount.MEDIUM]: [undefined, undefined],
        [FeeAmount.HIGH]: [undefined, undefined],
      } as Record<FeeAmount, [number | undefined, number | undefined]>
    )

    // sum total tvl for token0 and token1
    const [sumToken0Tvl, sumToken1Tvl] = Object.values(tvlByFeeTier).reduce(
      (acc: [number, number], value) => {
        acc[0] += value[0] ?? 0
        acc[1] += value[1] ?? 0
        return acc
      },
      [0, 0]
    )

    // returns undefined if both tvl0 and tvl1 are undefined (pool not created)
    const mean = (tvl0: number | undefined, sumTvl0: number, tvl1: number | undefined, sumTvl1: number) =>
      tvl0 === undefined && tvl1 === undefined ? undefined : ((tvl0 ?? 0) + (tvl1 ?? 0)) / (sumTvl0 + sumTvl1) || 0

    const distributions: Record<FeeAmount, number | undefined> = {
      [FeeAmount.LOWEST]: mean(
        tvlByFeeTier[FeeAmount.LOWEST][0],
        sumToken0Tvl,
        tvlByFeeTier[FeeAmount.LOWEST][1],
        sumToken1Tvl
      ),
      [FeeAmount.LOW]: mean(tvlByFeeTier[FeeAmount.LOW][0], sumToken0Tvl, tvlByFeeTier[FeeAmount.LOW][1], sumToken1Tvl),
      [FeeAmount.MEDIUM]: mean(
        tvlByFeeTier[FeeAmount.MEDIUM][0],
        sumToken0Tvl,
        tvlByFeeTier[FeeAmount.MEDIUM][1],
        sumToken1Tvl
      ),
      [FeeAmount.HIGH]: mean(
        tvlByFeeTier[FeeAmount.HIGH][0],
        sumToken0Tvl,
        tvlByFeeTier[FeeAmount.HIGH][1],
        sumToken1Tvl
      ),
    }

    return {
      isLoading,
      error,
      distributions,
    }
  }, [_meta, asToken0, asToken1, isLoading, error, latestBlock])
}
