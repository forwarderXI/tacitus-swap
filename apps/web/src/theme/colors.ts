// Based mostly on https://github.com/Uniswap/interface/blob/main/src/theme/index.tsx

export const colors = {
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F5F6FC',
  gray100: '#E8ECFB',
  gray150: '#D2D9EE',
  gray200: '#B8C0DC',
  gray250: '#A6AFCA',
  gray300: '#98A1C0',
  gray350: '#888FAB',
  gray400: '#7780A0',
  gray450: '#6B7594',
  gray500: '#5D6785',
  gray550: '#505A78',
  gray600: '#404A67',
  gray650: '#333D59',
  gray700: '#293249',
  gray750: '#1B2236',
  gray800: '#131A2A',
  gray850: '#0E1524',
  gray900: '#0D111C',
  gray950: '#080B11',
  pink50: '#F9ECF1',
  pink100: '#FFD9E4',
  pink200: '#FBA4C0',
  pink300: '#FF6FA3',
  pink400: '#FB118E',
  pink500: '#C41969',
  pink600: '#8C0F49',
  pink700: '#55072A',
  pink800: '#350318',
  pink900: '#2B000B',
  pinkBase: '#FC74FE',
  pinkVibrant: '#F50DB4',
  red50: '#FAECEA',
  red100: '#FED5CF',
  red200: '#FEA79B',
  red300: '#FD766B',
  red400: '#FA2B39',
  red500: '#C4292F',
  red600: '#891E20',
  red700: '#530F0F',
  red800: '#380A03',
  red900: '#240800',
  redVibrant: '#F14544',
  yellow50: '#F6F2D5',
  yellow100: '#DBBC19',
  yellow200: '#DBBC19',
  yellow300: '#BB9F13',
  yellow400: '#A08116',
  yellow500: '#866311',
  yellow600: '#5D4204',
  yellow700: '#3E2B04',
  yellow800: '#231902',
  yellow900: '#180F02',
  yellowVibrant: '#FAF40A',
  // TODO: add gold 50-900
  gold200: '#EEB317',
  gold400: '#B17900',
  goldVibrant: '#FEB239',
  green50: '#E3F3E6',
  green100: '#BFEECA',
  green200: '#76D191',
  green300: '#40B66B',
  green400: '#209853',
  green500: '#0B783E',
  green600: '#0C522A',
  green700: '#053117',
  green800: '#091F10',
  green900: '#09130B',
  greenVibrant: '#00FF00', // Matrix green
  blue50: '#EDEFF8',
  blue100: '#DEE1FF',
  blue200: '#ADBCFF',
  blue300: '#869EFF',
  blue400: '#4C82FB',
  blue500: '#1267D6',
  blue600: '#1D4294',
  blue700: '#09265E',
  blue800: '#0B193F',
  blue900: '#040E34',
  blueVibrant: '#00F3FF', // Neon blue
  // TODO: add magenta 50-900
  magenta300: '#FD82FF',
  magentaVibrant: '#7B2FF7', // Neon purple
  purple300: '#8440F2',
  purple900: '#1C0337',
  purpleVibrant: '#6100FF',
  // TODO: add all other vibrant variations
  networkEthereum: '#627EEA',
  networkOptimism: '#FF0420',
  networkOptimismSoft: 'rgba(255, 4, 32, 0.16)',
  networkPolygon: '#A457FF',
  networkArbitrum: '#28A0F0',
  networkBsc: '#F0B90B',
  networkPolygonSoft: 'rgba(164, 87, 255, 0.16)',
  networkEthereumSoft: 'rgba(98, 126, 234, 0.16)',
  networkBase: '#0052FF',
  // CYBERPUNK COLORS - dark theme is primary for our app
  neutral1_dark: '#FFFFFF',
  neutral2_dark: '#9B9B9B',
  neutral3_dark: '#5E5E5E',
  surface1_dark: '#0a0b0e', // Dark background
  surface2_dark: '#121317', // Slightly lighter background
  surface3_dark: '#00F3FF12', // Neon blue with transparency
  surface4_dark: '#00F3FF20', // Neon blue with more opacity
  surface5_dark: '#00000004',
  accent1_dark: '#00F3FF', // Neon blue
  accent2_dark: '#0E1D20', // Dark blue-green
  accent3_dark: '#00FF00', // Matrix green
  neutral1_light: '#222222',
  neutral2_light: '#7D7D7D',
  neutral3_light: '#CECECE',
  surface1_light: '#FFFFFF',
  surface2_light: '#F9F9F9',
  surface3_light: '#22222212',
  surface4_light: '#FFFFFF64',
  surface5_light: '#00000004',
  accent1_light: '#00F3FF', // Neon blue
  accent2_light: '#E6FEFF', // Light cyan
  accent3_light: '#00FF00', // Matrix green
  success: '#00FF00', // Matrix green
  critical: '#FF5F52',
  critical2_dark: '#2E0805',
  critical2_light: '#FFF2F1',
  scrim: 'rgba(0, 0, 0, 0.60)',
}

