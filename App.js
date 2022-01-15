const localization = require("./Localization")
const processor = require("./Processor")
const modeling = require("./Modeling")
function main() {
    let inputGraph = [ // Вхідний граф
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
    let nodeWeight = [3, 5, 2, 8, 4, 7, 5, 4, 2, 3, 3, 6, 3, 2, 3, 7, 4] // Вхідні ваги вузлів
    function sumNodeWeight(nodes){
        let sum = 0
        for(let i of nodes){
            sum +=nodeWeight[i]
        }
        return sum
    }
    function revers(inputGraph){ // Функція для обертання вхідного графу
        let reversMatrMod = new Array(inputGraph.length)
        let reverMatrMod
        for (let i=0;i<inputGraph.length;i++){
            reverMatrMod = []
            for(let j=0;j<inputGraph.length;j++){
                reverMatrMod.push(inputGraph[j][i])
            }
            reversMatrMod[i]=reverMatrMod
        }
        return reversMatrMod
    }
    let usedNodes = []
    let pArrays = []
    let zeroWeightGraph = JSON.parse(JSON.stringify(inputGraph))
    let reversMatrMod = revers(inputGraph)
    while (usedNodes.length !== zeroWeightGraph.length){  // Поки  всі вузли не використовуються
        usedNodes=localization.findCriticalWay(zeroWeightGraph,usedNodes) //Знаходження максимального критичного шляху
        pArrays.push(new processor(localization.currentCriticalWay.weight,
            sumNodeWeight(localization.currentCriticalWay.nodes),
            localization.currentCriticalWay.nodes)) // Його загруження в процесор
        for(let j of localization.currentCriticalWay.nodes){ // Цикл для занулення критичного шляху
            zeroWeightGraph[j] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            for (let k in zeroWeightGraph){
                if (zeroWeightGraph[k][j] !== 0 ){
                    zeroWeightGraph[k][j] = 0
                }
            }

        }
        for(let l=0;l<localization.currentCriticalWay.nodes.length-1;l++) {
            inputGraph[localization.currentCriticalWay.nodes[l]][localization.currentCriticalWay.nodes[l+1]] = 0
        }// Цикл для занулення пересилок  у вхідному графі
        localization.currentCriticalWay = {length:false,weight:false,nodes:[]}
    }
    // Для даного випадку вийшло 5 процесорів(17 вершин розподілено між 5 процесорами)
    let flag = 0
    while (flag === 0) { // Цикл для видалення лишніх процесорів (вага пересилок до інших процесорів більше ніж вага вершин)
        let zeroWeightGraphOptimise = JSON.parse(JSON.stringify(inputGraph))
        let checkPass = new Array(pArrays.length - 1)
        let finalPass = 0
        for (let i = 0; i < pArrays.length - 1; i++) {
            finalPass = 0
            for (let j of pArrays[i].nodes) {
                let jump = inputGraph[j].filter(a => a > 0)
                let nextNode = 0
                for (let k = 0; k < jump.length; k++) { // Знаходження суми пересилок до кандитата на видалення
                    nextNode = inputGraph[j].indexOf(jump[k], nextNode + 1)
                    let pass = jump[k]
                    if (pArrays[pArrays.length - 1].nodes.includes(nextNode)) {
                        finalPass += pass * (pArrays.length - 1 - i )
                        zeroWeightGraphOptimise[j][nextNode]=0
                    }
                }
            }
            checkPass[i] = finalPass

        }
        finalPass = 0
        for (let q of pArrays[pArrays.length - 1].nodes) { // Знаходження суми пересилок від кандитата на видалення
            let jump = inputGraph[q].filter(a => a > 0)
            let nextNode = 0
            for (let w = 0; w < jump.length; w++) {
                nextNode = inputGraph[q].indexOf(jump[w], nextNode + 1)
                zeroWeightGraphOptimise[q][nextNode]=0
                let pass = jump[w]
                let y = 0
                while (true) {
                    finalPass += pass
                    if (pArrays[y].nodes.includes(nextNode)) {
                        checkPass[y] += finalPass
                        break
                    }
                    y += 1
                }
            }
        }
        let breakThis = 0
        for (let i = 0; i < pArrays.length - 1; i++) { // цикл для перенесення всіх вершин до суміжного процесора
            if (checkPass[i] >= pArrays[pArrays.length - 1].nodesWeight) {
                pArrays[i].nodesWeight += pArrays[pArrays.length - 1].nodesWeight
                let swap = JSON.parse(JSON.stringify(pArrays[pArrays.length - 1].nodes))
                pArrays.pop()
                pArrays[i].nodes = pArrays[i].nodes.concat(swap).sort(function(a,b){
                    return a - b
                })
                breakThis = 1
                inputGraph = JSON.parse(JSON.stringify(zeroWeightGraphOptimise))
                break
            }
        }
        if (breakThis !==1){
            flag =1
        }
    }
let reversGraph = revers(inputGraph) // Цикл для визначення пересилок ,що залишилися
    for (let w=0;w<=pArrays.length-1;w++) {
        for (let q of pArrays[w].nodes) {
            let jumpRevers = reversGraph[q].filter(a => a > 0)
            let nextNodeRevers = 0;
            for (let k = 0; k < jumpRevers.length; k++) {
                nextNodeRevers = reversGraph[q].indexOf(jumpRevers[k], nextNodeRevers + 1)
                pArrays[w].neededNode.push(q)
            }


        }
    }
    pArrays = modeling.modelingOutput(pArrays, reversGraph, inputGraph, nodeWeight,reversMatrMod) // моделювання

}
main()