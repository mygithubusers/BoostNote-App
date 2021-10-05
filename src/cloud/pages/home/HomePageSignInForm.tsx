import Form from '../../../design/components/molecules/Form'
import React from 'react'
import styled from '../../../design/lib/styled'
import Image from '../../../design/components/atoms/Image'
import SignInForm from '../../components/SignInForm'

const HomePageSignInForm = () => {
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
      <SignInForm />
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
