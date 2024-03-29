/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex, Button, Styled } from 'theme-ui'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useStateValue } from '../state/state'
import { cloudFlareGateway } from '../constants'
import get_CFG_UI_DOM from '../utils/get_CFG_UI_DOM'

import Badge from './Badge'
import Stars from './Stars'
import BGWave from './BGWave'
import SelectBox from './SelectBox'
import SearchBox from './SearchBox'
import Close from '../../public/images/close.svg'

type PlaygroundProps = {
  api?: any
}

const Playground = ({ api }: PlaygroundProps) => {
  const [{ dapp }] = useStateValue()
  const router = useRouter()
  const [apiOptions] = useState(dapp.apis)

  const [apiContents, setapiContents] = useState<any>({})
  const [loadingContents, setloadingContents] = useState(false)

  const [showschema, setshowschema] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<any>()

  const handleShowSchema = (e: React.BaseSyntheticEvent) => setshowschema(!showschema)
  const handleQueryValuesChange = (method) => setSelectedMethod(method[0].value)

  async function getPackageSchema() {
    let schemaResponse = await axios.get(
      `${cloudFlareGateway}${api.locationUri.split('ipfs/')[0]}/schema.graphql`,
    )
    return schemaResponse.data
  }

  async function getPackageQueries() {
    let $ = await get_CFG_UI_DOM(api, '/meta/queries')
    let queries = Array.from($('table tr td:nth-child(2) a'))
    queries.shift() // dump .. in row 1
    let queriesList = []
    await queries.map((row: any) => {
      async function getQueries() {
        let queryData = await axios.get(
          `${cloudFlareGateway.replace('/ipfs/', '')}${row.attribs.href}`,
        )
        let key = row.attribs.href.split('meta/queries/')[1].split('.graphql')[0]
        await queriesList.push({ id: key, value: queryData.data })
      }
      getQueries()
    })
    return queriesList
  }

  useEffect(() => {
    if (router.asPath.includes('ens/')) {
      setloadingContents(true)
    }
  }, [router])

  useEffect(() => {
    async function go() {
      let schemaData = await getPackageSchema()
      let queriesData = await getPackageQueries()
      setapiContents({
        schema: schemaData,
        queries: queriesData,
      })
      setloadingContents(false)
    }
    if (loadingContents === true) {
      go()
    }
  }, [loadingContents])

  return (
    <div
      className="playground"
      sx={{
        backgroundColor: 'w3shade3',
        borderRadius: '1rem',
        overflow: 'hidden',
        'code, pre, textarea': {
          border: 'none',
          fontSize: '0.875rem',
          lineHeight: '0.875rem',
        },
      }}
    >
      <React.Fragment>
        <Flex
          className="header"
          sx={{
            p: '1.5rem',
            backgroundColor: 'w3shade2',
            '*': { display: 'flex' },
            label: {
              display: 'none',
            },
          }}
        >
          {api === undefined ? (
            <SearchBox
              key={'search-api-box'}
              dark
              searchBy="name"
              placeholder={'Search API’s'}
              labelField="name"
              valueField="name"
              options={apiOptions}
              values={[]}
              onChange={(e) => {
                if(e.length > 0) {
                  router.push('/playground/ens/'+e[0].pointerUris[0])
                  console.log('TODO')
                }
              }}
            />
          ) : (
            <Styled.h1 sx={{ mb: 0 }}>{api.name}</Styled.h1>
          )}

          <Flex
            className="selection-detail"
            sx={{
              ml: 4,
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            <div className="left">
              <Stars count={0} onDark />
              <ul className="category-Badges" sx={{ ml: 3 }}>
                <li>
                  <Badge label="IPFS" onDark />
                </li>
              </ul>
            </div>
            <div className="right">
              <a className="text-nav" href={router.asPath.replace('playground', 'apis')}>
                GO TO API PAGE
              </a>
            </div>
          </Flex>
        </Flex>
        <Flex className="body" sx={{ '> *': { p: '1.5rem' } }}>
          <div
            className="query"
            sx={{ width: '40%', backgroundColor: 'w3PlayGroundNavy' }}
          >
            <Flex
              className="templates"
              sx={{ flex: 1, mb: 4, justifyContent: 'space-between' }}
            >
              {apiContents?.queries && (
                <SelectBox
                  key={'queries-box'}
                  dark
                  skinny
                  labelField="id"
                  valueField="id"
                  placeholder={'Select Query'}
                  options={apiContents.queries}
                  onChange={handleQueryValuesChange}
                />
              )}
            </Flex>
            <Styled.code>
              <textarea
                onChange={() => console.log('TODO')}
                sx={{
                  resize: 'none',
                  width: '100%',
                  height: '21.875rem',
                  bg: 'transparent',
                  color: 'w3PlaygroundSoftBlue',
                }}
                value={selectedMethod}
              ></textarea>
            </Styled.code>
          </div>
          &nbsp;
          <div
            className="result"
            sx={{
              width: '70%',
              backgroundColor: 'w3PlayGroundNavy',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Flex
              className="controls"
              sx={{
                justifyContent: 'space-between',
                mb: 2,
                overflow: 'hidden',
                '*': { display: 'flex', alignItems: 'center' },
              }}
            >
              <div className="left">
                <Button variant="primarySmall">Run</Button>
                <Button variant="hollowSmall">Save</Button>
              </div>
              <div className="right">
                {loadingContents ? (
                  'Loading Schema...'
                ) : (
                  <span
                    className="text-nav left-chevron"
                    onClick={handleShowSchema}
                    sx={{ cursor: 'pointer' }}
                  >
                    {loadingContents && 'Loading Schema...'}
                    <span sx={{ fontSize: '2.5rem', pr: '1rem' }}>‹</span>
                    <span>Show Schema</span>
                  </span>
                )}
              </div>
            </Flex>
            <Styled.code sx={{ flex: 1 }}>
              <Styled.pre sx={{ height: '100%', color: 'w3PlaygroundSoftBlue' }}>{`
"data": {
  "transactions": [
    {
      "_amount": "5494500",
      "_asset": "pBTC",
      "_timestamp": "1605245034",
      "_type": "mint",
      "id": "0x0001c85a114e81b26a2c466bf988d3a5c61f0bc7c9dde34670e1f8b494bad87e-104"
    }
  ]
}
          `}</Styled.pre>
            </Styled.code>
          </div>
          {apiContents?.schema && (
            <Flex
              sx={{
                p: 0,
                position: 'absolute',
                right: !showschema ? '-100%' : '0',
                transition: '.25s all ease',
                height: 'calc(100% + 20px)',
                overflow: 'hidden',
                width: 'max-content',
                borderRadius: '8px',
                borderTopRightRadius: '0px',
              }}
            >
              <Close
                onClick={handleShowSchema}
                sx={{
                  fill: '#FFF',
                  width: '30px',
                  height: '30px',
                  top: '1rem',
                  '&:hover': {
                    fill: 'w3PlaygroundSoftBlue',
                    cursor: 'pointer',
                  },
                }}
              />
              <Styled.pre
                className="hidden-schema-panel"
                sx={{
                  backgroundColor: 'white',
                  color: 'w3shade3',
                  width: 'max-content',
                }}
              >
                {apiContents.schema}
              </Styled.pre>
            </Flex>
          )}
        </Flex>
      </React.Fragment>

      <BGWave dark />
    </div>
  )
}

export default Playground
