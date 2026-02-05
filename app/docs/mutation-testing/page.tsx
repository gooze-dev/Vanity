import { CodeBlock } from "@/components/code-block"

export default function MutationTestingPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold tracking-tight mb-4">What is mutation testing?</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Mutation testing is a way to check your tests.
        It asks: if we make a small bug in the code, will the tests fail?
      </p>

      <div className="space-y-12">
        <div id="idea" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">The idea (simple)</h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>Take your real code.</li>
            <li>Make one tiny change (a mutation).</li>
            <li>Run your tests.</li>
            <li>
              If tests fail, good: the mutation is <strong>killed</strong>.
              If tests still pass, not good: the mutation <strong>survived</strong>.
            </li>
          </ol>
        </div>

        <div id="why" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">Why people use it</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Your tests can be green but still miss important behavior.</li>
            <li>Mutation testing shows where assertions are missing or too weak.</li>
            <li>It gives a repeatable signal in CI (not just &quot;coverage&quot;).</li>
          </ul>
        </div>

        <div id="example" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold mb-3">A small example (what Gooze finds)</h2>
          <p className="mb-3 text-muted-foreground">
            Code:
          </p>
          <CodeBlock
            lang="go"
            code={`func label(balance int) string {
    if balance > 0 {
        return "positive"
    }
    return "not-positive"
}
`}
          />

          <p className="mt-6 mb-3 text-muted-foreground">
            Test (too weak): it only checks balance = 1.
          </p>
          <CodeBlock
            lang="go"
            code={`import "testing"

func TestLabel_Positive(t *testing.T) {
    got := label(1)
    if got != "positive" {
        t.Fatalf("expected positive, got %q", got)
    }
}
`}
          />

          <p className="mt-6 mb-3 text-muted-foreground">
            One common mutation is changing <code className="bg-muted px-1 py-0.5 rounded">&gt;</code> to <code className="bg-muted px-1 py-0.5 rounded">&gt;=</code>.
            That means balance = 0 becomes &quot;positive&quot;.
            If you do not test balance = 0, this mutation can survive.
          </p>
          <CodeBlock
            lang="diff"
            code={`- if balance > 0 {
+ if balance >= 0 {
    return "positive"
}`}
          />

          <p className="mt-6 text-muted-foreground">
            Fix: add a test for balance = 0 (and maybe negative too).
          </p>
        </div>
      </div>
    </section>
  )
}
