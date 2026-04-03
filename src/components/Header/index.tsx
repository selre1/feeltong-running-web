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
  onSecondaryAction: () => void
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
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12.7 2 7 12h4.2L9.3 22 17 11.2h-4.3L12.7 2Z" />
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
                러닝 시작
              </Button>
              <Button className="HomeHeader__button" onClick={props.onSecondaryAction} variant="white">
                기록 보기
              </Button>
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
