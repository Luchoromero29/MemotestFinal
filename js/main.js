const CASILLAS_BOTON = document.getElementsByClassName("casilla-button")
const CASILLAS = document.getElementsByClassName("casilla")
const ACIERTOS = document.getElementById("aciertos") 
const INTENTOS = document.getElementById("intentos")
const BOTON_INICIO =document.getElementById("boton-inicio")
const BOTON_RESTART =document.getElementById("boton-restart")
const TIEMPO = document.getElementById("tiempo")
let puntuacion = 1000;

const jugador = {nombre: "", puntuacion: ""}

const imagenes = [
    {id: 0, url: "imagenes/banana.svg", click: false},
    {id: 1, url: "imagenes/banana.svg", click: false},
    {id: 2, url: "imagenes/manzana.svg", click: false},
    {id: 3, url: "imagenes/manzana.svg", click: false},
    {id: 4, url: "imagenes/frutilla.svg", click: false},
    {id: 5, url: "imagenes/frutilla.svg", click: false},
    {id: 6, url: "imagenes/sandia.svg", click: false},
    {id: 7, url: "imagenes/sandia.svg", click: false},
    {id: 8, url: "imagenes/limon.svg", click: false},
    {id: 9, url: "imagenes/limon.svg", click: false},
    {id: 10, url: "imagenes/palta.svg", click: false},
    {id: 11, url: "imagenes/palta.svg", click: false},
    {id: 12, url: "imagenes/uva.svg", click: false},
    {id: 13, url: "imagenes/uva.svg", click: false},
    {id: 14, url: "imagenes/naranja.svg", click: false},
    {id: 15, url: "imagenes/naranja.svg", click: false}
]

let par = [];
let aciertos = 0;
let intentos = 0;
let time = 46;



document.addEventListener("DOMContentLoaded",() => {
    mezclarCasillas()
    crearCasillas()
    agregarEventos()
    desabilitarBotones();
    actualizarScore()

    BOTON_INICIO.addEventListener("click",()=>{
        habilitarBotones()
        actualizarScore()
        cronometro();
    })

    BOTON_RESTART.addEventListener("click",() => {location.reload()})
}); 

const mezclarCasillas = () => {
    for (let i = 0 ; i < imagenes.length ; i++){
        const j = Math.floor(Math.random() * (i+1));
        [imagenes[i],imagenes[j]] = [imagenes[j],imagenes[i]];
    }
    let i = Math.floor(Math.random() * (16));
    [imagenes[0],imagenes[i]] = [imagenes[i],imagenes[0]]

}
    

const crearCasillas = () => {
    for (const imagen of imagenes) {
        let div = document.createElement("div");
        div.innerHTML = `<button id="${imagen.id}" class="casilla-button hidden">
                <img src="${imagen.url}" alt="icon">
            </button>`     
        div.classList.add("casilla")                
        document.getElementById("tablero").append(div)  
    }
}

const agregarEventos = () => {
    for (const boton of CASILLAS_BOTON) {
        boton.addEventListener("click", () => {juego(boton)})
    }
}

const juego = (boton) => {
    
    
    const elemento = imagenes.find(elemento => elemento.id == boton.id)
    const index = imagenes.indexOf(elemento)
    console.log(ACIERTOS);
    console.log(INTENTOS);
    
    //verifico que el id no este en el par y que no se haya revelado
    if(!incluido(par,elemento.id) && elemento.click === false){
        
        //actulizo los clicks en el array de imagenes
        imagenes[index].click === true

        //cargo el par
        elemento.click = true;
        elemento.index = index;
        elemento.boton = boton
        par.push(elemento)

        //lo hago visible
        boton.classList.remove("hidden")


        //reviso si ya toco dos veces
        if (par.length === 2){
            if (validacionPar()){
                par = []
                aciertos++;
            }else{
                desabilitarBotones()
                setTimeout(() => {
                    par[0].boton.classList.add("hidden")
                    imagenes[par[0].index].click = false;
                    par[1].boton.classList.add("hidden")
                    imagenes[par[1].index].click = false;
                    par= []
                    habilitarBotones()
                }, 700)   
            }
            intentos++;
            actualizarScore();

        }

        //revision de terminacion
        if (termino()){
            setTimeout(() => {
                calculoPuntos()
                alert(`!GANASTE, hiciste ${puntuacion} puntos`)
            location.reload;
        }, 200);
        }
    }
}


const desabilitarBotones = () => {
    for (const boton of CASILLAS_BOTON) {
        boton.disabled = true;
        
    }
    for (const casilla of CASILLAS) {
        casilla.classList.add("blur");
    }
    
}

const habilitarBotones = () => {
    for (const boton of CASILLAS_BOTON) {
        boton.disabled = false;
    }
    for (const casilla of CASILLAS) {
        casilla.classList.remove("blur");
    }
}

const validacionPar = () => {
    return par[0].url === par[1].url || false
}

const incluido = (array, id) => {
    if(array.length == 0) return false
    return array.includes(elemento => elemento.id == id)
}

const termino = () =>{
    return aciertos === 8 || false
}

const actualizarScore = () => {
    ACIERTOS.innerHTML = `Aciertos: ${aciertos}`;
    INTENTOS.innerHTML = `Intentos: ${intentos}`
}

const cronometro = () => {
    

    setInterval(() => {
        --time;
        TIEMPO.innerHTML = `Tiempo restante: ${time} segundos`

        if(time == 0){
            alert("se te acabo el tiempo crack")
            location.reload();
        }
    },1000)
}

const calculoPuntos = () => {
    puntuacion = (puntuacion * time)/intentos
}

