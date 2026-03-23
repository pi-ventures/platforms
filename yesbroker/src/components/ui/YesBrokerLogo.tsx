'use client'

interface YesBrokerLogoProps {
  /** 'full' = icon + wordmark side by side (default)
   *  'icon' = icon mark only
   *  'wordmark' = text only  */
  variant?: 'full' | 'icon' | 'wordmark'
  /** Height of the icon mark in px (wordmark scales with it) */
  size?: number
  /** Dark background context (white wordmark) vs light background (dark wordmark) */
  theme?: 'dark' | 'light'
  className?: string
}

export default function YesBrokerLogo({
  variant = 'full',
  size = 36,
  theme = 'dark',
  className = '',
}: YesBrokerLogoProps) {
  const textColor = theme === 'dark' ? '#FFFFFF' : '#1A1A2E'

  const IconMark = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      {/* Amber rounded-square background */}
      <rect width="100" height="100" rx="22" fill="#F5A623" />

      {/* Person head */}
      <circle cx="50" cy="33" r="14" fill="#1A1A2E" />

      {/* Person body / shoulders arc */}
      <path
        d="M18 78 C18 58 82 58 82 78"
        stroke="#1A1A2E"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Verified checkmark badge — bottom-right */}
      <circle cx="72" cy="72" r="16" fill="#1A1A2E" />
      <path
        d="M64 72 L70 78 L81 65"
        stroke="#F5A623"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )

  const Wordmark = ({ compact = false }: { compact?: boolean }) => (
    <span
      style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: size * (compact ? 0.44 : 0.52),
        fontWeight: 900,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        color: textColor,
        userSelect: 'none',
      }}
    >
      <span style={{ color: '#F5A623' }}>YES</span>
      <span style={{ color: textColor }}>BROKER</span>
    </span>
  )

  if (variant === 'icon') return <IconMark />
  if (variant === 'wordmark') return <Wordmark />

  return (
    <div className={`flex items-center gap-2.5 ${className}`} style={{ userSelect: 'none' }}>
      <IconMark />
      <Wordmark />
    </div>
  )
}
