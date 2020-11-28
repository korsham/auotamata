let fs = require('fs');
const readlineSync = require('readline-sync');
function getParametersOfProgram() {
	let pathToInputFile;
	let pathToOutputFile;
	process.argv.forEach((val, index) => {
		if (index == 2)
			pathToInputFile = val;
		if (index == 3)
		pathToOutputFile = val;
	});
	if (pathToInputFile == undefined || pathToOutputFile == undefined) {
		console.error('ACHTUNG!\nНужно указать пути к считываемому файлу и файлу для вывода результата программы!\nACHTUNG!');
		process.exit(-1);
	}
	return new Array(pathToInputFile, pathToOutputFile);
}
function GetTemplateAlphabet(template) {
	let alphabet = new Array()
	for(let i = 0; i < template.length; i++) 
	{
		alphabet[template.charAt(i)] = 0;
	}
	return alphabet;
}
function GetTransformationTable (template) {
	let alphabet = GetTemplateAlphabet(template);
	let transformationTable = new Array(template.length + 1);
	for(j = 0; j <= template.length; j++) 
	{
		transformationTable[j] = new Array();
	}
	for(i in alphabet) 
	{
		transformationTable[0][i] = 0;
	}
	for(j = 0; j < template.length; j++)
	{
		let lastCondition = transformationTable[j][template.charAt(j)];
		transformationTable[j][template.charAt(j)] = j + 1;
		for(i in alphabet) 
		{
			transformationTable[j + 1][i] = transformationTable[lastCondition][i];
		}
	}
	return transformationTable;
}
function ArrayContains (neededLetter, array) {
	for (let letter in array) 
	{
		if (letter == neededLetter) 
		{
			return true;	
		}
	}
	return false;
}

function FindAllEntriesInText (text, template) {
	let alphabet = GetTemplateAlphabet(template);
	let transformationTable = GetTransformationTable(template);
	let actuallyCondition = 0;
	let result = new Array();
	for (let i = 0; i < text.length; i++) 
	{
		if (ArrayContains(text[i], alphabet))
		{
			actuallyCondition = transformationTable[actuallyCondition][text.charAt(i)];
		}
		else
		{
			actuallyCondition = 0;
		}
		if (actuallyCondition == transformationTable.length - 1)
		{
			result.push(i - actuallyCondition + 2);
		}
	}
	return result;
}

function perform(pathToInputFile, pathToOutputFile) {
	fs.readFile(pathToInputFile, (err, data) => {
	if (err) {
		if (err.code == 'ENOENT') {
			console.error('ОШИБКА!\nПути ' + pathToInputFile + ' не существует');
			process.exit(-1);
		}
		if (err.code == 'EISDIR') {
			console.error('ACHTUNG!\nОжидался путь до файла\nНо указан путь до каталога!');
			process.exit(-1);
		}
		if (err.code == 'EACCES') {
			console.error('ACHTUNG!\nОтказано в доступе к файлу ' + pathToInputFile);
			process.exit(-1);
		}
	}

	var text = data.toString();
	let template = readlineSync.question("Enter your template: ");
	let start = new Date();
	let result = FindAllEntriesInText(text, template);
	let end = new Date();
	console.log("Elapsed time: ", end - start, " milliseconds");
	fs.writeFile(pathToOutputFile, result, (err) => {
		if (err) {
			if (err.code == 'EACCES')
				console.error('ACHTUNG!\nОтказано в доступе к файлу ' + pathToOutputFile);
			process.exit(-1);
		}
	});
	});
}

function main() {
	let parametersOfProgram = getParametersOfProgram();
	let pathToInputFile = parametersOfProgram[0];
	let pathToOutputFile = parametersOfProgram[1];
	perform(pathToInputFile, pathToOutputFile);
}
main();