class Modeling {
    markerBusy = false // Якщо true , то маркер залишається в процесорі передачі
    modelingOutput(processors,reversGraph,inputGraph,nodesWeight,reversMatrMod){
          let flag =0
          let tact =1 // Для часу
          let string1 = "tact"
          let marker = 0
          processors[0].marked="m("+processors[0].from + "->" + processors[0].to + ")"
          let string = tact + " "
          for (let i=0;i<processors.length;i++){ // Для першого такту
              processors[i].currentNode = processors[i].nodes[0]
              string1 +="        P" + (i+1)
              string += "  " + (processors[i].currentNode +1)+processors[i].marked
              processors[i].remainWritingTime = nodesWeight[processors[i].currentNode]-1
          }
          console.log(string1)
          console.log(string)
          marker = 0

          while (flag ===0){ // Для кожного наступного такту,поки кожний процесор має вершини
              processors[marker].marked="         "
              if (!this.markerBusy) { // Перехід маркера в наступний процесор
                  marker === processors.length - 1 ? marker = 0 : marker += 1
              }
              processors[marker].marked="m("+processors[marker].from + "->" + processors[marker].to + ")"
              if (this.markerBusy && processors[marker].busy === true) // Якщо зайнятий маркер
              {
                  if (processors[marker].passNode === 0){ // Якщо пересилка закінчилася
                      let NextProcess
                      marker ===  processors.length-1 ? NextProcess = 0 : NextProcess=marker+1
                      if (processors[NextProcess].nodes.includes(processors[marker].to-1)){ // Якщо це отримувач
                          let forDelete = processors[NextProcess].neededNode.indexOf(processors[marker].to - 1)
                          let swapArray =[]
                          for (let u=0;u<processors[NextProcess].neededNode.length;u++){
                              if(u!==forDelete) {
                                  swapArray.push(processors[NextProcess].neededNode[u])
                              }
                          }
                          processors[NextProcess].neededNode=JSON.parse(JSON.stringify(swapArray))
                          this.markerBusy=false
                      }
                      else{ // Якщо це процесор ,який буде пересилати наступному маркер ,маркер не звільняється
                          processors[NextProcess].busy=true
                          processors[NextProcess].passNode=processors[marker].passWeight[0][0]-1
                          processors[NextProcess].from=processors[marker].from
                          processors[NextProcess].to=processors[marker].to
                          processors[NextProcess].passWeight.unshift(processors[marker].passWeight[0])
                      }
                      processors[NextProcess].receivedNode.push({from:processors[marker].from-1,to:processors[marker].to-1})
                      processors[marker].busy=false
                      processors[marker].from="  "
                      processors[marker].to="  "
                      processors[marker].marked="         "
                      processors[marker].passWeight.shift()
                      tact.toString().length === 2 ? string = tact  :  string = tact + " "
                      marker === processors.length - 1 ? marker = 0 : marker += 1
                      processors[marker].marked="m("+processors[marker].from + "->" + processors[marker].to + ")"



                  }
                  else {
                      processors[marker].passNode -= 1 // Віднімаємо такт ,бо ще не закінчилася пересилка
                  }
              }
              tact +=1
              tact.toString().length === 2 ? string = tact  :  string = tact + " "
              let flagBreaker =processors.length
              for (let i=0;i<processors.length;i++){
                  if (processors[i].nodes.length===0) { // Умова для виходу з циклу
                      flagBreaker -= 1
                  }
                  if (processors[i].remainWritingTime === 0 ) { // Якщо час запису вершини закінчився
                      let jump = inputGraph[processors[i].nodes[0]].filter(a => a > 0)
                      let nextNode = 0
                      for (let k = 0; k < jump.length; k++) { // Цикл для знаходження ,чи потрібно цю вершину передавати
                          nextNode = inputGraph[processors[i].nodes[0]].indexOf(jump[k], nextNode + 1)
                          let pass = [jump[k],processors[i].nodes[0],nextNode]
                          processors[i].passWeight.push(pass)
                      }
                      if (processors[i].nodes.length > 1 ) { //Якщо наступна вершина ще не отримала вхідні дані
                          processors[i].waitForOtherNode = processors[i].neededNode.includes(processors[i].nodes[1])
                          if (processors[i].waitForOtherNode) {
                              for (let h=2;h< processors[i].nodes.length;h++) { //Шукаємо вершину ,яка може виконуватися
                                  let notGood = 1
                                  let jumpRevers = reversMatrMod[processors[i].nodes[h]].filter(a => a > 0)
                                  let nextNode = 0
                                  for (let k = 0; k < jumpRevers.length; k++) {
                                      nextNode = reversMatrMod[processors[i].nodes[h]].indexOf(jump[k], nextNode + 1)
                                      if (processors[i].nodes.includes(nextNode)) {
                                          notGood = 0
                                          break
                                      }
                                  }
                                  if (!processors[i].neededNode.includes(processors[i].nodes[h] && notGood === 1)) {
                                      let forSwap1 = processors[i].nodes[h] //заміняємо вершини ,якщо знайдено вершину ,яка може виконуватися
                                      let forSwap2 = processors[i].nodes[1]
                                      processors[i].nodes[1] = forSwap1
                                      processors[i].nodes[h] = forSwap2
                                      processors[i].waitForOtherNode = false
                                      break
                                  }
                              }
                          }
                          if (processors[i].waitForOtherNode) { //Якщо процесор очікує на дані ,то пустота
                              processors[i].remainWritingTime = 0
                              processors[i].currentNode = " "
                              string += "  " + processors[i].marked
                              continue
                          }
                          }
                      if ( !processors[i].waitForOtherNode) {
                          processors[i].nodes.shift() //Видаляє вершину ,яка уже виконалася
                      }
                      if (!processors[i].waitForOtherNode) {
                          processors[i].currentNode = processors[i].nodes[0] //Призначення цифри та часу виконання наступної вершини
                          processors[i].remainWritingTime = nodesWeight[processors[i].currentNode]
                      }
                  }
                  if (processors[i].passWeight.length !==0 && !this.markerBusy // Умова для захвату маркера
                      && marker === i){
                      let fromNode = processors[i].passWeight[0][1]+1
                      let toNode = processors[i].passWeight[0][2]+1
                      fromNode.toString().length === 2 ?
                          processors[i].from = fromNode
                          :
                          processors[i].from = " " + fromNode
                      toNode.toString().length === 2 ?
                          processors[i].to = toNode
                          :
                          processors[i].to = " " + toNode
                          this.markerBusy=true
                          processors[i].busy=true
                          processors[i].passNode=processors[i].passWeight[0][0]-1
                      processors[marker].marked="m("+processors[marker].from + "->" + processors[marker].to + ")"
                  }

                  if (processors[i].nodes.length === 0) //Якщо вершин для процесора немає ,то пустота
                  {
                      processors[i].currentNode = " "
                      string += "  " + processors[i].marked
                      continue
                  }
                  processors[i].remainWritingTime -=1 // Віднімаємо такт ,бо ще не закінчився запис вершини
                  let currNode = processors[i].currentNode+1
                  currNode.toString().length === 2 ? // Те що буде виводитися в консоль
                      string += " " + (processors[i].currentNode +1)+processors[i].marked
                      :   string +="  " + (processors[i].currentNode +1)+processors[i].marked
              }
              if (flagBreaker===0){
                  flag =1
                  continue
              }
              console.log(string) // Вивід в консоль

          }
          return processors
      }
}
module.exports = new Modeling()
