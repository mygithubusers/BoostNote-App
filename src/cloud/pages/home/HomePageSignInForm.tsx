import React, { ChangeEventHandler, useCallback, useRef, useState } from 'react'
import styled from '../../../design/lib/styled'
import Form from '../../../design/components/molecules/Form'
import Image from '../../../design/components/atoms/Image'
import Button from '../../../design/components/atoms/Button'
import { generateId } from '../../../lib/string'
import { loginRequest, loginWithStateAndCode } from '../../api/desktop/login'
import { useElectron } from '../../lib/stores/electron'
import { osName } from '../../../design/lib/platform'
import Icon from '../../../design/components/atoms/Icon'
import { mdiLoading } from '@mdi/js'
import {
  FormBlockquote,
  FormGroup,
  FormTextInput,
} from '../../../components/atoms/form'
import { useRouter } from '../../lib/router'
import { useGlobalData } from '../../lib/stores/globalData'

const HomePageSignInForm = () => {
  const { sendToElectron, usingElectron } = useElectron()
  const authStateRef = useRef('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'requesting' | 'logging-in'>(
    'idle'
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [manualFormOpened, setManualFormOpened] = useState(() => {
    switch (osName) {
      case 'macos':
      case 'windows':
        return false
      case 'linux':
      case 'unix':
      default:
        return true
    }
  })
  const { push } = useRouter()
  const { setPartialGlobalData } = useGlobalData()

  const openLoginPage = useCallback(
    async (authState) => {
      const loginRequestUrl = await loginRequest(authState)
      if (usingElectron) {
        sendToElectron('open-external-url', loginRequestUrl)
      }
    },
    [sendToElectron, usingElectron]
  )

  const startLoginRequest = useCallback(async () => {
    setStatus('requesting')
    setErrorMessage(null)
    const authState = generateId()
    authStateRef.current = authState
    await openLoginPage(authState)
    // const data = await createDesktopLoginRequest(authState)
    // await loginWithStateAndCode(authState, data.code)
    // }
  }, [openLoginPage])

  const onSignIn = useCallback(() => {
    console.log('Signing in...')
    startLoginRequest().catch((err) => console.log('Cannot log in', err))
  }, [startLoginRequest])

  const openLoginRequestPage = useCallback(async () => {
    await openLoginPage(authStateRef.current)
  }, [openLoginPage])

  const updateCode: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setCode(event.target.value)
    },
    []
  )

  const cancelSigningIn = useCallback(() => {
    setStatus('idle')
  }, [])

  const login = useCallback(
    (code) => {
      console.log('Login code', code)
      setStatus('logging-in')
      setErrorMessage(null)
      loginWithStateAndCode(authStateRef.current, code)
        .then((loginData) => {
          // successful login
          console.log('Logged in', loginData)
          // if (usingElectron) {
          //   sendToElectron('request-app-navigate', '/desktop')
          // }
          setPartialGlobalData({
            currentUser: loginData.user || undefined,
            teams: loginData.teams || [],
          })
          push('/desktop')
        })
        .catch((err) => console.log('Error logging in', err))
    },
    [push, setPartialGlobalData]
  )

  return (
    <Container>
      <Form
        fullWidth={true}
        rows={[
          {
            items: [
              {
                type: 'node',
                element: (
                  <Image src={'/static/logo.png'} className={'intro__logo'} />
                ),
              },
            ],
          },
          {
            items: [
              {
                type: 'node',
                element: (
                  <h1 className='intro__heading'>Welcome to Boost Note!</h1>
                ),
              },
            ],
          },
        ]}
      />
      <div>
        <Container>
          <h1 className='heading'>Create Account or Sign in</h1>
          {status === 'idle' ? (
            <>
              {/*<div style={{ maxWidth: '1020px' }}>*/}
              {/*<BoostHubFeatureIntro />*/}
              {/*</div>*/}
              <div className='control'>
                <Button variant={'primary'} onClick={() => onSignIn()}>
                  Sign Up
                </Button>

                <Button variant={'secondary'} onClick={() => onSignIn()}>
                  Sign In
                </Button>
              </div>
            </>
          ) : status === 'logging-in' ? (
            <p>
              <Icon path={mdiLoading} spin />
              &nbsp;Signing In...
            </p>
          ) : (
            <>
              <p style={{ textAlign: 'center' }}>
                <Icon path={mdiLoading} spin />
                &nbsp;Waiting for signing in from browser...
              </p>
              <FormGroup style={{ textAlign: 'center' }}>
                <Button variant={'primary'} onClick={openLoginRequestPage}>
                  Open request signing in page again
                </Button>
              </FormGroup>
              <FormGroup style={{ textAlign: 'center' }}>
                <a className='control-link' onClick={cancelSigningIn}>
                  Cancel Signing In
                </a>
              </FormGroup>
              {errorMessage != null && (
                <FormGroup style={{ textAlign: 'center' }}>
                  <FormBlockquote variant='danger'>
                    {errorMessage}
                  </FormBlockquote>
                </FormGroup>
              )}
              {manualFormOpened ? (
                <>
                  <hr />
                  <FormGroup style={{ textAlign: 'center' }}>
                    <FormTextInput
                      placeholder='Insert Code from the browser'
                      value={code}
                      onChange={updateCode}
                    />
                  </FormGroup>
                  <FormGroup style={{ textAlign: 'center' }}>
                    <Button
                      variant={'primary'}
                      onClick={() => {
                        login(code)
                      }}
                    >
                      Sign In
                    </Button>
                  </FormGroup>
                </>
              ) : (
                <FormGroup style={{ textAlign: 'center' }}>
                  <FormBlockquote>
                    Click{' '}
                    <a
                      onClick={() => {
                        setCode('')
                        setManualFormOpened(true)
                      }}
                      style={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      here
                    </a>{' '}
                    to type sign-in code manually
                  </FormBlockquote>
                </FormGroup>
              )}
            </>
          )}
        </Container>
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: block;
  width: 100%;
  padding-top: ${({ theme }) => theme.sizes.spaces.xl}px;
  position: relative;
  padding: ${({ theme }) => theme.sizes.spaces.md}px;
  max-width: 800px;

  .intro__logo {
    max-width: 240px;
  }

  margin: 0 auto ${({ theme }) => theme.sizes.spaces.xsm}px;
`

export default HomePageSignInForm
