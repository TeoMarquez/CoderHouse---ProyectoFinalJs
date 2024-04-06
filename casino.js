const numerosRojos = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const numerosNegros = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

let indice = null;  

const storedCuentas = localStorage.getItem('cuentas');
const storedContrasenas = localStorage.getItem('contrasenas');

const cuentas = storedCuentas ? JSON.parse(storedCuentas) : [];
const contraseñas = storedContrasenas ? JSON.parse(storedContrasenas) : [];
const saldos = localStorage.getItem('saldos') ? JSON.parse(localStorage.getItem('saldos')) : [];


function crearCuenta(usuario, contraseñaInicial, saldoInicial) {
    
    cuentas.push(usuario);
    contraseñas.push(contraseñaInicial);
    saldos.push(saldoInicial);

    // Almacenar cuentas y contraseñas en localStorage
    localStorage.setItem('cuentas', JSON.stringify(cuentas));
    localStorage.setItem('contrasenas', JSON.stringify(contraseñas));
    localStorage.setItem('saldos', JSON.stringify(saldos));

    console.log(`Cuenta creada para "${usuario}" con saldo inicial de $${saldoInicial}`);
}

function cerrarCuenta() {
    // Verificar si hay una cuenta iniciada
    if (indice !== null && indice >= 0 && indice < cuentas.length) {
        console.log(`Cerrando cuenta para "${cuentas[indice]}". Hasta luego.`);
        // Restablecer valore
        indice = null;

        // Almacenar cuentas y contraseñas en sessionStorage después de cerrar la cuenta
        localStorage.setItem('cuentas', JSON.stringify(cuentas));
        localStorage.setItem('contrasenas', JSON.stringify(contraseñas));
    }
}

function iniciarSesion(usuario, contraseña) {
    indice = cuentas.indexOf(usuario);

    if (indice !== -1 && contraseñas[indice] === contraseña) {
        console.log(`¡Bienvenido, ${usuario}! Saldo actual: $${saldos[indice]}`);
        return true;  // Retorna true si el inicio de sesión fue exitoso
    } else {
        console.log("Inicio de sesión fallido. Verifica tu usuario y contraseña.");
        return false;  // Retorna false si el inicio de sesión falló
    }
}

function cambiarDeCuenta() {
    console.log("Cambiando de cuenta...");
    indice = null;  // Restablecer el índice al cambiar de cuenta
    return true;  // Retorna true para reiniciar el proceso de inicio de sesión
}

function actualizarSaldo(nuevoSaldo) {
    // Actualizar el saldo en el vector y en localStorage
    saldos[indice] = nuevoSaldo;
    localStorage.setItem('saldos', JSON.stringify(saldos));

    // Actualizar la interfaz de la cuenta
    actualizarInterfazCuenta();
}

