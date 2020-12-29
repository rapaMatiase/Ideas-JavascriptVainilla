

function StartGame(el, data) {

    const mineWapperDesboard = {
        el,
        matrix :[]
    }

    const desboardValues = {
        el,
        unCoverSquard: 0,
        markedSquard: 0,
        continuePlay: true,
        ...data
    }

    const history = {el, linetime : []}

    Create(mineWapperDesboard, desboardValues, history)
    DrawGame(mineWapperDesboard, desboardValues, history)
}

const SquardState = {
    COVER: "Cover",
    UNCOVER: "UnCover",
    FLAG: "Flag",
    QUESTION: "Question"
}

function AddHistory(history, mineWapperDesboard, desboardValues) {
    const copyMineWapperDesboard = {el : 0, matrix : []} 
    const copyDesboardValues = {...desboardValues}
    for(var i = 0; i < mineWapperDesboard.matrix.length; i++){
        copyMineWapperDesboard.matrix.push([])
        for(var j = 0; j < mineWapperDesboard.matrix[i].length; j++){
            const item = { ...mineWapperDesboard.matrix[i][j]}
            copyMineWapperDesboard.matrix[i].push(item)
        }
    }
    history.linetime.push({ mineWapperDesboard : copyMineWapperDesboard, desboardValues : copyDesboardValues })
    console.log(history)
    DrawHistorty(mineWapperDesboard, desboardValues, history)

}

function RestoreHistory(history, mineWapperDesboard, desboardValues, i) {
    const item = history.linetime[i]
    desboardValues = item.desboardValues
    mineWapperDesboard = item.mineWapperDesboard
    history.linetime = history.linetime.splice(0, i)
    DrawHistorty(mineWapperDesboard, desboardValues, history)
    DrawGame(mineWapperDesboard, desboardValues, history)

}

/**
 * 
 */

function Create(mineWapperDesboard, desboardValues, history) {

    let id = 0
    for (let i = 0; i < desboardValues.numberOfRow; i++) {
        mineWapperDesboard.matrix[i] = []
        for (let j = 0; j < desboardValues.numberOfRow; j++) {
            mineWapperDesboard.matrix[i][j] = { 
                id: id, 
                x: i, 
                y: j, 
                content: 0, 
                state: SquardState.COVER 
            }
            id++
        }
    }


    const pares = []
    const YaExiste = (x, y) => {
        let resultado = false
        pares.forEach(e => {
            if (e.x == x && e.y == y) {
                resultado = true
            }
        })
        return resultado
    }

    for (let c = 0; c < desboardValues.numberOfMines; c++) {
        let x = Math.floor(Math.random() * desboardValues.numberOfMines)
        let y = Math.floor(Math.random() * desboardValues.numberOfMines)

        if (YaExiste(x, y) === false) {
            mineWapperDesboard.matrix[x][y].content = -1

            AddNumberAroundMine(x, y, mineWapperDesboard, desboardValues)
            pares.push({ x: x, y: y })
        } else {
            c--
        }
    }

    AddHistory(history, mineWapperDesboard, desboardValues)
}

function IsNotBomb(squard) {
    return squard.content != -1
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} mineWapperDesboard 
 * @param {*} desboardValues 
 */
function AddNumberAroundMine(x, y, mineWapperDesboard, desboardValues) {
    const lowerLimitX = (x - 1) < 0 ? 0 : (x - 1)
    const lowerLimitY = (y - 1) < 0 ? 0 : (y - 1)

    const upperLimitX = (x + 1) >= desboardValues.numberOfRow ? (desboardValues.numberOfRow - 1) : (x + 1)
    const upperLimitY = (y + 1) >= desboardValues.numberOfRow ? (desboardValues.numberOfRow - 1) : (y + 1)

    for (var i = lowerLimitX; i <= upperLimitX; i++) {
        for (var j = lowerLimitY; j <= upperLimitY; j++) {
            if (IsNotBomb(mineWapperDesboard.matrix[i][j])) {
                mineWapperDesboard.matrix[i][j].content += 1
            }
        }
    }

}

function Marked(el, mineWapperDesboard, desboardValues, history) {
    const x = el.getAttribute("data-x")
    const y = el.getAttribute("data-y")
    const estado = mineWapperDesboard.matrix[x][y].state

    if (desboardValues.continuePlay) {
        if (estado == SquardState.COVER) {
            mineWapperDesboard.matrix[x][y].state = SquardState.FLAG
            desboardValues.markedSquard += 1
        } else if (estado == SquardState.FLAG) {
            mineWapperDesboard.matrix[x][y].state = SquardState.QUESTION
            desboardValues.markedSquard -= 1
        } else if (estado == SquardState.QUESTION) {
            mineWapperDesboard.matrix[x][y].state = SquardState.COVER
        }
        UpdateView(x, y, mineWapperDesboard, desboardValues)
        GameOver(false, desboardValues)
    }

    AddHistory(history, mineWapperDesboard, desboardValues)
}

function Show(el, mineWapperDesboard, desboardValues, history) {
    const x = el.getAttribute("data-x")
    const y = el.getAttribute("data-y")
    const estado = mineWapperDesboard.matrix[x][y].state

    if (desboardValues.continuePlay) {
        if (estado == SquardState.COVER) {
            // Don't worry is content are mine, 
            mineWapperDesboard.matrix[x][y].state = SquardState.UNCOVER
            desboardValues.unCoverSquard += 1
            if (mineWapperDesboard.matrix[x][y].content === -1) {
                GameOver(true, desboardValues)
                AddHistory(history, mineWapperDesboard, desboardValues)
            } else if (mineWapperDesboard.matrix[x][y].content === 0) {
                ShowAllNumberZero(x, y, mineWapperDesboard, desboardValues,  history)
            }else{
                
            }
        }
        UpdateView(x, y, mineWapperDesboard, desboardValues)
        GameOver(false, desboardValues)
    }


}

