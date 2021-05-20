(() => {
  const application = Stimulus.Application.start()

  application.register("timer", class extends Stimulus.Controller {
    static get targets() {
      return ['output', 'title']
    }

    defaultOptions = {
      t: 10,
      c: 'black',
      tc: 'black'
    }

    get initialTime() {
      return parseFloat(this.options.t) * 60
    }

    get options() {
      if (this._options) return this._options

      const params = new URLSearchParams(window.location.search)
      let options = { ...this.defaultOptions }
      for (const [key, value] of params) {
        options[key] = value
      }
      return this._options = options
    }

    get remainingTime() { return this._remainingTime }
    set remainingTime(value) {
      this._remainingTime = value
      this.formatOutput()
    }

    connect() {
      this.interval = setInterval(_ => this.tick(), 1000)
      this.remainingTime = this.initialTime
      this.setColors()
    }

    tick() {
      this.remainingTime -= 1

      if (this.remainingTime <= 0) {
        this.remainingTime = 0
        clearInterval(this.interval)
      }
    }

    formatOutput() {
      let time = new Date(0)
      time.setSeconds(this.remainingTime)

      const output = time.toLocaleTimeString([], { timeZone: 'UTC' })
      this.outputTarget.innerText = output
    }

    setColors() {
      this.outputTarget.style.color = this.parseColor(this.options.c)
      this.titleTarget.style.color = this.parseColor(this.options.tc)
    }

    parseColor = color => color.match(/^[0-9a-f]{6}$/i) ? `#${color}` : color
  })
})()
