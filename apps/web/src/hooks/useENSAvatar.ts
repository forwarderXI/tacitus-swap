import { BigNumber } from '@ethersproject/bignumber'
import { hexZeroPad } from '@ethersproject/bytes'
import { useWeb3React } from '@web3-react/core'
import { NEVER_RELOAD, useMainnetSingleCallResult } from 'lib/hooks/multicall'
import uriToHttp from 'lib/utils/uriToHttp'
import { useEffect, useMemo, useState } from 'react'
import { safeNamehash } from 'utils/safeNamehash'

import { isAddress } from 'utilities/src/addresses'
import isZero from '../utils/isZero'
import { useENSRegistrarContract, useENSResolverContract, useERC1155Contract, useERC721Contract } from './useContract'
import useDebounce from './useDebounce'
import useENSName from './useENSName'

/**
 * Returns the ENS avatar URI, if available.
 * Spec: https://gist.github.com/Arachnid/9db60bd75277969ee1689c8742b75182.
 */
export default function useENSAvatar(
  address?: string,
  enforceOwnership = true
): { avatar: string | null; loading: boolean } {
  const debouncedAddress = useDebounce(address, 200)
  const node = useMemo(() => {
    if (!debouncedAddress || !isAddress(debouncedAddress)) return undefined
    return safeNamehash(`${debouncedAddress.toLowerCase().substr(2)}.addr.reverse`)
  }, [debouncedAddress])

  const addressAvatar = useAvatarFromNode(node)
  const ENSName = useENSName(address).ENSName
  const nameAvatar = useAvatarFromNode(ENSName === null ? undefined : safeNamehash(ENSName))
  let avatar = addressAvatar.avatar || nameAvatar.avatar

  const nftAvatar = useAvatarFromNFT(avatar, enforceOwnership)
  avatar = nftAvatar.avatar || avatar

  const http = avatar && uriToHttp(avatar)[0]

  const changed = debouncedAddress !== address
  return useMemo(
    () => ({
      avatar: changed ? null : http ?? null,
      loading: changed || addressAvatar.loading || nameAvatar.loading || nftAvatar.loading,
    }),
    [addressAvatar.loading, changed, http, nameAvatar.loading, nftAvatar.loading]
  )
}

function useAvatarFromNode(node?: string): {
  avatar?: string
  loading: boolean
} {
  const nodeArgument = useMemo(() => [node], [node])
  const textArgument = useMemo(() => [node, 'avatar'], [node])
  const registrarContract = useENSRegistrarContract()
  const resolverAddress = useMainnetSingleCallResult(registrarContract, 'resolver', nodeArgument, NEVER_RELOAD)
  const resolverAddressResult = resolverAddress.result?.[0]
  const resolverContract = useENSResolverContract(
    resolverAddressResult && !isZero(resolverAddressResult) ? resolverAddressResult : undefined
  )
  const avatar = useMainnetSingleCallResult(resolverContract, 'text', textArgument, NEVER_RELOAD)

  return useMemo(
    () => ({
      avatar: avatar.result?.[0],
      loading: resolverAddress.loading || avatar.loading,
    }),
    [avatar.loading, avatar.result, resolverAddress.loading]
  )
}

function useAvatarFromNFT(nftUri = '', enforceOwnership: boolean): { avatar?: string; loading: boolean } {
  const parts = nftUri.toLowerCase().split(':')
  const protocol = parts[0]
  // ignore the chain from eip155
  // TODO: when we are able, pull only from the specified chain
  const [, erc] = parts[1]?.split('/') ?? []
  const [contractAddress, id] = parts[2]?.split('/') ?? []
  const isERC721 = protocol === 'eip155' && erc === 'erc721'
  const isERC1155 = protocol === 'eip155' && erc === 'erc1155'
  const erc721 = useERC721Uri(isERC721 ? contractAddress : undefined, isERC721 ? id : undefined, enforceOwnership)
  const erc1155 = useERC1155Uri(isERC1155 ? contractAddress : undefined, isERC1155 ? id : undefined, enforceOwnership)
  const uri = erc721.uri || erc1155.uri
  const http = uri && uriToHttp(uri)[0]

  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState(undefined)
  useEffect(() => {
    setAvatar(undefined)
    if (http) {
      setLoading(true)
      fetch(http)
        .then((res) => res.json())
        .then(({ image }) => {
          setAvatar(image)
        })
        .catch((e) => console.warn(e))
        .finally(() => {
          setLoading(false)
        })
    }
  }, [http])

  return useMemo(
    () => ({ avatar, loading: erc721.loading || erc1155.loading || loading }),
    [avatar, erc1155.loading, erc721.loading, loading]
  )
}

function useERC721Uri(
  contractAddress: string | undefined,
  id: string | undefined,
  enforceOwnership: boolean
): { uri?: string; loading: boolean } {
  const idArgument = useMemo(() => [id], [id])
  const { account } = useWeb3React()
  const contract = useERC721Contract(contractAddress)
  const owner = useMainnetSingleCallResult(contract, 'ownerOf', idArgument, NEVER_RELOAD)
  const uri = useMainnetSingleCallResult(contract, 'tokenURI', idArgument, NEVER_RELOAD)
  return useMemo(
    () => ({
      uri: !enforceOwnership || account === owner.result?.[0] ? uri.result?.[0] : undefined,
      loading: owner.loading || uri.loading,
    }),
    [account, enforceOwnership, owner.loading, owner.result, uri.loading, uri.result]
  )
}

function useERC1155Uri(
  contractAddress: string | undefined,
  id: string | undefined,
  enforceOwnership: boolean
): { uri?: string; loading: boolean } {
  const { account } = useWeb3React()
  const idArgument = useMemo(() => [id], [id])
  const accountArgument = useMemo(() => [account || '', id], [account, id])
  const contract = useERC1155Contract(contractAddress)
  const balance = useMainnetSingleCallResult(contract, 'balanceOf', accountArgument, NEVER_RELOAD)
  const uri = useMainnetSingleCallResult(contract, 'uri', idArgument, NEVER_RELOAD)
  return useMemo(() => {
    try {
      // ERC-1155 allows a generic {id} in the URL, so prepare to replace if relevant,
      // in lowercase hexadecimal (with no 0x prefix) and leading zero padded to 64 hex characters.
      const idHex = id ? hexZeroPad(BigNumber.from(id).toHexString(), 32).substring(2) : id
      return {
        uri: !enforceOwnership || balance.result?.[0] > 0 ? uri.result?.[0]?.replaceAll('{id}', idHex) : undefined,
        loading: balance.loading || uri.loading,
      }
    } catch (error) {
      console.error('Invalid token id', error)
      return { loading: false }
    }
  }, [balance.loading, balance.result, enforceOwnership, uri.loading, uri.result, id])
}
