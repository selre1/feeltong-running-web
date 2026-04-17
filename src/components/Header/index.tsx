import AdaptiveDiv from '../AdaptiveDiv'
import Button from '../Button'
import './index.css'

type HeaderVariant = 'bar' | 'home' | 'page'

interface BaseHeaderProps {
  variant: HeaderVariant
}

interface BarHeaderProps extends BaseHeaderProps {
  position?: 'fixed' | 'absolute'
  variant: 'bar'
}

interface HomeHeaderProps extends BaseHeaderProps {
  onPrimaryAction: () => void
  onSecondaryAction?: () => void
  primaryActionLabel: string
  secondaryActionLabel?: string
  subtitle: string
  title: string
  variant: 'home'
}

interface PageHeaderProps extends BaseHeaderProps {
  onBack?: () => void
  subtitle?: string
  title: string
  variant: 'page'
}

type HeaderProps = BarHeaderProps | HomeHeaderProps | PageHeaderProps

function BrandMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="16" cy="4.5" r="2.5" fill="currentColor" />
      <path d="M15 7 L12 13 L8.5 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13 L16.5 19.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 9 L10.5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 9 L18 11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default function Header(props: HeaderProps) {
  if (props.variant === 'bar') {
    return <div className={`HeaderBar HeaderBar--${props.position ?? 'fixed'}`} />
  }

  if (props.variant === 'home') {
    return (
      <header className="HomeHeader">
        <div className="HomeHeader__background" aria-hidden="true" />
        <div className="HomeHeader__overlay" aria-hidden="true" />
        <AdaptiveDiv type="center">
          <div className="HomeHeader__content">
            <div className="HomeHeader__brand">
              <div className="HomeHeader__logoMark" aria-hidden="true">
                <BrandMark />
              </div>
              <strong className="HomeHeader__brandName">Feeltong Running</strong>
            </div>

            <div className="HomeHeader__copy">
              <h1 className="HomeHeader__title">{props.title}</h1>
              <p className="HomeHeader__subtitle">{props.subtitle}</p>
            </div>

            <div className="HomeHeader__actions">
              <Button className="HomeHeader__button" onClick={props.onPrimaryAction} variant="purple">
                {props.primaryActionLabel}
              </Button>
              {props.onSecondaryAction && props.secondaryActionLabel ? (
                <Button className="HomeHeader__button" onClick={props.onSecondaryAction} variant="white">
                  {props.secondaryActionLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </AdaptiveDiv>
      </header>
    )
  }

  return (
    <header className="PageHeader">
      <h1 className="PageHeader__title">{props.title}</h1>
      {props.subtitle ? <p className="PageHeader__subtitle">{props.subtitle}</p> : null}
    </header>
  )
}
