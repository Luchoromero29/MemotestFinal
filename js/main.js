const CASILLAS_BOTON = document.getElementsByClassName("casilla-button")
const CASILLAS = document.getElementsByClassName("casilla")
const ACIERTOS = document.getElementById("aciertos") 
const INTENTOS = document.getElementById("intentos")
const BOTON_INICIO =document.getElementById("boton-inicio")
const BOTON_RESTART =document.getElementById("boton-restart")
const TIEMPO = document.getElementById("tiempo")
const REGISTRO = document.getElementById("registro");
const BOTON_REGISTRO = document.getElementById("boton-registro")
const INPUT_NOMBRE = document.getElementById("input-nombre")
const ERROR = document.getElementById("nombre-existente")
const BOTON_CAMBIAR_JUGADOR =document.getElementById("boton-cambiarJugador")
const RECORD_NOMBRE =document.getElementById("record-nombre")
const RECORD_PUNTOS = document.getElementById("record-puntos")

const ls = localStorage;
let puntuacion = 1000;
const jugador = {nombre: "", puntuacion: 0}
let reinicio = false;

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

let gano = false;
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
    visible(REGISTRO);
    inicioRegistro();
    actualizarRecord();

    BOTON_INICIO.addEventListener("click",()=>{
        
        habilitarBotones()
        actualizarScore()
        cronometro();
        bloquearBoton(BOTON_INICIO);
        bloquearBoton(BOTON_CAMBIAR_JUGADOR)
        desbloquearBoton(BOTON_RESTART);
        gano = false;
    })

    BOTON_RESTART.addEventListener("click",() => {
        reiniciarJuego();
        TIEMPO.innerHTML = "Tiempo restante: 0"
        reinicio = true;
        desbloquearBoton(BOTON_INICIO)
        desbloquearBoton(BOTON_CAMBIAR_JUGADOR)
        bloquearBoton(BOTON_RESTART);
    })

    BOTON_CAMBIAR_JUGADOR.addEventListener("click", () => {
        inicioRegistro();
        
    })
}); 

const reiniciarJuego = () => {
    mezclarCasillas();
    crearCasillas();
    agregarEventos();
    desabilitarBotones();
    desbloquearBoton(BOTON_INICIO)
    desbloquearBoton(BOTON_CAMBIAR_JUGADOR)
    intentos= 0
    aciertos = 0
    reinicio = false;
    actualizarScore();
    time = 45;
    par= [];
    

    for (const boton of CASILLAS_BOTON) {
        boton.classList.add("hidden")   
    }
    for (const imagen of imagenes) {
        imagen.click = false;
    }
}

const mezclarCasillas = () => {
    for (let i = 0 ; i < imagenes.length ; i++){
        const j = Math.floor(Math.random() * (i+1));
        [imagenes[i],imagenes[j]] = [imagenes[j],imagenes[i]];
    }
    let i = Math.floor(Math.random() * (16));
    [imagenes[0],imagenes[i]] = [imagenes[i],imagenes[0]]

}
    

const crearCasillas = () => {
    tablero.innerHTML = "";
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
                }, 500)   
            }
            intentos++;
            actualizarScore();

        }

        //revision de terminacion
        if (termino()){
            setTimeout(() => {
                gano = true;
                calculoPuntos()
                if(ls.getItem(jugador.nombre)){
                    if(ls.getItem(jugador.nombre) < jugador.puntuacion){
                        ls.setItem(jugador.nombre , jugador.puntuacion)
                    }
                }else{
                    ls.setItem(jugador.nombre , jugador.puntuacion)
                }
                Swal.fire({
                    title: "GANASTE!",
                    text: `Hiciste ${jugador.puntuacion} puntos`,
                    icon: "success",
                    showConfirmButton: true,
                });
                
                reiniciarJuego();
                actualizarRecord();
            
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
    time = 45;
    let intervalo = setInterval(() => {

        if(reinicio || gano){
            reinicio=false
            time = 46;
            clearInterval(intervalo);
        }
        if(time == 0){
            time = 46;
            clearInterval(intervalo);
            Swal.fire({
                title: "PERDISTE :(",
                text: `Se te acabo el tiempo`,
                icon: "error",
                showConfirmButton: true,
            });
            reiniciarJuego()
        }
        --time;
        TIEMPO.innerHTML = `Tiempo restante: ${time} segundos`
    },1000)
}

const calculoPuntos = () => {
    jugador.puntuacion = Math.floor((puntuacion * time)/intentos)
}

const visible = (algo) => {
    algo.classList.remove("hidden-registro");
}
const invisible = (algo) =>{
    algo.classList.add("hidden-registro")
}

const inicioRegistro = () => {

    
    visible(REGISTRO);
    invisible(ERROR);
    BOTON_REGISTRO.addEventListener("click", (event) => {
        event.preventDefault();
        let permitido = true
        if(INPUT_NOMBRE.value == "" || INPUT_NOMBRE.value == null ){
            ERROR.innerHTML = "Debe ingresar un nombre"
            visible(ERROR)
        }else{
                jugador.nombre = INPUT_NOMBRE.value
                invisible(REGISTRO);
        }
    })
}

const actualizarRecord = () => {
    let puntosMax = 0
    let index
    let keyMax
    for (let i = 0 ; i < ls.length ; i++){
        let key = ls.key(i);
        if (Number(ls.getItem(key)) > puntosMax){
            puntosMax = ls.getItem(key);
            index = i;
            keyMax = key;
        }
    }
    
    RECORD_NOMBRE.innerHTML = `Nombre: ${ls.key(index)}`
    RECORD_PUNTOS.innerHTML = `Puntos: ${ls.getItem(keyMax)}`
}

const bloquearBoton = (boton) => {
    boton.disabled = true;
}

const desbloquearBoton = (boton) => {
    boton.disabled = false
}
