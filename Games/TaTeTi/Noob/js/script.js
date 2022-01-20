const tatetiGame = [[], [], []]

tatetiGame[0][0] = { el: c00, state: "", block: false }
tatetiGame[0][1] = { el: c01, state: "", block: false }
tatetiGame[0][2] = { el: c02, state: "", block: false }
tatetiGame[1][0] = { el: c10, state: "", block: false }
tatetiGame[1][1] = { el: c11, state: "", block: false }
tatetiGame[1][2] = { el: c12, state: "", block: false }
tatetiGame[2][0] = { el: c20, state: "", block: false }
tatetiGame[2][1] = { el: c21, state: "", block: false }
tatetiGame[2][2] = { el: c22, state: "", block: false }
let squardBlock = 0
let turno = "x"
let gameState = false

for (let i = 0; i < tatetiGame.length; i++) {
    for (let j = 0; j < tatetiGame[i].length; j++) {
        const element = tatetiGame[i][j].el
        element.addEventListener("click", function () {
            Play(i, j)
        })
    }
}


function GameOver() {
    if (tatetiGame[0][0].state === tatetiGame[0][1].state
        && tatetiGame[0][0].state === tatetiGame[0][2].state &&
        tatetiGame[0][0].state !== "") {
        alert(`Gano ${tatetiGame[0][0].state}`)
        gameState = true
    } else if (tatetiGame[1][0].state === tatetiGame[1][1].state
        && tatetiGame[1][0].state === tatetiGame[1][2].state
        && tatetiGame[1][0].state !== "") {
        alert(`Gano ${tatetiGame[1][0].state}`)
        gameState = true
    } else if (tatetiGame[2][0].state === tatetiGame[2][1].state
        && tatetiGame[2][0].state === tatetiGame[2][2].state
        && tatetiGame[2][0].state !== "") {
        alert(`Gano ${tatetiGame[2][0].state}`)
        gameState = true
    } else if (tatetiGame[0][0].state === tatetiGame[1][0].state
        && tatetiGame[0][0].state === tatetiGame[2][0].state
        && tatetiGame[0][0].state !== "") {
        alert(`Gano ${tatetiGame[0][0].state}`)
        gameState = true
    } else if (tatetiGame[0][1].state === tatetiGame[1][1].state
        && tatetiGame[0][1].state === tatetiGame[1][2].state
        && tatetiGame[0][1].state !== "") {
        alert(`Gano ${tatetiGame[0][1].state}`)
        gameState = true
    }else if (tatetiGame[0][2].state === tatetiGame[1][2].state
        && tatetiGame[0][2].state === tatetiGame[2][2].state
        && tatetiGame[0][2].state !== "") {
        alert(`Gano ${tatetiGame[0][2].state}`)
        gameState = true
    }else if (tatetiGame[0][0].state === tatetiGame[1][1].state
        && tatetiGame[0][0].state === tatetiGame[2][2].state
        && tatetiGame[0][0].state !== "") {
        alert(`Gano ${tatetiGame[0][0].state}`)
        gameState = true
    }else if (tatetiGame[0][2].state === tatetiGame[1][1].state
        && tatetiGame[0][2].state === tatetiGame[2][0].state
        && tatetiGame[0][2].state !== "") {
        alert(`Gano ${tatetiGame[0][2].state}`)
        gameState = true
    }else if(squardBlock === 9){
        alert("Nadie gano")
        gameState = true
    }
}

function Play(i, j) {
    if(gameState === false){
        if (tatetiGame[i][j].block === false) {
            tatetiGame[i][j].el.innerHTML = turno
            tatetiGame[i][j].state = turno
            tatetiGame[i][j].block = true
            squardBlock++
            turno === "x" ? turno = "o" : turno = "x"
            turn.innerHTML = turno
            GameOver()
        }
    }
}

replayButton.addEventListener("click", function(){
    for (let i = 0; i < tatetiGame.length; i++) {
        for (let j = 0; j < tatetiGame[i].length; j++) {
            const element = tatetiGame[i][j]
            tatetiGame[i][j].block = false
            tatetiGame[i][j].state = ""
            squardBlock = 0
            element.el.innerHTML = ""
            gameState = false
            element.el.addEventListener("click", function () {
                Play(i, j)
            })
        }
    }  
})