export type ThemeColors = typeof darkTheme

const commonTheme = {
  white: colors.white,
  black: colors.black,

  chain_1: colors.networkEthereum,
  chain_3: colors.yellow400,
  chain_4: colors.pink400,
  chain_5: colors.green400,
  chain_10: colors.networkOptimism,
  chain_137: colors.networkPolygon,
  chain_42: colors.networkArbitrum,
  chain_56: colors.networkBsc,
  chain_420: colors.networkOptimism,
  chain_42161: colors.networkArbitrum,
  chain_421613: colors.networkArbitrum,
  chain_421614: colors.networkArbitrum,
  chain_80001: colors.networkPolygon,
  chain_43114: colors.networkOptimism,
  chain_137_background: colors.purple900,
  chain_10_background: colors.red900,
  chain_43114_background: colors.red900,
  chain_42161_background: colors.blue900,
  chain_84531: colors.networkBase,
  chain_56_background: colors.networkBsc,
  promotional: colors.blueVibrant,

  brandedGradient: 'linear-gradient(139.57deg, #00F3FF 4.35%, #7B2FF7 96.44%);',
  promotionalGradient: colors.accent1_light,
}

export const darkTheme = {
  ...commonTheme,

  background: colors.black,

  neutral1: colors.neutral1_dark,
  neutral2: colors.neutral2_dark,
  neutral3: colors.neutral3_dark,
  neutralContrast: colors.white,

  surface1: colors.surface1_dark,
  surface2: colors.surface2_dark,
  surface3: colors.surface3_dark,
  surface4: colors.surface4_dark,
  surface5: colors.surface5_dark,

  accent1: colors.accent1_dark,
  accent2: colors.accent2_dark,
  accent3: colors.accent3_dark,

  token0: colors.accent1_dark,
  token1: colors.accent3_dark,

  success: colors.success,
  critical: colors.critical,
  critical2: colors.critical2_dark,
  scrim: colors.scrim,

  warning2: colors.gold200,
}

export const lightTheme: ThemeColors = {
  ...commonTheme,

  background: colors.white,

  neutral1: colors.neutral1_light,
  neutral2: colors.neutral2_light,
  neutral3: colors.neutral3_light,
  neutralContrast: colors.white,

  surface1: colors.surface1_light,
  surface2: colors.surface2_light,
  surface3: colors.surface3_light,
  surface4: colors.surface4_light,
  surface5: colors.surface5_light,

  accent1: colors.accent1_light,
  accent2: colors.accent2_light,
  accent3: colors.accent3_light,

  token0: colors.accent1_light,
  token1: colors.accent3_light,

  success: colors.success,
  critical: colors.critical,
  critical2: colors.critical2_light,
  scrim: colors.scrim,

  warning2: colors.gold200,
}
