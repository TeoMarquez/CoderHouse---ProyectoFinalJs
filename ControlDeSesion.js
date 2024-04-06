document.addEventListener("DOMContentLoaded", function() {
    const btnAccount = document.getElementById("btn-account");
    const btnChangeAccount = document.getElementById("btn-change-account");
    const btnCloseAccount = document.getElementById("btn-close-account");

    const btnCreateAccount = document.getElementById("btn-create-account");
    const createAccountForm = document.getElementById("create-account-form");
    const submitCreateAccountBtn = document.getElementById("submit-create-account");
    const passwordMismatch = document.getElementById("password-mismatch");

    const btnLogin = document.getElementById("btn-change-account");
    const createLogin = document.getElementById("login-form");
    const submitLoginAccountBtn = document.getElementById("submit-login");
    const passwordMismatchLogin = document.getElementById("password-mismatchlogin");

    // Verificar si la cuenta actual es "Sin Cuenta"
    if (btnAccount.textContent === "Sin Cuenta") {
        btnChangeAccount.textContent = "Iniciar Sesión";
        btnCloseAccount.style.display = 'none';
        btnCreateAccount.style.display = 'inline-block';
        btnCreateAccount.addEventListener("click", function() {
            createAccountForm.style.display = 'block';
            createLogin.style.display = 'none';  // Ocultar el formulario de inicio de sesión si está abierto
        });
        btnChangeAccount.addEventListener("click", function() {
            createLogin.style.display = 'block';
            createAccountForm.style.display = 'none';  // Ocultar el formulario de creación de cuenta si está abierto
        });
    }

    btnAccount.addEventListener("click", function() {
        toggleAccountOptions(document.getElementById("account-options"));
    });

    document.addEventListener("click", function(event) {
        if (event.target !== btnCreateAccount && event.target.closest('.account-form') !== createAccountForm && event.target !== btnLogin && event.target.closest('.account-form') !== createLogin) {
            createAccountForm.style.display = 'none';
            createLogin.style.display = 'none';
            // Reiniciar el mensaje de error al ocultar los formularios
            passwordMismatch.textContent = '';
            passwordMismatchLogin.textContent = '';
        }
    });

    submitCreateAccountBtn.addEventListener("click", function(event) {
        event.preventDefault();
    
        const name = document.getElementById("name").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();
    
        if (!name || !password || !confirmPassword) {
            passwordMismatch.textContent = "Por favor, completa todos los campos.";
            return;
        }
    
        if (password !== confirmPassword) {
            passwordMismatch.textContent = "Las contraseñas no coinciden.";
            document.getElementById("confirm-password").value = '';
            return;
        }
    
        // Llamar a la función de creación de cuenta del script casino.js
        crearCuenta(name, password, 500);
    
        // También puedes ocultar el formulario después de procesarlo
        createAccountForm.style.display = 'none';
        // Reiniciar el mensaje de error al ocultar el formulario
        passwordMismatch.textContent = '';
    
        // Actualizar el botón de cuenta y saldo en la interfaz
        actualizarInterfazCuenta();
    });
    
    btnCloseAccount.addEventListener("click", function() {
        // Llamar a la función de cerrar cuenta del script casino.js
        cerrarCuenta();
        
        // Actualizar el botón de cuenta y saldo en la interfaz
        actualizarInterfazCuenta();
    })

    submitLoginAccountBtn.addEventListener("click", function(event) {
        event.preventDefault();
    
        const usernameLogin = document.getElementById("login-username").value.trim();
        const passwordLogin = document.getElementById("login-password").value.trim();
    
        if (!usernameLogin || !passwordLogin) {
            passwordMismatchLogin.textContent = "Por favor, completa todos los campos.";
            return;
        }
    
        const inicioSesionExitoso = iniciarSesion(usernameLogin, passwordLogin);
    
        if (inicioSesionExitoso) {
            console.log("Inicio de sesión exitoso");
    
            // Actualizar el botón de cuenta y saldo en la interfaz
            actualizarInterfazCuenta();
        }
    
        createLogin.style.display = 'none';
        passwordMismatchLogin.textContent = '';
    });
    
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

    function toggleAccountOptions(accountOptions) {
        console.log("Toggle account options");
        accountOptions.style.display = (accountOptions.style.display === 'none' || accountOptions.style.display === '') ? 'flex' : 'none';
    }
});
