let values = {
    "I": 1,
    "V": 5,
    "X": 10
}


function romanToNum(roman) {
    let splitRoman = roman.split("")
    let splitRomanNums = splitRoman.map(e => values[e]).reduce((a, e) => {
        if(a > e) {
            return a + e
        } else {
            return a - e
        }
    }, 0)
    console.log(Math.abs(splitRomanNums))
}


romanToNum("IV")