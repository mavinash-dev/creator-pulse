import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <SignIn
        appearance={{
          variables: {
            colorBackground: '#141414',
            colorText: '#FAFAFA',
            colorPrimary: '#3B82F6',
            colorInputBackground: '#0A0A0A',
            colorInputText: '#FAFAFA',
          },
        }}
      />
    </main>
  )
}
