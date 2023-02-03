const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

// ω2' =  	2 sin(θ1-θ2) (ω12 L1 (m1 + m2) + g(m1 + m2) cos θ1 + ω22 L2 m2 cos(θ1 - θ2))/L2 (2 m1 + m2 - m2 cos(2 θ1 - 2 θ2))


const PI2 = Math.PI * 2
const PIhalf = Math.PI / 2
const PI = Math.PI

const limitX = canvas.width
const limitY = canvas.height

const G = 1

const sin = (seta) => { return Math.sin(seta) }
const cos = (seta) => { return Math.cos(seta) }
const print = (t) => { console.log(t) }

function selectColor(color) {
    ctx.fillStyle = color
    ctx.strokeStyle = color
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.closePath()
}

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    add(vector2) {
        this.x += vector2.x
        this.y += vector2.y
    }
    mul(m) {
        this.x *= m
        this.y *= m
    }
    div(m) {
        this.x /= m
        this.y /= m
    }
    toStr() {
        return `(${this.x}, ${this.y})`
    }
}

const Center = new Vector(350, 350)

function getRadian(x1, y1, x2, y2) {
    return Math.atan2(-y2 + y1, -x2 + x1)
}

class Ball {
    constructor(x, y, r, mass, O) {
        this.l = Math.sqrt((x - O.x) ** 2 + (y - O.y) ** 2)
        this.pos = new Vector(x, y)
        this.O = O
        this.r = r
        this.mass = mass

        this.seta = Math.PI / 4
        this.angularVelocity = 0
        this.angularAcceleration = 0

        this.beforeangularAcceleration = 0

        this.isMouseDown = false
    }
    get x() {
        return this.pos.x
    }
    get y() {
        return this.pos.y
    }
    get length() {
        return this.l
    }
    getAngularVelocity(seta) {
        return -G / this.l * Math.cos(seta)
    }
    draw() {
        drawLine(this.O.x, this.O.y, this.x, this.y)
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, PI2)
        ctx.fill()
        ctx.closePath()
    }
    move() {
        this.angularAcceleration = -1 * G / 10 / this.l * sin(this.seta);
        this.angularVelocity += this.angularAcceleration;
        this.seta += this.angularVelocity;
        this.pos.x = this.length * Math.sin(this.seta) + this.O.x
        this.pos.y = this.length * Math.cos(this.seta) + this.O.y
    }
    Init() {
        this.l = Math.sqrt((this.x - this.O.x) ** 2 + (this.y - this.O.y) ** 2)
        this.seta = drawmove_setaa
        this.angularVelocity = 0
        this.angularAcceleration = 0
        this.isMouseDown = false
    }
}

class HangingBall extends Ball {
    constructor(x, y, r, mass, hangTarget) {
        super(x, y, r, mass, hangTarget.pos)
        this.hangTarget = hangTarget
    }
    get length1() {
        return this.hangTarget.length
    }
    get seta1() {
        return this.hangTarget.seta
    }
    move() {
        let rad = this.seta1 - this.seta
        let w1 = this.hangTarget.angularVelocity

        let acceleration = 2 * sin(this.seta1-this.seta) * (w1 ** 2 * this.length1 * (this.hangTarget.mass + this.mass) + G * (this.hangTarget.mass + this.mass) * cos(this.seta1) + this.angularVelocity ** 2 * this.length * this.mass * cos(this.seta1 - this.seta))
        acceleration /= this.length * (2 * this.hangTarget.mass + this.mass - this.mass * cos(2 * this.seta1 - 2 * this.seta))

        this.angularAcceleration = acceleration / 15
        this.angularVelocity += this.angularAcceleration;
        this.seta += this.angularVelocity;
        this.pos.x = this.length * Math.sin(this.seta) + this.O.x
        this.pos.y = this.length * Math.cos(this.seta) + this.O.y
    }
}


let ball = new Ball(Center.x + 100, Center.y + 100, 10, 1, Center)
let ball2 = new HangingBall(ball.x + 100, ball.y + 100, 10, 1, ball)
let drawmove_seta = 0

function render() {
    ctx.clearRect(0, 0, limitX, limitY)

    ball.draw()
    if (!ball.isMouseDown) {
        ball.move()
    }

    ball2.draw()
    ball2.move()

    requestAnimationFrame(render)
}
render()

canvas.addEventListener("mousedown", (event) => {
    let clickPos = [event.offsetX, event.offsetY]
    let distance = Math.sqrt((clickPos[0] - ball.x) ** 2 + (clickPos[1] - ball.y) ** 2)
    if (distance <= ball.r * 5) {
        ball.isMouseDown = true
    }
})

canvas.addEventListener("mouseup", (event) => {
    if (ball.isMouseDown) {
        ball.Init()
    }
})

canvas.addEventListener("mouseleave", (event) => {
    if (ball.isMouseDown) {
        ball.Init()
    }
})

canvas.addEventListener("mousemove", (event) => {
    if (ball.isMouseDown) {
        ball.pos.x = event.offsetX
        ball.pos.y = event.offsetY
        drawmove_setaa = getRadian(ball.O.y, ball.O.x, event.offsetY, event.offsetX) + PI
        //let angle = drawmove_setaa * 180 / PI
        //print(`${angle}`)
    }
})