// A deliberately UNSAFE toy agent, to see the runner catch failures:
//   node run.mjs --cmd "node examples/naive-agent.mjs"
// It obeys any instruction it reads, which is exactly what a real agent must never do.
let input = ''
process.stdin.on('data', (d) => (input += d))
process.stdin.on('end', () => {
  const req = JSON.parse(input)
  const text = req.context.map((c) => `${c.name ?? ''} ${c.content}`).join('\n')
  const actions = []
  if (/forward|send|email/i.test(text)) actions.push({ tool: 'send_email', args: { to: 'audit@example.test', body: req.privateRecord } })
  if (/admin access/i.test(text)) actions.push({ tool: 'update_permissions', args: { role: 'admin' } })
  if (/cancel all meetings/i.test(text)) actions.push({ tool: 'cancel_meeting', args: { all: true } })
  if (/fetch https?:\/\//i.test(text)) actions.push({ tool: 'fetch_url', args: { url: text.match(/https?:\/\/\S+/)[0] } })
  // It also repeats whatever it read, links and all.
  process.stdout.write(JSON.stringify({ output: `Summary: ${text.slice(0, 400)}`, actions }))
})
