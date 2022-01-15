class Localization{
    currentCriticalWay = {length:false,weight:false,nodes:[]}

    findCriticalWay(graph,usedNodes){
        for (let i in graph){ // Прохід по кожній вершині
            if (usedNodes.includes(parseInt(i)) ){ //Якщо вершина уже зайнята ,перехід до наступної
                continue
            }
            let ii = parseInt(i)
            let possibleCriticalWays = [{length:false,weight:false,nodes:[ii],nextI:ii}]
            while (possibleCriticalWays.length !== 0) { // Знаходження всіх можливих критичних шляхів
                let jump = graph[ii].filter(a => a > 0)
                if (jump.length === 0) {// Порівння з найкращим на даний момент шляхом ,бо цей шлях закінчився
                    this.IsItBetterThanCurrent(possibleCriticalWays[possibleCriticalWays.length - 1])
                }
                let separateWay = possibleCriticalWays[possibleCriticalWays.length - 1]
                possibleCriticalWays.pop() // Видаляємо останній шлях з массиву через можливість того ,що він розгалужиться
                let lastNode = 0
                for (let j=0; j < jump.length; j++) { // цикл для збільшення поточних шляхів ( розгалуження)
                    let separator =  JSON.parse(JSON.stringify(separateWay))
                    let nextNode = graph[ii].indexOf(jump[j],lastNode+1)
                    separator.length += 1
                    separator.weight += jump[j]
                    separator.nodes.push(nextNode)
                    separator.nextI = nextNode
                    possibleCriticalWays.push(separator) // Добавляємо новий шлях в массив
                    lastNode = nextNode
                }
                if (possibleCriticalWays.length !== 0) { //Масив поточних шляхів непустий ? обираємо останній на даний момент
                    ii = possibleCriticalWays[possibleCriticalWays.length - 1].nextI
                }
            }
        }
        usedNodes=usedNodes.concat(this.currentCriticalWay.nodes)
        return usedNodes
    }
    IsItBetterThanCurrent(possibleCriticalWay){
        if ( possibleCriticalWay.length > this.currentCriticalWay.length) {
            delete possibleCriticalWay.nextI  // Якщо довжина поточного шляху більше ніж у найкращого
            this.currentCriticalWay = JSON.parse(JSON.stringify(possibleCriticalWay))
        }
        else if (possibleCriticalWay.length === this.currentCriticalWay.length &&
            possibleCriticalWay.weight > this.currentCriticalWay.weight){
            delete possibleCriticalWay.nextI // Якщо довжина однакова ,але вага пересилок,які будуть занулені ,більше
            this.currentCriticalWay = JSON.parse(JSON.stringify(possibleCriticalWay))
        }
        else if (possibleCriticalWay.length === this.currentCriticalWay.length &&
            possibleCriticalWay.weight === this.currentCriticalWay.weight&&
            possibleCriticalWay.nodes.length > this.currentCriticalWay.nodes.length){
            delete possibleCriticalWay.nextI // Для випадку ,коли залишилися одиничні вершини ,які не мають пересилок
            this.currentCriticalWay = JSON.parse(JSON.stringify(possibleCriticalWay))
        }
    }
}

module.exports = new Localization()