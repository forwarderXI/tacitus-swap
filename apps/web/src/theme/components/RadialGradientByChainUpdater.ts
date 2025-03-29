import { ChainId } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { useIsNftPage } from 'hooks/useIsNftPage'
import { useEffect } from 'react'
import { useDarkModeManager } from 'theme/components/ThemeToggle'

import { darkTheme, lightTheme } from '../colors'

const initialStyles = {
  width: '200vw',
  height: '200vh',
  transform: 'translate(-50vw, -100vh)',
}
const backgroundResetStyles = {
  width: '100vw',
  height: '100vh',
  transform: 'unset',
}

type TargetBackgroundStyles = typeof initialStyles | typeof backgroundResetStyles

const backgroundRadialGradientElement = document.getElementById('background-radial-gradient')
const setBackground = (newValues: TargetBackgroundStyles) =>
  Object.entries(newValues).forEach(([key, value]) => {
    if (backgroundRadialGradientElement) {
      backgroundRadialGradientElement.style[key as keyof typeof backgroundResetStyles] = value
    }
  })

function setDefaultBackground(backgroundRadialGradientElement: HTMLElement, darkMode?: boolean) {
  setBackground(initialStyles)
  // Matrix cyberpunk gradient for dark mode (always used now)
  const matrixGradient = 'radial-gradient(circle at top center, rgba(0, 243, 255, 0.1) 0%, rgba(123, 47, 247, 0.05) 25%, rgba(10, 11, 14, 1) 80%)'
  // For light mode - keeping this for compatibility but we'll use dark mode for Matrix theme
  const defaultLightGradient = 'radial-gradient(100% 100% at 50% 0%, rgba(255, 184, 226, 0) 0%, rgba(255, 255, 255, 0) 100%), #FFFFFF'
  
  backgroundRadialGradientElement.style.background = darkMode ? matrixGradient : defaultLightGradient
}

export default function RadialGradientByChainUpdater(): null {
  const { chainId } = useWeb3React()
  const [darkMode] = useDarkModeManager()
  const isNftPage = useIsNftPage()

  // manage background color
  useEffect(() => {
    if (!backgroundRadialGradientElement) {
      return
    }

    if (isNftPage) {
      setBackground(initialStyles)
      // Matrix theme for NFT pages
      const matrixNftGradient = 'radial-gradient(circle at top center, rgba(0, 243, 255, 0.15) 0%, rgba(123, 47, 247, 0.1) 30%, rgba(10, 11, 14, 1) 70%)'
      backgroundRadialGradientElement.style.background = matrixNftGradient
      return
    }

    // Matrix cyberpunk gradient - applied to all chains for consistent styling
    const matrixGradient = 'radial-gradient(circle at top center, rgba(0, 243, 255, 0.1) 0%, rgba(123, 47, 247, 0.05) 25%, rgba(10, 11, 14, 1) 80%)'
    
    switch (chainId) {
      case ChainId.ARBITRUM_ONE:
      case ChainId.ARBITRUM_GOERLI: {
        setBackground(backgroundResetStyles)
        // Add a slight blue tint for Arbitrum while maintaining the Matrix theme
        const arbitrumMatrixGradient = 'radial-gradient(circle at top center, rgba(0, 123, 255, 0.15) 0%, rgba(123, 47, 247, 0.08) 30%, rgba(10, 11, 14, 1) 80%)'
        backgroundRadialGradientElement.style.background = arbitrumMatrixGradient
        break
      }
      case ChainId.OPTIMISM:
      case ChainId.OPTIMISM_GOERLI: {
        setBackground(backgroundResetStyles)
        // Add a slight red tint for Optimism while maintaining the Matrix theme
        const optimismMatrixGradient = 'radial-gradient(circle at top center, rgba(255, 0, 65, 0.12) 0%, rgba(123, 47, 247, 0.08) 30%, rgba(10, 11, 14, 1) 80%)'
        backgroundRadialGradientElement.style.background = optimismMatrixGradient
        break
      }
      case ChainId.POLYGON:
      case ChainId.POLYGON_MUMBAI: {
        setBackground(backgroundResetStyles)
        // Add a slight purple tint for Polygon while maintaining the Matrix theme
        const polygonMatrixGradient = 'radial-gradient(circle at top center, rgba(130, 71, 229, 0.15) 0%, rgba(0, 243, 255, 0.08) 30%, rgba(10, 11, 14, 1) 80%)'
        backgroundRadialGradientElement.style.background = polygonMatrixGradient
        break
      }
      case ChainId.BASE: {
        setBackground(backgroundResetStyles)
        // Add a slight blue tint for Base while maintaining the Matrix theme
        const baseMatrixGradient = 'radial-gradient(circle at top center, rgba(0, 82, 255, 0.15) 0%, rgba(0, 243, 255, 0.08) 30%, rgba(10, 11, 14, 1) 80%)'
        backgroundRadialGradientElement.style.background = baseMatrixGradient
        break
      }
      // Default Matrix gradient for other chains
      default: {
        setBackground(backgroundResetStyles)
        backgroundRadialGradientElement.style.background = matrixGradient
      }
    }
  }, [darkMode, chainId, isNftPage])
  return null
}
