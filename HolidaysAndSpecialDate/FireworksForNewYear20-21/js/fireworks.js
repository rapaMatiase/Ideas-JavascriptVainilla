

function Caynon(_context) {
      this.fireworks = []
      this.counter = 0
      this.context = _context
      this.size = {
            height : 0,
            width : 0
      }
      this.center = 0
      this.spawnA = 0
      this.spawnB = 0
      this.spawnC = 0
      this.spawnD = 0
}

Caynon.prototype.resize = function () {
      this.size.width = canvas.width = window.innerWidth
      this.center = this.size.width / 2 | 0
      this.spawnA = this.center - this.center / 4 | 0
      this.spawnB = this.center + this.center / 4 | 0
      this.size.height = canvas.height = window.innerHeight
      this.spawnC = this.size.height * .1
      this.spawnD = this.size.height * .5
}

Caynon.prototype.load = function () {
      this.reloadFireworks()

      if (this.counter === 15) {
            this.counter = 0
            this.addNewFireWords()
      } else {
            this.counter++
      }
      this.deleteFirewordsEnd()
}

Caynon.prototype.reloadFireworks = function () {
      this.context.globalCompositeOperation = 'hard-light'
      this.context.fillStyle = 'rgba(20,20,20,0.15)'
      this.context.fillRect(0, 0, this.size.width, this.size.height)
      this.context.globalCompositeOperation = 'lighter'

      for (let firework of this.fireworks) {
            firework.shooting()

            if (firework.hitBlank()) {
                  this.addNewFireWordsExplote(firework.endPoint.x, firework.endPoint.y, firework.color)
            }
      }
}

Caynon.prototype.addNewFireWords = function () {
      const x0 = random(this.spawnA, this.spawnB)
      const y0 = this.size.height
      const x1 = random(0, this.size.width)
      const y1 = random(this.spawnC, this.spawnD)

      const hue = random(300, 450)

      const newFirewords = new FireworkExplote(x0,
            y0,
            x1,
            y1,
            hue,
            this.context)

      this.fireworks.push(newFirewords)
}

Caynon.prototype.addNewFireWordsExplote = function (x, y, hue) {

      const offsprings = random(30, 110)
      let start = offsprings / 2;

      for (let i = 0; i < start; i++) {
            let targetX = x + offsprings * Math.cos(PI2 * i / start) | 0
            let targetY = y + offsprings * Math.sin(PI2 * i / start) | 0
            const newFirewords = new Firework(x,
                  y,
                  targetX,
                  targetY,
                  hue,
                  this.context)

            this.fireworks.push(newFirewords)
      }
}

Caynon.prototype.deleteFirewordsEnd = function () {
      if (this.fireworks.length > 1000) {
            this.fireworks = this.fireworks.filter((firework) => { return !firework.isNotDead() })
            this.context.globalCompositeOperation = "source-over";
      }
}

function Firework(_x0, _y0, _x1, _y1, _color, _context, _children) {
      this.startPoint = {
            x: _x0,
            y: _y0
      }
      this.endPoint = {
            x: _x1,
            y: _y1
      }
      this.color = _color
      this.context = _context
      this.history = []
      this.stateDead = false
      this.children = _children || false
}

Firework.prototype.shooting = function () {
      if (this.stateDead === false) {

            if (this.targetPunch()) {
                  this._addNewPoint()
            }

            if (this.history.length === 0) {
                  this.stateDead = true
            }

            this._drawMultiplePoints()

            this.deleteFisrtPoint()
      }
}

Firework.prototype.isNotDead = function () {
      return this.stateDead

}

Firework.prototype.targetPunch = function () {
      let xDiff = this.endPoint.x - this.startPoint.x
      let yDiff = this.endPoint.y - this.startPoint.y
      if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
            return true
      }
      return false
}

Firework.prototype.hitBlank = function () {
      return this.children
}

Firework.prototype._drawMultiplePoints = function () {
      for (let i = 0; this.history.length > i; i++) {
            let point = this.history[i]
            this._drawSinglePoint(point.x, point.y)
      }
}

Firework.prototype._drawSinglePoint = function (x, y) {
      this.context.beginPath()
      this.context.fillStyle = 'hsl(' + this.color + ',100%,50%)'
      this.context.arc(x, y, 2, 0, PI2, false)
      this.context.fill()
}

Firework.prototype.deleteFisrtPoint = function () {
      this.history.shift()
}

Firework.prototype._addNewPoint = function () {
      let xDiff = this.endPoint.x - this.startPoint.x
      let yDiff = this.endPoint.y - this.startPoint.y

      this.startPoint.x += xDiff / 20
      this.startPoint.y += yDiff / 20

      this.history.push(this.startPoint)
}

function FireworkExplote(_x0, _y0, _x1, _y1, _color, _context) {
      Firework.call(this, _x0, _y0, _x1, _y1, _color, _context, true)
}

FireworkExplote.prototype = Object.create(Firework.prototype);

FireworkExplote.prototype.hitBlank = function () {
      const resultado = this.isNotDead() && this.children
      if (resultado) {
            this.children = false
      }
      return resultado
}

const PI2 = Math.PI * 2
let random = (min, max) => Math.random() * (max - min + 1) + min | 0

let canvas = document.getElementById('usa')
let ctx = canvas.getContext('2d')

const cyn = new Caynon(ctx)
cyn.resize()
window.onresize = () => cyn.resize()

function startShow() {
      requestAnimationFrame(startShow)

      cyn.load()

}

startShow()