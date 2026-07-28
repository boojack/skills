import { ArrowRight, LayoutTemplate } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <section
        data-critical-surface="starter"
        className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12"
      >
        <div className="max-w-2xl">
          <Badge variant="outline">
            <LayoutTemplate data-icon="inline-start" />
            UI prototype
          </Badge>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Start with the product decision.
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            Replace this starter with the relevant surface, realistic state,
            and interaction. Avoid rebuilding unrelated application chrome.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t pt-5">
            <Button>
              Start composing
              <ArrowRight data-icon="inline-end" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Neutral baseline · adapt it to the supplied product
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
