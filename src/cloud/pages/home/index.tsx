import React from 'react'
import { getSettingsPageData } from '../../api/pages/settings'
import { GetInitialPropsParameters } from '../../interfaces/pages'
import { useGlobalData } from '../../lib/stores/globalData'
import { useRouter } from '../../lib/router'
import Button from '../../../design/components/atoms/Button'
import HomeForm from './HomeForm'

const HomePage = () => {
  const {
    globalData: { currentUser, teams },
  } = useGlobalData()
  const havingTeam = teams.length > 0
  const { push } = useRouter()

  // we need to auth and render sign in in webview (see how implemented otherwise)
  // probably we need auth before going to sign in page or similar...
  if (currentUser && havingTeam) {
    return <HomeForm user={currentUser} teams={teams} />
  }

  // render Sign up / Sign In page + Intro
  return (
    <div title={'Welcome to Boost Note'}>
      <div>Welcome to Boost Note</div>
      <li className='nav-list__item d-none d-lg-block'>
        <>
          <li className='mobile-popup__list__item'>
            <Button
              variant='secondary'
              onClick={(event) => {
                event.preventDefault()
                push('/signup')
              }}
            >
              Sign Up
            </Button>
          </li>
          <li className='mobile-popup__list__item'>
            <Button
              variant='secondary'
              onClick={(event) => {
                event.preventDefault()
                push('/signin')
              }}
            >
              Sign In
            </Button>
          </li>
        </>
      </li>
    </div>
  )
}

HomePage.getInitialProps = async (params: GetInitialPropsParameters) => {
  const result = await getSettingsPageData(params)
  return result
}

export default HomePage
