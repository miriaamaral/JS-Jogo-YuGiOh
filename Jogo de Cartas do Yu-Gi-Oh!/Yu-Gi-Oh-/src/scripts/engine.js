const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: { /*Imagens- */
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    playerSides:{
    player1: "player-cards", //id do html
    player1BOX :document.querySelector("#player-cards"),
    computer: "computer-cards", //id do html
    computerBOX :document.querySelector("#computer-cards")
    },
    fieldCards: { //Cartas dos jogadores
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const pathImages = "./src/assets/icons/";

const cardData = [ //Enumerar as cartas
    {
        id: 0,
        name: "Dragão Branco de Olhos Azuis",
        type: "Papel",
        img: `${pathImages}dragon.png`,
        WinOf: [1], //Ganha da pedra id 1
        LoseOf: [2],//perde para tesoura id 2
    },
    {
        id: 1,
        name: "Mago Negro",
        type: "Pedra",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exódia",
        type: "Tesoura",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
];

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random()* cardData.length); //Floor serve para so receber Nºinteiro
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card"); //adicionou no jvascript a class card


    if(fieldSide === state.playerSides.player1){
       cardImage.addEventListener("mouseover", () => { //passar o mouse por cima
        drawSelectCard(IdCard);
        }); 
        
        cardImage.addEventListener("click", () => { //Quando clicar vai colocar no espaço reservado
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

async function setCardsField(cardId) {

    await removeAllCardsImages(); //remove todas as cartas antes

    let computerCardId = await getRandomCardId();   

    await ShowHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId); //compara uma carta com a outra


    await updateScore();
    await drawButton(duelResults); //mostrar o botão
}

async function drawCardsInField(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function ShowHiddenCardFieldsImages(value){
    if (value === true) {
        state.fieldCards.player.style.display = "block"; //muda pra display block
        state.fieldCards.computer.style.display = "block";
    }

    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "EMPATE";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "GANHOU";
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "PERDEU";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

async function removeAllCardsImages(){
    let {computerBOX, player1BOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atributo : " + cardData[index].type;

}
//Aqui fora o IdCard ainda é randômico
//Primeiro pensa na lógica, e depois na função
async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId(); //Id aleatório
        const cardImage = await createCardImage(randomIdCard, fieldSide); //Resgatar a imagem

        //console.log(fieldSide); Vai aparecer as cartas setadas para cara jogador

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel(){ //resetar o duelo
    state.cardSprites.avatar.src = "" ;
    state.actions.button.style.display = "none"; //vai desaparecer o botão

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init(); //Reinicia o jogo
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try{
        audio.play();
    }catch{}
}

function init() {

    ShowHiddenCardFieldsImages(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();