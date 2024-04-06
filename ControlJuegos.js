document.addEventListener("DOMContentLoaded", function() {
    const gameOverlay = document.getElementById("game-overlay");
    const gameTitle = document.getElementById("game-title");
    const btnShowPrevious = document.getElementById("btn-show-previous");

    const betForm = document.getElementById("place-bet-form");
    const accountBalance = document.getElementById("account-balance");
    const betAmountInput = document.getElementById("bet-amount");

    const gameResults = document.getElementById("game-results");
    const gameRuleta = document.getElementById("roulette-bet-form");

    // Agrega un evento de clic a cada botón de juego
    const btnBlackjack = document.getElementById("btn-blackjack");
    const btnRuleta = document.getElementById("btn-ruleta");

    const btnBetRed = document.getElementById("btn-bet-red");
    const btnBetBlack = document.getElementById("btn-bet-black");

    const btnBackRoulette = document.getElementById("btn-back-roulette");
    btnBackRoulette.disabled = true; // Deshabilita el botón al principio
    
    const btnBackBlackjack = document.getElementById("btn-back-blackjack");
    btnBackBlackjack.disabled = true; // Deshabilita el botón al principio

    btnBlackjack.addEventListener("click", function() {
        showGameOverlay("Blackjack");
        showBetForm();
    });

    btnRuleta.addEventListener("click", function() {
        showGameOverlay("Ruleta");
        showBetForm();
    });

    btnShowPrevious.addEventListener("click", function() {
        hideGameOverlay();
        hideBetForm();
        hideGameResults(); // Oculta el nuevo div al regresar
    });

    btnBackRoulette.addEventListener("click", function() {
        hideRouletteForm();
        hideGameOverlay();
        hideBetForm();
        hideGameResults();
        resetRouletteGame(); // Restablecer el estado del juego de ruleta
    });

    btnBackBlackjack.addEventListener("click", function() {
        hideGameResults();
        hideGameOverlay();
        hideBetForm();
        hideGameResults();
        resetBlackjackGame(); // Restablecer el estado del juego de blackjack
    });

    // Función para ocultar el formulario de la ruleta
    function hideRouletteForm() {
        document.getElementById("roulette-bet-form").style.display = 'none';
    }

    // Función para ocultar los resultados del juego de blackjack
    function hideGameResults() {
        document.getElementById("game-results").style.display = 'none';
    }

    function showGameOverlay(title) {
        gameTitle.textContent = title;
        gameOverlay.style.display = 'flex';
    }

    function hideGameOverlay() {
        gameOverlay.style.display = 'none';
    }

    function showBetForm() {
        betAmountInput.max = parseInt(accountBalance.textContent.slice(1)); // Configura el valor máximo del input
        betForm.style.display = 'flex';
    }

    function hideBetForm() {
        betForm.style.display = 'none';
    }

    function showGameResults(gameType) {
        if (gameType === 'Ruleta') {
            gameRuleta.style.display = 'flex';
        } else {
            gameResults.style.display = 'flex';
        }
    }

    function hideGameResults() {
        gameResults.style.display = 'none';
    }

    // Agrega la lógica para el formulario de apuesta
    const placeBetForm = document.getElementById("place-bet-form");

    placeBetForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita que el formulario se envíe por defecto
    
        const betAmount = parseInt(betAmountInput.value);
        const maxBalance = parseInt(accountBalance.textContent.slice(1));
    
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > maxBalance) {
            alert("Por favor, ingresa una cantidad de apuesta válida.");
        } else {
            hideBetForm();
            showGameResults(gameTitle.textContent); // Pasa el tipo de juego a la función
    
            // Lógica para procesar la apuesta y mostrar el resultado del juego
            const indiceUsuario = indice; // Obtener el índice del usuario que ha iniciado sesión
            const saldoUsuario = saldos[indiceUsuario]; // Obtener el saldo del usuario
    
            // Verifica si la opción de juego es blackjack antes de llamar a la función
            if (gameTitle.textContent === 'Blackjack') {
                jugarBlackjack(betAmount, indiceUsuario, saldos);
            }
        }
    });


    const placeRouletteBetForm = document.getElementById("place-roulette-bet-form");

    placeRouletteBetForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita que el formulario se envíe por defecto
    
        const betNumber = parseInt(document.getElementById("bet-number").value);
    
        if (isNaN(betNumber) || betNumber < 0 || betNumber > 36) {
            alert("Por favor, ingresa un número válido entre 0 y 36.");
        } else {
            disableRouletteButtons();
            showRouletteResult(realizarApuesta(betNumber,betAmountInput.value)); 
            btnBackRoulette.disabled = false; // Habilita el botón al mostrar los resultados de la ruleta
        }
    });

    btnBetRed.addEventListener("click", function() {
        showRouletteResult(realizarApuesta("Rojo", betAmountInput.value)); 
        btnBackRoulette.disabled = false; // Habilita el botón al mostrar los resultados de la ruleta
        disableRouletteButtons();
    });

    btnBetBlack.addEventListener("click", function() {
        showRouletteResult(realizarApuesta("Negro", betAmountInput.value)); 
        btnBackRoulette.disabled = false; // Habilita el botón al mostrar los resultados de la ruleta
        disableRouletteButtons();
    });

    function disableRouletteButtons() {
        const betNumberInput = document.getElementById("bet-number");
        const summitNumberBet = document.getElementById("summit-bet-number");
    
        if (btnBetRed && btnBetBlack && betNumberInput && summitNumberBet) {
            btnBetRed.disabled = true;
            btnBetBlack.disabled = true;
            betNumberInput.disabled = true;
            summitNumberBet.disabled = true;
        }
    }
    function showRouletteResult(winNumber) {
        const rouletteResult = document.getElementById("roulette-result");
     
        setTimeout(() => {
            rouletteResult.textContent = `Número ganador: ${winNumber}`;
            rouletteResult.style.display = 'block';
        }, 700); // Cambia el tiempo en milisegundos según tus necesidades
    }
    
    function resetRouletteGame() {
        // Limpiar el formulario de apuesta de ruleta
        document.getElementById("place-roulette-bet-form").reset();
        // Restablecer la visibilidad de los botones de ruleta
        const btnBetRed = document.getElementById("btn-bet-red");
        const btnBetBlack = document.getElementById("btn-bet-black");
        const betNumberInput = document.getElementById("bet-number");
        const summitNumberBet = document.getElementById("summit-bet-number");
        const rouletteResult = document.getElementById("roulette-result");

        btnBetRed.disabled = false;
        btnBetBlack.disabled = false;
        betNumberInput.disabled = false;
        summitNumberBet.disabled = false;
        
        rouletteResult.textContent = ``;
        rouletteResult.style.display = 'none';
        btnBackRoulette.disabled = true;
    }
});



