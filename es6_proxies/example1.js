class Student {
    constructor(first, last, scores) {
        this.firstName = first;
        this.lastName = last;
        this.testScores = scores;
    }
    get average() {
        let average = this.testScores.reduce(
            (a,b) => a + b,
            0
        ) / this.testScores.length;
        return average;
    }
}

let john = new Student( 'John', 'Dwan', [60, 80, 80] );
