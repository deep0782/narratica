'use client'

import { ReactNode } from 'react'
import { ChatProvider as ChatContextProvider } from '@/contexts/chat-context'
import { WizardProvider } from '@/contexts/wizard-context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WizardProvider>
      <ChatContextProvider>{children}</ChatContextProvider>
    </WizardProvider>
  )
}