function jugarBlackjack(apuesta, indice, saldos) {

    const btnHit = document.getElementById("btn-hit");
    const btnAllIn = document.getElementById("btn-all-in");
    const btnWithdraw = document.getElementById("btn-withdraw");

    const btnBackBlackjack = document.getElementById("btn-back-blackjack");

    const usuarioActual = cuentas[indice]; // Usar el índice del usuario que inició sesión
    let saldoActual = saldos[indice];

    if (apuesta === null || isNaN(apuesta) || apuesta <= 0 || apuesta > saldoActual) {
        console.log("Apuesta no válida. Debe ser un número mayor a 0 y menor o igual al saldo actual.");
        return;
    }

    // Repartir dos cartas al jugador y al crupier
    const manoJugador = [repartirCarta(), repartirCarta()];
    const imgElementJugador1 = document.getElementById('your-card-1');
    imgElementJugador1.src = `./imagenes/${manoJugador[0]}.jpg`;

    const imgElementJugador2 = document.getElementById('your-card-2');
    imgElementJugador2.src = `./imagenes/${manoJugador[1]}.jpg`;

    const manoCrupier = [repartirCarta(), repartirCarta()];
    const imgElementCrupier1 = document.getElementById('dealer-card-1');
    imgElementCrupier1.src = `./imagenes/${manoCrupier[0]}.jpg`;

    const imgElementCrupier2 = document.getElementById('dealer-card-2');
    imgElementCrupier2.src = `./imagenes/${manoCrupier[1]}.jpg`;

    console.log(manoJugador);
    console.log(manoCrupier);

    // Verificar si el jugador tiene un Blackjack (carta visible del crupier es un as o 10)
    if (calcularPuntos(manoJugador) === 21) {
        alert("¡Blackjack! ¡Felicidades, has ganado!");
        saldoActual += apuesta * 1.5;  // Se paga 1.5:1 en caso de Blackjack
        console.log(`Nuevo saldo: $${saldoActual}`);
        actualizarSaldo(saldoActual);  // Llamar a la función para actualizar saldo
        btnBackBlackjack.disabled = false; // Habilita el botón al mostrar los resultados del blackjack
        return;
    }

    // Funciones para acciones del jugador
    function pedirOtraCarta() {
        if (calcularPuntos(manoJugador) <= 21) {
            const nuevaCarta = repartirCarta();
            manoJugador.push(nuevaCarta);

            // Desvanecer la carta actual del jugador
            const proximaCartaIndex = manoJugador.length;
            const cartaActual = document.getElementById(`your-card-${proximaCartaIndex}`);
            cartaActual.style.transition = "opacity 0.5s";
            // Mostrar la nueva carta después de desvanecer la anterior
            setTimeout(() => {
                const nuevaCartaImg = document.getElementById(`your-card-${proximaCartaIndex}`);
                nuevaCartaImg.src = `./imagenes/${nuevaCarta}.jpg`;
                cartaActual.style.opacity = "1";
            }, 1000); // Espera 500 milisegundos antes de mostrar la nueva carta
            console.log(`Tu mano: ${manoJugador.join(', ')}`);

            if (manoJugador.length === 4) {
                // Si ya tienes las 4 cartas, ejecutar quedarse automáticamente
                quedarse();
                return;
            }
            // Verificar si el jugador supera los 21 puntos (se pasa)
            else if (calcularPuntos(manoJugador) > 21) {
                alert("Te has pasado de 21 puntos. ¡Perdiste!");
                saldoActual -= apuesta;
                console.log(`Nuevo saldo: $${saldoActual}`);
                actualizarSaldo(saldoActual);
                btnWithdraw.disabled = true;
                btnHit.disabled = true;
                btnAllIn.disabled = true;
                btnBackBlackjack.disabled = false; // Habilita el botón al mostrar los resultados del blackjack
            }
          
        }
    }

    function hacerAllIn() {
        
        btnWithdraw.disabled = true;
        btnHit.disabled = true;
        btnAllIn.disabled = true;
        try {
            while (calcularPuntos(manoJugador) < 21) {
                manoJugador.push(pedirOtraCarta());
                console.log(`Tu mano: ${manoJugador.join(', ')}`);
            }
    
            while (calcularPuntos(manoCrupier) < 17) {
                manoCrupier.push(repartirCarta());
                console.log(`Mano del Crupier: ${manoCrupier.join(', ')}`);
               
                const imgElementsCrupier = document.querySelectorAll('[id^="dealer-card-"]');
                for (let i = 0; i < manoCrupier.length; i++) {
                    imgElementsCrupier[i].src = `./imagenes/${manoCrupier[i]}.jpg`;
                }
            }
    
            const puntosJugador = calcularPuntos(manoJugador);
            const puntosCrupier = calcularPuntos(manoCrupier);
    
            if (puntosJugador > 21) {
                throw new Error('El jugador se ha pasado de 21 puntos.');
            }
    
            if (puntosCrupier > 21 || puntosJugador > puntosCrupier) {
                // El jugador gana si el crupier se pasa de 21 puntos o si el jugador tiene más puntos que el crupier
                alert("¡Ganaste!");
                saldoActual += apuesta * 1.5;
            } else if (puntosJugador === puntosCrupier) {
                // Empate
                alert("Es un empate.");
            } else {
                // El crupier gana
                alert("El crupier gana.");
                saldoActual -= apuesta;
            }
        } catch (error) {
            alert(error.message);
            saldoActual -= apuesta;
        }
    }

    function quedarse() {
        try {
            while (calcularPuntos(manoCrupier) < 17) {
                manoCrupier.push(repartirCarta());
                console.log(`Mano del Crupier: ${manoCrupier.join(', ')}`);
                const imgElementsCrupier = document.querySelectorAll('[id^="dealer-card-"]');
                for (let i = 0; i < manoCrupier.length; i++) {
                    imgElementsCrupier[i].src = `./imagenes/${manoCrupier[i]}.jpg`;
                }
            }
    
            const puntosJugador = calcularPuntos(manoJugador);
            const puntosCrupier = calcularPuntos(manoCrupier);
    
            if (puntosJugador > 21) {
                throw new Error('El jugador se ha pasado de 21 puntos.');
            }
    
            if (puntosCrupier > 21 || puntosJugador > puntosCrupier) {
                // El jugador gana si el crupier se pasa de 21 puntos o si el jugador tiene más puntos que el crupier
                alert("¡Ganaste!");
                saldoActual += apuesta * 1.5;
            } else if (puntosJugador === puntosCrupier) {
                // Empate
                alert("Es un empate.");
            } else {
                // El crupier gana
                alert("El crupier gana.");
                saldoActual -= apuesta;
            }
        } catch (error) {
            alert(error.message);
            saldoActual -= apuesta;
        } finally {
            const imgElementsCrupier = document.querySelectorAll('[id^="dealer-card-"]');
            for (let i = 0; i < manoCrupier.length; i++) {
                imgElementsCrupier[i].src = `./imagenes/${manoCrupier[i]}.jpg`;
            }    
            btnWithdraw.disabled = true;
            btnHit.disabled = true;
            btnAllIn.disabled = true;
            btnBackBlackjack.disabled = false; // Habilita el botón al mostrar los resultados del blackjack
        }
    }

    // Agregar eventos a los botones

    btnHit.onclick = pedirOtraCarta;
    btnAllIn.onclick = hacerAllIn;
    btnWithdraw.onclick = quedarse;
}

