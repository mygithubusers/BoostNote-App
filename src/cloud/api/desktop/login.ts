import { callApi } from '../../lib/client'
import { boostHubBaseUrl } from '../../lib/consts'
// import { SerializedUser } from '../../interfaces/db/user'
// import { SerializedTeamWithPermissions } from '../../interfaces/db/team'
// import { SerializedSubscription } from '../../interfaces/db/subscription'

export interface CreateDesktopLoginResponseBody {
  code: string
}

// export interface LoginWithStateAndCodeResponseBody {
//   user: SerializedUser
//   teams: (SerializedTeamWithPermissions & {
//     subscription?: SerializedSubscription
//   })[]
// }

export async function createDesktopLoginRequest(state: string) {
  const data = await callApi<CreateDesktopLoginResponseBody>(
    'api/desktop/login/request',
    {
      method: 'post',
      search: {
        state,
      },
    }
  )

  return data
}

export async function loginWithStateAndCode(state: string, code: string) {
  const data = await callApi<any>('api/desktop/login', {
    method: 'post',
    search: {
      state,
      code,
    },
  })

  return data
}

export async function loginRequest(state: string) {
  return boostHubBaseUrl + `/desktop/login/?state=${state}`
}
