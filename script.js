var canvas = document.getElementById("canvas");
var pontos = document.getElementById("pontuacao");
var infoZumbis = document.getElementById("infoZumbis");
var porta = document.getElementById("fechamento");
var castelo = document.getElementById("castelo");
var body = document.getElementsByTagName("body");
var btnStart = document.getElementById("btnStart");
var divOver = document.getElementById('gameOver');
var btnOver = document.getElementById("comecar");

var ctx = canvas.getContext("2d");
var pontuacao = 0;
var pontosMaximos = 0;
var abates = 0;
var perdas = 0;
var tempoCriacao = 7000;
var tempoLooping = 320;
var zumbis = [];
var zumbisMorrendo = [];
var tempLooping = 0;
var tempCriaZumbi = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var audio = new Audio("sons/tiro2.mp3");
var imgZM = new Image();
imgZM.src = "img/zumbiH.png";

//Classe zumbi
function Zumbi (posx,posy){
    //atributos
    this.x =posx
    this.y =posy
    this.sx = 0
    this.sy = 0
    this.width = 0
    this.height = 0

    //métodos
    this.direita = function(){
        if(this.sx == 0){
            this.sx = 35
            this.sy = 308
            this.width = 27
            this.height = 63
            return
        }
        if(this.sx == 35){
            this.sx = 76
            this.xy = 309
            this.width = 32
            this.height = 63
            return
        }
        if(this.sx == 76){
            this.sx = 120
            this.sy = 310
            this.width = 32
            this.height = 61
            return
        }
        if(this.sx == 120){
            this.sx = 166
            this.xy = 310
            this.width = 30
            this.height = 61
            return
        }
        if(this.sx == 166){
            this.sx = 207
            this.sy = 310
            this.width = 32
            this.height = 61
            return
        }
        if(this.sx == 207){
            this.sx = 253
            this.xy = 308
            this.width = 33
            this.height = 64
            return
        }
        if(this.sx == 253){
            this.sx = 35
            this.sy = 308
            this.width = 27
            this.height = 63
            return
        }
    }

    this.morre = function(){
        if(this.sx == 22){
            this.sx = 57;
            this.sy = 179;
            this.width = 37;
            this.height = 59;
            return
        }
        if(this.sx == 57){
            this.sx = 97;
            this.sy = 183;
            this.width = 52;
            this.height = 54;
            return
        }
        if(this.sx == 97){
            this.sx = 162;
            this.sy = 192;
            this.y += 12;
            this.width = 65;
            this.height = 44;
            return
        }
        if(this.sx == 162){
            this.sx = 238;
            this.sy = 197;
            this.y += 15;
            this.width = 61;
            this.height = 39;
            return
        }
        this.sx = 22;
        this.sy = 177;
        this.width = 28;
        this.height = 61;
        return
    }

    this.draw = function(){
        ctx.drawImage(imgZM, this.sx, this.sy, this.width, this.height, this.x, this.y, this.width, this.height);
    }

}

//função de criação de zumbis em um array
function criarZumbi(){
    if(zumbis.length < 20){
        let novoZumbi = new Zumbi(2, porta.getBoundingClientRect().top + porta.offsetHeight);
        zumbis.unshift(novoZumbi);
    }
}


//Função para dar movimento aos zumbis
function looping(){
    atualizaPlacar();
    for (let i = 0; i < zumbis.length; i++) {
        ctx.clearRect(zumbis[i].x, zumbis[i].y, zumbis[i].width, zumbis[i].height)
        if(zumbis[i].x < porta.getBoundingClientRect().left){
            if(zumbis[i].x > porta.getBoundingClientRect().left - 270){
                zumbis[i].y -= 2;
            }
            zumbis[i].x+=8;
            zumbis[i].direita();
            zumbis[i].draw();
        }
        else{
            zumbis.splice(i, 1);
            perdas ++;
        }
    }

    for(let i=0; i < zumbisMorrendo.length; i++){
        ctx.clearRect(zumbisMorrendo[i].x, zumbisMorrendo[i].y, zumbisMorrendo[i].width, zumbisMorrendo[i].height)
        if(zumbisMorrendo[i].x<canvas.width-45){
            zumbisMorrendo[i].x+=8;
        }
        zumbisMorrendo[i].morre()
        zumbisMorrendo[i].draw()
        if(zumbisMorrendo[i].sx == 238){
            zumbisMorrendo.splice(i, 1);
        }
    }
}


//Função para atualizar os placares;
function atualizaPlacar(){
    console.log("Att placar");
    infoZumbis.innerHTML = ("Zumbis na tela: "+zumbis.length+"<br>Zumbis que entraram: "+perdas+"/5</p>");
    pontos.innerHTML = (pontuacao+" / " + pontosMaximos);
    if(perdas>=5){
        clearInterval(tempCriaZumbi);
        clearInterval(tempLooping);
        divOver.style.display = "flex";
    }
}

function atualizaTempo(){
    console.log("Att tempo");
    tempoCriacao -= 320;
    if(tempoCriacao > 3000){
        clearInterval(tempCriaZumbi);
        tempCriaZumbi = setInterval(criarZumbi, tempoCriacao);
    }else{
        tempoLooping -= 5;
        clearInterval(tempLooping);
        tempLooping = setInterval(looping, tempoLooping);
    }
}

function reiniciaJogo(){
    console.log("Reinicia");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pontosMaximos = pontuacao;
    pontuacao = 0;
    abates = 0;
    perdas = 0;
    tempoCriacao = 7000;
    tempoLooping = 320;
    zumbis = [];
    zumbisMorrendo = [];
    tempLooping = setInterval(looping, tempoLooping);
    tempCriaZumbi = setInterval(criarZumbi, tempoCriacao);
}

//Eventos
canvas.addEventListener('mousedown', function(m){
    audio.play();
    for(let i=0; i < zumbis.length; i++){
        if(((zumbis[i].x < m.clientX+12) && (zumbis[i].x+zumbis[i].width > m.clientX+22)) && ((zumbis[i].y < m.clientY+12) && (zumbis[i].y+zumbis[i].height > m.clientY+22))){
            console.log("Vou remover esse: " + i);
            pontuacao+=1;
            zumbisMorrendo.push(zumbis[i]);
            zumbis.splice(i, 1);
            clearInterval(tempCriaZumbi);
            setTimeout(criarZumbi, 500);
            setTimeout(atualizaTempo, 500);
        }
    }
    atualizaPlacar();
   
});
btnOver.addEventListener("click", function(){
    divOver.style.display = "none";
    reiniciaJogo()
});
btnStart.addEventListener("click", function(){
    btnStart.remove();
    reiniciaJogo();
});

