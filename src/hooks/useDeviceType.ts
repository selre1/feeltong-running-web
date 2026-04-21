import { useEffect, useState } from 'react'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

const MOBILE_QUERY = '(max-width: 767px)'
const TABLET_QUERY = '(min-width: 768px) and (max-width: 1023px)'

const getDeviceType = (): DeviceType => {
  if (window.matchMedia(MOBILE_QUERY).matches) return 'mobile'
  if (window.matchMedia(TABLET_QUERY).matches) return 'tablet'
  return 'desktop'
}

export default function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType)

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_QUERY)
    const tablet = window.matchMedia(TABLET_QUERY)

    const update = () => setDeviceType(getDeviceType())

    mobile.addEventListener('change', update)
    tablet.addEventListener('change', update)

    return () => {
      mobile.removeEventListener('change', update)
      tablet.removeEventListener('change', update)
    }
  }, [])

  return deviceType
}
