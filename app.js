const gameBoardCreation = ()=>{
	const board = $('#board');
	board.html('');
	let tileArr = [];
	for(let i=0; i<10; i++){
		for(let j=0; j<10; j++){
			board.append('<div class="tile"></div>');
			tileArr.push({x: j, y: i, alive: false, index: (10*i)+j});
		}
	}
	return tileArr; 
}

const prepareTheGame = () => {
	const tilesDataArray = gameBoardCreation();
	const generateRandomIndexes = () => {
		let randNumbers = [];
		while(randNumbers.length<=20){
			const randNum = Math.floor(Math.random()*100);
			if(randNumbers.indexOf(randNum)===-1){
				randNumbers.push(randNum);
			}
		}
		return randNumbers;
	}
	const indexesOfAliveTilesAtStart = generateRandomIndexes();

	const prepareAliveTiles = () => {
		const tiles = $('.tile'); 
		for(let i=0; i<indexesOfAliveTilesAtStart.length; i++){
			tiles.eq(indexesOfAliveTilesAtStart[i]).addClass('tile--alive');
			tilesDataArray[indexesOfAliveTilesAtStart[i]].alive=true;
		}
	}
	prepareAliveTiles();
	return tilesDataArray;
}

const start = $('header button');

let gameIsRunning = false; 
let runTheGame;
start.on("click", ()=>{
	if(!gameIsRunning){
		gameIsRunning=true; 
		start.text('STOP');
		$('.info').addClass('info--hidden');
		let tilesDataArray = prepareTheGame();
		runTheGame = setInterval(()=>{
		tilesDataArray = updateBoardData(tilesDataArray);
		updateBoard(tilesDataArray);
		},2000)
	}else{
		clearInterval(runTheGame);
		gameIsRunning = false;
		start.text('START');
	}	
})

const updateBoard = (tiles) => {
	const tilesFromGame = $('.tile');
	for(let i=0; i<tilesFromGame.length; i++){
		tilesFromGame.eq(i).removeClass('tile--alive');
		if(tiles[i].alive){
			tilesFromGame.eq(i).addClass('tile--alive');
		}
	}
}

const updateBoardData = (tiles) => {
	const updatedTiles = tiles.map((tile,i)=>{
		let neighbours = [];
		let x;
		let y;
		//left-top add to array if exist:
		if(tile.x>0 && tile.y>0){
			x = tile.x-1;
			y = tile.y-1;
			neighbours.push(tiles[(10*y)+x]);
		}
		//top add to array if exist:
		if(tile.y>0){
			x = tile.x;
			y = tile.y-1;
			neighbours.push(tiles[(10*y)+x]);
		}
		//top right add to array if exist:
		if(tile.y>0 && tile.x<9){
			x = tile.x+1;
			y = tile.y-1;
			neighbours.push(tiles[(10*y)+x]);
		}
		//left add to array if exists:
		if(tile.x>0){
			x = tile.x-1;
			y = tile.y;
			neighbours.push(tiles[(10*y)+x]);
		}
		//right add to array if exists:
		if(tile.x<9){
			x = tile.x+1;
			y = tile.y;
			neighbours.push(tiles[(10*y)+x]);
		}
		//bottom left add to array if exists:
		if(tile.y<9 && tile.x>0){
			x = tile.x-1;
			y = tile.y+1;
			neighbours.push(tiles[(10*y)+x]);
		}
		//bottom add to array if exists:
		if(tile.y<9){
			x = tile.x;
			y = tile.y+1;
			neighbours.push(tiles[(10*y)+x]);
		}
		//bottom right add to array if exists:
		if(tile.y<9 && tile.x<9){
			x = tile.x+1;
			y = tile.y+1;
			neighbours.push(tiles[(10*y)+x]);
		}
		const livingNeighbours = neighbours.filter(neighbour=>neighbour.alive === true);
		let updatedTile = {};
		if(tile.alive && (livingNeighbours.length<2 || livingNeighbours.length >3)){
			return{...tile, alive:false};
			
		}else if(!tile.alive && livingNeighbours.length === 3){
			return{...tile, alive:true }
		}
		return tile; 
	});
	return updatedTiles; 
}