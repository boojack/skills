import { ArrowRight, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function App() {
  return (
    <main className="min-h-svh bg-muted/30 p-4 text-foreground sm:p-8">
      <Card
        data-critical-surface="starter"
        className="mx-auto max-w-2xl bg-background"
      >
        <CardHeader>
          <Badge variant="secondary">
            <Sparkles data-icon="inline-start" />
            UI prototype
          </Badge>
          <CardTitle>Focus the artifact on the product decision.</CardTitle>
          <CardDescription>
            Replace this starter with the relevant surface, realistic state,
            and interaction. Avoid rebuilding unrelated application chrome.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>
            Start composing
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

export default App
