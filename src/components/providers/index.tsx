import { ThemeProvider } from "./theme-provider";
import { TanStackQueryClientProvider } from "./query-client-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanStackQueryClientProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </TanStackQueryClientProvider>
  )
}
