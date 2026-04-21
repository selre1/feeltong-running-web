const env = { ...import.meta.env }

export const APP_BACK_URL = env.APP_BACK_URL ?? '/api'
export const APP_BACK_WS_URL = env.APP_BACK_WS_URL ?? ''