function ShowAllNumberZero(x, y, mineWapperDesboard, desboardValues, history) {
    const lowerX = (x - 1) < 0 ? 0 : (x - 1)
    const lowerY = (y - 1) < 0 ? 0 : (y - 1)

    const upperX = (x + 1) >= desboardValues.numberOfRow ? (desboardValues.numberOfRow - 1) : (x + 1)
    const upperY = (y + 1) >= desboardValues.numberOfRow ? (desboardValues.numberOfRow - 1) : (y + 1)

    for (var i = lowerX; i <= upperX; i++) {
        for (var j = lowerY; j <= upperY; j++) {
            if (mineWapperDesboard.matrix[i][j].state == SquardState.COVER) {
                if (mineWapperDesboard.matrix[i][j].content === 0) {
                    const el = document.getElementById(mineWapperDesboard.matrix[i][j].id)
                    Show(el, mineWapperDesboard, desboardValues, history)
                } else if (mineWapperDesboard.matrix[x][y].content == ! -1) {
                    const el = document.getElementById(mineWapperDesboard.matrix[i][j].id)
                    Show(el, mineWapperDesboard, desboardValues, history)
                    AddHistory(history, mineWapperDesboard, desboardValues)
                }
            }

        }
    }

}

function DrawSquard(squard) {
    const squarElement = document.createElement("div")
    squarElement.setAttribute("class", `squard ${squard.state}`)
    squarElement.setAttribute("data-x", squard.x)
    squarElement.setAttribute("data-y", squard.y)
    squarElement.setAttribute("id", squard.id)
    return squarElement
}



function DrawGame(mineWapperDesboard, desboardValues, history) {
    const padre = document.getElementById("main")
    padre.innerHTML = ""
    padre.style = `grid-template: repeat(${desboardValues.numberOfRow}, 1fr) / repeat(${desboardValues.numberOfRow}, 1fr)`;
    for (var i = 0; i < desboardValues.numberOfRow; i++) {
        for (var j = 0; j < desboardValues.numberOfRow; j++) {
            const squarElement = DrawSquard(mineWapperDesboard.matrix[i][j])
            squarElement.addEventListener("click", (e) => Show(e.target, mineWapperDesboard, desboardValues, history))
            squarElement.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                Marked(e.target, mineWapperDesboard, desboardValues, history)
            })
            padre.appendChild(squarElement)
            UpdateView(i, j, mineWapperDesboard, desboardValues)

        }
    }



    document.getElementById("mine").appendChild(document.createTextNode(desboardValues.numberOfMines))
    document.getElementById("uncover").appendChild(document.createTextNode(desboardValues.unCoverSquard))
    document.getElementById("marketed").appendChild(document.createTextNode(desboardValues.markedSquard))
}

function DrawHistorty(mineWapperDesboard, desboardValues, history){
    const el = document.getElementById("history")
    el.innerHTML = ""
    for(var i = 0; i < history.linetime.length; i++){
        const elItem = document.createElement("div")
        elItem.classList.add("item")
        elItem.setAttribute("id", i)
        elItem.appendChild(document.createTextNode(`MOvimiento ${i+1}`))
        elItem.addEventListener("click", function(e){
            RestoreHistory(history, mineWapperDesboard, desboardValues, e.target.getAttribute("id"))
        })
        el.appendChild(elItem)
    }
}


function ChangeStateView(el, state, newState) {
    el.classList.remove(state)
    el.classList.add(newState)
}

function UpdateView(x, y, mineWapperDesboard, desboardValues) {
    const element = document.getElementById(mineWapperDesboard.matrix[x][y].id)
    const state = mineWapperDesboard.matrix[x][y].state
    const content = mineWapperDesboard.matrix[x][y].content

    if (state == SquardState.FLAG) {
        ChangeStateView(element, SquardState.COVER, SquardState.FLAG)
    } else if (state == SquardState.QUESTION) {
        ChangeStateView(element, SquardState.FLAG, SquardState.QUESTION)
    } else if (state == SquardState.COVER) {
        ChangeStateView(element, SquardState.QUESTION, SquardState.COVER)
    } else if (state == SquardState.UNCOVER) {
        ChangeStateView(element, SquardState.COVER, SquardState.UNCOVER)
        element.innerHTML = ""
        element.appendChild(document.createTextNode(content))
    }

    document.getElementById("uncover").innerHTML = ""
    document.getElementById("uncover").appendChild(document.createTextNode(desboardValues.unCoverSquard))
    document.getElementById("marketed").innerHTML = ""
    document.getElementById("marketed").appendChild(document.createTextNode(desboardValues.markedSquard))

}



function GameOver(mina, desboardValues) {
    const { numberOfRow, numberOfMines, markedSquard, unCoverSquard } = { ...desboardValues }
    if ((numberOfRow * numberOfRow) == (markedSquard + unCoverSquard) && markedSquard === numberOfMines) {
        desboardValues.continuePlay = false
        console.log("GANASTE")
        document.getElementById("state").appendChild(document.createTextNode("Ganaste"))
    }

    if (mina === true) {
        desboardValues.continuePlay = false

        console.log("PERDISTE")
        document.getElementById("state").appendChild(document.createTextNode("PERDISTE"))

    }
}