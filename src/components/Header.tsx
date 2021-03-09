/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex, Styled } from 'theme-ui'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
const SignInArea = dynamic(() => import('./SignInArea'), { ssr: false })
import ArrowBack from '../../public/images/arrow-back.svg'

type HeaderProps = {
  title?: string
  onDark?: boolean
  backNav?: string
}

const Header = ({ title, onDark, backNav }: HeaderProps) => {
  const router = useRouter()
  return (
    <header
      role="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '152px',
        '*': { display: 'flex', color: onDark ? 'white !important' : '' },
        '.col': { flex: 2, '&:last-of-type': { justifyContent: 'flex-end' } },
      }}
    >
      {title && <Styled.h1>{title}</Styled.h1>}
      {backNav && (
        <Flex
         onClick={()=>{ router.back() }}
         sx={{alignItems: 'center', cursor: 'pointer'}}>
          <ArrowBack sx={{mr: 2}}/>
          <Styled.h3 sx={{mb: 0, textTransform: 'uppercase', color: '#0D373C'}}>{backNav}</Styled.h3>
        </Flex>
      )}
      <div className="col">
        <SignInArea onDark={onDark} />
      </div>
    </header>
  )
}

export default Header
