/** @jsxRuntime classic */
/** @jsx jsx */
import { useState, useEffect } from 'react'
import { jsx, Flex, Button, useThemeUI, Styled, Label } from 'theme-ui'
import { useRouter } from 'next/router'

type tab = {
  label: string
  count?: number
}

type ContentNav = {
  setActiveTab: (value: string) => void
  activeTab: string
  tabs: tab[]
}

const ContentNav = ({ setActiveTab, activeTab, tabs }: ContentNav) => {
  const { theme } = useThemeUI()
  const router = useRouter()
  return (
    <Flex
      className="tabs"
      sx={{
        '*': { cursor: 'pointer', mr: 2, mb: 4 },
        '.tab': {
          textAlign: 'center',
          fontFamily: 'Montserrat',
          fontSize: '16px',
          fontWeight: 'bold',
          letterSpacing: '-0.4000000059604645px',
          pb: ' 18px',
          color: '#688184',
          mb: 0,
          '&.active': {
            fontWeight: 'bold',
            color: 'darkGreen',
            borderBottom: '2px solid #66E0D9',
            '&:hover': {
              borderBottom: '2px solid #66E0D9',
            },
          },
          '&:hover': {
            borderBottom: '2px solid #EEE',
          },
        },
      }}
    >
      {tabs.map((tab) => {
        let id = tab.label.toLowerCase()
        return (
          <Styled.h6
            key={tab.label}
            className={'tab ' + id + ' ' + (activeTab === id ? 'active' : '')}
            onClick={() => setActiveTab(id)}
          >
            <span
              sx={{
                fontFamily: 'Montserrat',
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '-0.4px',
                color: '#0D373C',
                mixBlendMode: 'normal',
                opacity: '0.9',
                mb: 0
              }}
            >
              {tab.label}
            </span>
            <span
              sx={{
                backgroundColor: 'rgba(104,129,132,.1)',
                fontFamily: 'Montserrat',
                fontStyle: 'normal',
                fontWeight: '600',
                fontSize: '13px',
                lineHeight: '16px',
                textAlign: 'center',
                letterSpacing: '-0.4px',
                color: 'darkGreen',
                mixBlendMode: 'normal',
                px: '.3rem',
                py: '.1rem',
                borderRadius: '50%',
                mb: 0
              }}
            >
              {tab.count}
            </span>
          </Styled.h6>
        )
      })}
    </Flex>
  )
}

export default ContentNav
