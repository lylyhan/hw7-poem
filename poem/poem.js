const osmosis = require("osmosis");
const sbd = require("sbd");
const syllable = require("syllable");
const pos = require("pos");
const lexer = new pos.Lexer();
const tagger = new pos.Tagger();

function getRandomElement(array){
	return array[Math.floor(Math.random() * array.length)];
}

function scramble(array) {
	for(let i=0;i<array.length;i++){
		const randomIndex = Math.floor(Math.random()*array.length);
		const tmp = array[randomIndex];
		array[randomIndex] = array[i];
		array[i] = tmp;
	}
}

function cleanText(text){
	//Find any place where you have [number] and get rid of it
	return text.replace(/\[[0-9]+\]/g,"");//regular expressions regxr.com /g means match however many of times

}


async function getText(){
	
	return new Promise((resolve,reject)=>{
		let text = [];
		osmosis.get("https://johnsonsrambler.wordpress.com/author/johnsonsrambler/")//http://resonalyser.com/abouttheory/")
			.find("p")//p is paragraph, i is italic, li.toclevel-1 is list element that have a certain class
			.set("paragraph")//telling it what to do - put into object called content
			.data((item)=> text.push(item.paragraph))//deal with the text
			.done(()=>resolve(text))
			.error((e)=>reject(e));
	}); //call resolve when promise succeeds, call reject when promise fails
	
}

async function posPoem(posTypes){
	const paragraphs = await getText();
	//const posTypes = ["VBG"];//comparative adjectives
	const tokens = [];

	paragraphs.forEach(pg=>{
		const cleanpg = cleanText(pg);
		const sentences = sbd.sentences(cleanpg);
		sentences.forEach(sentence=>{
			const lexes = lexer.lex(sentence);
			const tags = tagger.tag(lexes);//tag returns word+part of speech
			//console.log(tags);
			tags.forEach(tag=>{
				//is the POS one of the ones we want 
				if(posTypes.includes(tag[1])){
					//ignore duplicates
					if(!tokens.includes(tag[0])){
						tokens.push(tag[0]);
					}
				}
			})
		})
	})




	return tokens;
}

async function myPoem() {
	const paragraphs = await getText();
	

	function getParts(posTypes){
		const tokens = [];
		
		paragraphs.forEach(pg=>{
		const cleanpg = cleanText(pg);
		const sentences = sbd.sentences(cleanpg);
		sentences.forEach(sentence=>{
			const lexes = lexer.lex(sentence);
			//console.log(lexes);
			const tags = tagger.tag(lexes);//tag returns word+part of speech
			
			tags.forEach(tag=>{
				//is the POS one of the ones we want 
				if(posTypes.includes(tag[1])){
				
					//ignore duplicates
					if(!tokens.includes(tag[0])){
						tokens.push(tag[0]);
					}
				}
				
			})
			
		})
	})
		return tokens;
	}

	
	function getpartsfollowed(posTypes){
		const tokens = [];
		const tokensentences = [];
		paragraphs.forEach(pg=>{
		const cleanpg = cleanText(pg);
		const sentences = sbd.sentences(cleanpg);
		sentences.forEach(sentence=>{
			const lexes = lexer.lex(sentence);
			//console.log(lexes);
			const tags = tagger.tag(lexes);//tag returns word+part of speech
			let i=0;
			let idx;
			tags.forEach(tag=>{
				//is the POS one of the ones we want 
				if(posTypes.includes(tag[1])){
					idx = i;
					
					//ignore duplicates
					if(!tokens.includes(tag[0])){
						tokens.push(tag[0]);
					}
					//break;

				}
				else{
					i+=1;
				}
			})
			if(idx){
			//console.log(tokens.slice(-1),sentence.split(" ").slice(idx,idx+1),lexes.slice(idx).join(" "));
			//console.log(idx,sentence.split(" ").slice(idx).join(" "));
			tokensentences.push(lexes.slice(idx).join(" "));
		}
			
		})
	})
		return tokensentences;
	}


	let noun = getParts(["NN"]);
	let nouns = getParts(["NNPS"]);
	let verbs = getParts(["VB"]);
	let foreign = getParts(["FW"]);
	let comparative = getParts(["JJR"]);
	let pronoun = getParts(["PRP"]);
	let whsentence = getpartsfollowed(["WDT"]);
	let passive = getpartsfollowed(["VBN"]);
	let what = getpartsfollowed(["WP"]);
	let ing = getParts(["VBG"]);
	let possess = getParts(["PP"]);
	//console.log(passive);
	//console.log(noun,nouns);
	let lines = [];	
	for(let i=0;i<3;i++){
		const n = getRandomElement(noun);
		const pro = getRandomElement(pronoun);
		const v = getRandomElement(verbs);
		const sentence = [n,",",pro,v].join(" ");
		lines.push(sentence);
	}

	for(let i=0;i<2;i++){
		//whsentence = getpartsfollowed(["WDT"]);
		picked = getRandomElement(passive);
		if(picked.includes(",")){
			picked = picked.split(",")[0];
		}
		else if(picked.includes(":")){
			picked = picked.split(":")[0];
		}
		//console.log(picked);
		//const sentence = [n,",",pro,v].join(" ");
		lines.push(picked);
	}

	if(foreign){
	lines.push("("+getRandomElement(foreign)+")");
	}


	lines.push(getRandomElement(noun));

	if(whsentence){
	for(let i=0;i<1;i++){
		//whsentence = getpartsfollowed(["WDT"]);
		scramble(whsentence);
		picked = whsentence[0];
		picked2 = whsentence[1];
		function check(picked){
			if(picked.includes(",")){
				picked = picked.split(",")[0];
			}
			else if(picked.includes(":")){
				picked = picked.split(":")[0];
			}
			else if(picked.includes("-")){
				picked = picked.split("-")[0];
			}
			return picked
		}
		picked = check(picked);
		picked2 = check(picked2);
		//console.log(picked);
		//const sentence = [n,",",pro,v].join(" ");
		lines.push(picked);
		lines.push(picked2);
	}
}

	for(let i=0;i<3;i++){
		//const n = getRandomElement(noun);
		const pro = getRandomElement(pronoun);
		const v = getRandomElement(verbs);
		const sentence = [pro,v].join(" ");
		lines.push(sentence);
	}
	if(what){
	for(let i=0;i<1;i++){
		//whsentence = getpartsfollowed(["WDT"]);
		picked = getRandomElement(what);
		if(picked.includes(",")){
			picked = picked.split(",")[0];
		}
		else if(picked.includes(":")){
			picked = picked.split(":")[0];
		}
		//console.log(picked);
		//const sentence = [n,",",pro,v].join(" ");
		lines.push(picked);
	}
}
	const ving = getRandomElement(ing);
	//const pos = getRandomElement(possess);
	lines.push([ving,"our",getRandomElement(nouns)].join(" "));
	lines.push(getRandomElement(noun));





	return lines;
}



async function makePoem() {
    return myPoem();
}

if (require.main === module) {
    makePoem().then(res => console.log(res));
}

module.exports = {
    makePoem
};
