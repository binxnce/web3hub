/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Global } from '@emotion/core'

type BGWaveProps = {
  dark?: boolean
  light?: boolean
}
const BGWave = ({ dark, light }: BGWaveProps) => {
  let color = dark ? 'dark' : light ? 'light' : 'light'
  return (
    <style>
      {`
          body::before { 
            display: block;
            z-index: -1;
            top: 0;
            left: auto;
            right: 0;
            background: url(/images/background-wave-${color}.svg) no-repeat right;
          },
      `}
    </style>
  )
}

export default BGWave
