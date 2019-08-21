/**
 This code displays decomposition of chinese characters.
 author: François Schwarzentruber
*/
let characters = {};

function loadCharacters(txt) {
	for (let line of txt.split("\n")) {
		//if(line[0] == "	")
		{
			line = line.trim();
			slipLine = line.split("	");
			infoCharacter = { type: slipLine[2], char1: slipLine[3], char2: slipLine[6] }
			characters[line[0]] = infoCharacter;
		}
	}
}


function setCurrentChar(char) {
	$("#decomposition").empty();
	$("#character").html(char);
	$("#meaning").html(dictionnary[char]);
	show(char, { x: 0, y: 0, w: 512, h: 512 });
}

function load() {
	$.ajax({
		url: "characters.txt",
		context: document.body
	}).done(loadCharacters);


	function addCharacter(char) {
		$("#list").append("<option value='" + char + "'>" + char + "</option>");
	}

	for (let char in dictionnary) addCharacter(char);

	$("#list").change(function (evt) {
		const char = $(this).val();
		setCurrentChar(char);
	});

	$("#list").val("口");
	setCurrentChar("口");
}



function ifExists(char, ifExistsFunction, ifNotFunction) {
	$.ajax({
		type: 'HEAD',
		url: 'img/' + char + ".png",
		success: ifExistsFunction,
		error: ifNotFunction
	});

}



function addImg(char, rect) {
	let img = $("<img src='img/" + char + ".png' width=" + rect.w + " height=" + rect.h + ">");
	$("#decomposition").append(img);
	img.parent().css({ position: 'relative' });
	console.log(rect)
	img.css({ top: rect.y + "px", left: rect.x + "px", position: 'absolute' });
}


function show(char, rect) {
	ifExists(char,
		() => addImg(char, rect),
		function () {
			console.log("arf")
			const decomposition = getDecomposition(char);


			if (decomposition.type == "一")
				addImg(decomposition.char1, rect);
			else if (decomposition.type == "吅") {
				addImg(decomposition.char1, { x: rect.x, y: rect.y, w: rect.w / 2, h: rect.h });
				addImg(decomposition.char2, { x: rect.x + rect.w / 2, y: rect.y, w: rect.w / 2, h: rect.h });
			}
			else if (decomposition.type == "吕") {
				addImg(decomposition.char1, { x: rect.x, y: rect.y, w: rect.w, h: rect.h / 2 });
				addImg(decomposition.char2, { x: rect.x, y: rect.y + rect.h / 2, w: rect.w, h: rect.h / 2 });
			}
			else if (decomposition.type == "品") {
				addImg(decomposition.char1, { x: rect.x, y: rect.y, w: rect.w, h: rect.h / 2 });
				addImg(decomposition.char1, { x: rect.x, y: rect.y + rect.h / 2, w: rect.w / 2, h: rect.h / 2 });
				addImg(decomposition.char1, { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2, w: rect.w / 2, h: rect.h / 2 });
			}
		}

	)
}




$().ready(load);

function getDecomposition(char) {
	return characters[char];
}

