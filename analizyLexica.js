var analyzeLexa = [];
var operations = new Map();
var symbol = new Map();
var tbl = document.createElement("table");
tbl.className = "table table-hover";
// tbl.style = "transition: 2s;"; 

operations.set('+', "Soma");
operations.set('-', "Subtração");
operations.set('*', "Multiplicação");
operations.set('/', "Divisão");
operations.set('**', "Potenciação");
symbol.set('(', "Parentese Esquerdo");
symbol.set(')', "Parentese Direito");

function isNumber(character) {
    return !isNaN(Number(character));
}

function isOperations(character) {
    if (operations.get(character)) {
        return true;
    }
    return false;
}

function isInvalidCharacter(character) {
    if (
        !isNumber(character) &&
        !isOperations(character) &&
        character != '(' &&
        character != ')'
    ) {
        return false;
    }
    return true;
}

function isInvalidExpression(equation) {
    let verifyEspace = new RegExp(/[0-9][\s]+[0-9]/);
    let spaceNumbres = verifyEspace.exec(equation);
    if (spaceNumbres) {
        alert("Erro na expressão fornecida, é obrigatorio ter uma operação entre os números " + spaceNumbres[0]);
        return false;
    }
    for (let i = 0; i < equation.length; i++) {
        if (!isInvalidCharacter(equation[i])) {
            alert("O caractere '" + equation[i] + "'' é inválido");
            return false;
        }
    }
    return true;
};

function findValue(character) {
    return operations.get(character) || symbol.get(character) || "Sem Representação";
}

function getNumbers(begin, size, equationText) {
    console.log("Caractere atual: " + equationText[begin]);
    let numbersTemp = '';

    if (
        ((equationText[begin] == '-') && (size - begin) && (isNumber(equationText[begin + 1]))) || // Número negativo 
        isNumber(equationText[begin]) // Apenas Número
    ) {
        if (equationText[begin] == '-') {
            numbersTemp += equationText[begin];
            begin++;
        }

        for (let i = begin; i < size; i++) {
            if (isNumber(equationText[i])) {
                numbersTemp += equationText[i];
            } else {
                analyzeLexa.push({
                    "lexema": Number.parseInt(numbersTemp),
                    "type": "Número",
                    "value": Number.parseInt(numbersTemp)
                });
                if (isOperations(equationText[i])) {
                    if ((equationText[i] == '*') && (equationText[i + 1]) && (equationText[i + 1] == '*')) { // Exponenciação
                        analyzeLexa.push({
                            "lexema": "**",
                            "type": "Operação",
                            "value": findValue("**")
                        });
                        return i + 1;
                    }
                    analyzeLexa.push({
                        "lexema": equationText[i],
                        "type": "Operação",
                        "value": findValue(equationText[i])
                    });
                } else {
                    analyzeLexa.push({
                        "lexema": equationText[i],
                        "type": "Símbolo",
                        "value": findValue(equationText[i])
                    });
                }
                return i;
            }
        }
        if ((size - 1 >= 0) && isNumber(equationText[size - 1])) {
            analyzeLexa.push({
                "lexema": Number.parseInt(numbersTemp),
                "type": "Número",
                "value": Number.parseInt(numbersTemp)
            });
        }
    } else {
        if (isOperations(equationText[begin])) {
            if ((equationText[begin] == '*') && (size - begin) && (equationText[begin + 1] == '*')) { // Exponenciação
                analyzeLexa.push({
                    "lexema": "**",
                    "type": "Operação",
                    "value": findValue("**")
                });
                return begin + 1;
            }
            analyzeLexa.push({
                "lexema": equationText[begin],
                "type": "Operação",
                "value": findValue(equationText[begin])
            });
        } else {
            analyzeLexa.push({
                "lexema": equationText[begin],
                "type": "Símbolo",
                "value": findValue(equationText[begin])
            });
        }
        return begin;
    }
}

function analyzeExpression() {
    analyzeLexa = [];
    let equation = document.getElementsByName('equation')[0].value;
    console.log("equation: " + equation);

    if (isInvalidExpression(equation)) {
        equation = equation.replace(/ /g, '');
        for (let i = 0; i < equation.length; i++) {
            i = getNumbers(i, equation.length, equation);
        }
    }

    analyzeLexa.unshift({
        "lexema": "Lexema",
        "type": "Tipo",
        "value": "Valor"
    });
    creatTable(analyzeLexa);
    //console.table(analyzeLexa);
}

function creatTable(analyzeLexa) {
    let body = document.getElementsByTagName("body")[0];
    let tblBody = document.createElement("tbody");
    let cell, row, lexema, type, value;

    if (document.getElementsByTagName("table")[0]) {
        document.getElementsByTagName("table")[0].innerHTML = "";
    }

    for (let i = 0; i < analyzeLexa.length; i++) {
        row = document.createElement("tr");
        cell = document.createElement("td");
        lexema = document.createTextNode(analyzeLexa[i].lexema);
        cell.appendChild(lexema);
        row.appendChild(cell);

        cell = document.createElement("td");
        type = document.createTextNode(analyzeLexa[i].type);
        cell.appendChild(type);
        row.appendChild(cell);

        cell = document.createElement("td");
        value = document.createTextNode(analyzeLexa[i].value);
        cell.appendChild(value);
        row.appendChild(cell);
        tblBody.appendChild(row);
    }

    tbl.appendChild(tblBody);
    body.appendChild(tbl);
    tbl.setAttribute("border", "1");
}