function repartirCarta() {
    const cartas = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const cartaAleatoria = cartas[Math.floor(Math.random() * cartas.length)];
    return cartaAleatoria;
}

function calcularPuntos(mano) {
    // Calcular la puntuación de la mano
    let puntos = 0;
    let ases = 0;

    for (const carta of mano) {
        if (carta === "A") {
            ases += 1;
            puntos += 11;
        } else if (carta === "K" || carta === "Q" || carta === "J") {
            puntos += 10;
        } else {
            puntos += parseInt(carta);
        }
    }

    // Ajustar los ases si se pasa de 21 puntos
    while (puntos > 21 && ases > 0) {
        puntos -= 10;
        ases -= 1;
    }

    return puntos;
}

function realizarApuesta(opcion, apuesta) {
    const resultado = (Math.floor(Math.random() * 36) + 1).toString();
    let saldoActual = saldos[indice];
    apostar=apuesta;
    console.log(`Resultado de la Ruleta: ${resultado}`);

    let ganancia = 0;

    if (opcion === resultado) {
        ganancia = apuesta * 36; // Se paga 36:1 en caso de acertar el número exacto
        saldoActual += ganancia;
        alert("¡Felicidades! Has ganado");
    } else if (opcion === 'Rojo' && numerosRojos.includes(resultado)) {
        ganancia = apuesta * 2;
        saldoActual += ganancia;
        alert("¡Felicidades! Has ganado");
    } else if (opcion === 'Negro' && numerosNegros.includes(resultado)) {
        ganancia = apuesta * 2;
        saldoActual += ganancia;
        alert("¡Felicidades! Has ganado");
    }else{
        saldoActual-=apostar;
        alert("¡Perdiste!");
    }

    actualizarSaldo(saldoActual);

    return resultado;
}


function actualizarInterfazCuenta() {
    const btnAccount = document.getElementById("btn-account");
    const accountBalance = document.getElementById("account-balance");
    const btnChangeAccount = document.getElementById("btn-change-account");
    const btnCloseAccount = document.getElementById("btn-close-account");

    // Verificar si el usuario está sin cuenta
    if (indice !== null && indice >= 0 && indice < cuentas.length) {
        const usuarioActual = cuentas[indice];
        const saldoActual = saldos[indice];
        btnAccount.textContent = usuarioActual;
        accountBalance.textContent = `$${saldoActual}`;
        btnChangeAccount.textContent = "Cambiar Cuenta";
        btnCloseAccount.style.display = 'inline-block';
    } else {
        btnAccount.textContent = "Sin Cuenta";
        // Establecer un saldo predeterminado para evitar "$undefined"
        accountBalance.textContent = "$0";
        btnChangeAccount.textContent = "Iniciar Sesión";
        btnCloseAccount.style.display = 'none';
    }
}

function resetBlackjackGame() {
    
    const btnHit = document.getElementById("btn-hit");
    const btnAllIn = document.getElementById("btn-all-in");
    const btnWithdraw = document.getElementById("btn-withdraw");

    // Limpiar la interfaz de las cartas y el resultado
    const imgElementsJugador = document.querySelectorAll('[id^="your-card-"]');
    const imgElementsCrupier = document.querySelectorAll('[id^="dealer-card-"]');
    
    // Limpiar la fuente de las imágenes de jugador
    imgElementsJugador.forEach((imgElement, index) => {
        if (index < 2) {
            imgElement.src = '';
        }
        else imgElement.src = './imagenes/backCard.jpeg';
    });
    // Limpiar la fuente de las imágenes de crupier (solo si están vacías)
    imgElementsCrupier.forEach((imgElement, index)=> {
        if (index < 2) {
            imgElement.src = '';
        }
        else imgElement.src = './imagenes/backCard.jpeg';
    });

    btnHit.disabled = false;
    btnAllIn.disabled = false;
    btnWithdraw.disabled = false;

    // Ocultar el resultado del blackjack
    const blackjackResult = document.getElementById("blackjack-result");
    blackjackResult.style.display = 'none';

    // Restablecer el contador de mano del jugador
    manoJugador = [];

    // Restablecer el contador de mano del crupier
    manoCrupier = [];

}