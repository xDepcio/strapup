import { setTimeout } from "timers/promises"

const CLIENT_ID = "9f1f54f61275359d7cea"


type DeviceResponse = {
    device_code: string
    user_code: string
    verification_uri: string
    expires_in: number
    interval: number
}
async function startDeviceAuth(): Promise<DeviceResponse> {
    const res = await fetch("https://github.com/login/device/code", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            scope: "user:email"
        })
    })
    const data = await res.json();
    return data
}

async function checkUserAuthorized(deviceCode: string) {
    const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            device_code: deviceCode,
            grant_type: "urn:ietf:params:oauth:grant-type:device_code"
        })
    })
    const data = await res.json();
    return data
}

type TokenResponse = {
    access_token: string
    token_type: string | 'bearer'
    scope: string
}
async function authorizeDevice(): Promise<TokenResponse> {
    const deviceRes = await startDeviceAuth()
    console.log(deviceRes)
    let isAuthorized = false

    let tokenData
    while (!isAuthorized) {
        tokenData = await checkUserAuthorized(deviceRes.device_code)
        console.log(tokenData)
        if (tokenData.error) {
            await setTimeout(deviceRes.interval * 1000 + 500)
        } else {
            isAuthorized = true
        }
    }

    return tokenData
}
