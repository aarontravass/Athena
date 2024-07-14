import React, { ReactNode } from 'react'

interface SuccessTextProps {
  styleClass?: string
  children: ReactNode
}

function SuccessText({ styleClass, children }: SuccessTextProps): JSX.Element {
  return <p className={`text-center text-success ${styleClass || ''}`}>{children}</p>
}

export default SuccessText
