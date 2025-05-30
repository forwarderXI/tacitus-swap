import { Trans } from '@lingui/macro'
import Row from 'components/Row'
import { atom, useAtom } from 'jotai'
import { atomWithStorage, useAtomValue, useUpdateAtom } from 'jotai/utils'
import ms from 'ms'
import { useCallback, useEffect, useMemo } from 'react'
import { Moon, Sun } from 'react-feather'
import { addMediaQueryListener, removeMediaQueryListener } from 'utils/matchMedia'

import { Segment, SegmentedControl } from './SegmentedControl'
import { ThemedText } from './text'

const THEME_UPDATE_DELAY = ms(`0.1s`)
const DARKMODE_MEDIA_QUERY = window.matchMedia('(prefers-color-scheme: dark)')

export enum ThemeMode {
  LIGHT,
  DARK,
  AUTO,
}

// Tracks the device theme
const systemThemeAtom = atom<ThemeMode.LIGHT | ThemeMode.DARK>(
  DARKMODE_MEDIA_QUERY.matches ? ThemeMode.DARK : ThemeMode.LIGHT
)

// Tracks the user's selected theme mode
const themeModeAtom = atomWithStorage<ThemeMode>('interface_color_theme', ThemeMode.DARK)

export function SystemThemeUpdater() {
  const setSystemTheme = useUpdateAtom(systemThemeAtom)

  const listener = useCallback(
    (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? ThemeMode.DARK : ThemeMode.LIGHT)
    },
    [setSystemTheme]
  )

  useEffect(() => {
    addMediaQueryListener(DARKMODE_MEDIA_QUERY, listener)
    return () => removeMediaQueryListener(DARKMODE_MEDIA_QUERY, listener)
  }, [setSystemTheme, listener])

  return null
}

export function ThemeColorMetaUpdater() {
  const isDark = useIsDarkMode()

  useEffect(() => {
    const meta = document.querySelector('meta[name=theme-color]')
    if (!meta) return

    if (isDark) {
      // this color comes from #background-radial-gradient
      meta.setAttribute('content', 'rgb(19, 19, 19)')
    } else {
      meta.setAttribute('content', '#fff')
    }
  }, [isDark])

  return null
}

export function useIsDarkMode(): boolean {
  const mode = useAtomValue(themeModeAtom)
  const systemTheme = useAtomValue(systemThemeAtom)

  // Always return true to force dark mode
  return true
}

export function useDarkModeManager(): [boolean, (mode: ThemeMode) => void] {
  const isDarkMode = useIsDarkMode()
  const setMode = useUpdateAtom(themeModeAtom)

  return useMemo(() => {
    return [isDarkMode, setMode]
  }, [isDarkMode, setMode])
}

export default function ThemeToggle({ disabled }: { disabled?: boolean }) {
  // Return null to remove the theme toggle component
  return null
}
