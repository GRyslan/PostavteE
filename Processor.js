class Processor{
    constructor(weight,nodesWeight,nodes) {
        this.weight=weight // вага пересилок
        this.nodesWeight=nodesWeight // вага вершин
        this.nodes=nodes // номер вершини
        this.currentNode = [] //номер вершини ,яка записується
        this.remainWritingTime = 0 // час запису вершини
        this.waitForOtherNode=false // чи очікує процесор на дані?
        this.neededNode=[] // вершини ,яким потрібні дані
        this.busy=false // чи в цьому процесорі маркер?
        this.marked = "         " //запис маркера в консоль
        this.passWeight=[] //Ваги пересилок
        this.receivedNode=[] //Отримані вершини
        this.from= "  " // пересилка від вершини
        this.to= "  " // пересилка до вершини
    }
}
module.exports = Processor