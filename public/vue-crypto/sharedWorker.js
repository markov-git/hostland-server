let connected = false
const tabs = []

self.addEventListener('connect', e => {
  e.source.addEventListener('message', ev => {
    if (ev.data === 'start') {
      if (connected === false) {
        e.source.postMessage('firstTab')
        connected = true
      } else {
        e.source.postMessage('tab')
        tabs.push(e.source)
      }
    } else {
      tabs.forEach(tab => tab.postMessage(ev.data))
    }
  })
  e.source.start()
})
