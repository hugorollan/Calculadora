// Variables globales para operaciones binarias
let operandoAnterior = null;
let operadorActual = null;
let esperandoOperando = false;

// Función para obtener el valor del display
const obtenerValor = () => {
    const display = document.getElementById('display');
    return display.value;
};

// Función para establecer el valor del display
const establecerValor = (valor) => {
    const display = document.getElementById('display');
    display.value = valor;
};

// Función para validar entrada
const validar = (entrada) => {
    // Validar si es un número válido
    if (!isNaN(entrada) && entrada.trim() !== '') {
        return { valido: true, tipo: 'numero', valor: parseFloat(entrada) };
    }
    
    // Validar si es una lista CSV
    if (entrada.includes(',')) {
        const valores = entrada.split(',').map(v => v.trim());
        const numerosValidos = valores.every(v => !isNaN(v) && v !== '');
        
        if (numerosValidos && valores.length > 0) {
            return { 
                valido: true, 
                tipo: 'csv', 
                valor: valores.map(v => parseFloat(v)) 
            };
        }
    }
    
    return { valido: false, tipo: 'error', valor: null };
};

// Función para actualizar el campo informativo
const rellenar_info = (resultado, operacion = '') => {
    const infoElement = document.getElementById('info');
    infoElement.className = 'grande'; // Reset classes
    
    if (typeof resultado === 'string' && resultado.toLowerCase().includes('error')) {
        infoElement.textContent = resultado;
        infoElement.classList.add('error');
        return;
    }
    
    if (operacion === 'csv') {
        infoElement.textContent = 'Lista de valores procesada';
        infoElement.classList.add('success');
        return;
    }
    
    if (typeof resultado === 'number') {
        let mensaje = '';
        
        if (operacion) {
            mensaje = `Operación: ${operacion}. `;
        } else {
            mensaje = 'Info: ';
        }
        
        if (resultado < 100) {
            mensaje += 'El resultado es menor que 100';
        } else if (resultado >= 100 && resultado <= 200) {
            mensaje += 'El resultado está entre 100 y 200';
        } else {
            mensaje += 'El resultado es superior a 200';
        }
        
        infoElement.textContent = mensaje;
        infoElement.classList.add('success');
    }
};

// ====== OPERACIONES UNITARIAS ======

// Función cuadrado (ya mencionada en los requisitos)
const cuadrado = () => {
    const entrada = obtenerValor();
    const validacion = validar(entrada);
    
    if (!validacion.valido || validacion.tipo !== 'numero') {
        establecerValor('Error: Entrada inválida');
        rellenar_info('Error: Debe ingresar un número válido');
        return;
    }
    
    const resultado = validacion.valor ** 2;
    establecerValor(resultado);
    rellenar_info(resultado, 'Cuadrado');
};

// Función módulo (valor absoluto)
const mod = () => {
    const entrada = obtenerValor();
    const validacion = validar(entrada);
    
    if (!validacion.valido || validacion.tipo !== 'numero') {
        establecerValor('Error: Entrada inválida');
        rellenar_info('Error: Debe ingresar un número válido');
        return;
    }
    
    const resultado = Math.abs(validacion.valor);
    establecerValor(resultado);
    rellenar_info(resultado, 'Módulo');
};

// Función factorial
const fact = () => {
    const entrada = obtenerValor();
    const validacion = validar(entrada);
    
    if (!validacion.valido || validacion.tipo !== 'numero') {
        establecerValor('Error: Entrada inválida');
        rellenar_info('Error: Debe ingresar un número válido');
        return;
    }
    
    const numero = validacion.valor;
    
    if (numero < 0 || !Number.isInteger(numero)) {
        establecerValor('Error: El factorial requiere un entero no negativo');
        rellenar_info('Error: El factorial requiere un entero no negativo');
        return;
    }
    
    if (numero > 170) {
        establecerValor('Error: Número demasiado grande para factorial');
        rellenar_info('Error: Número demasiado grande para factorial');
        return;
    }
    
    let resultado = 1;
    for (let i = 2; i <= numero; i++) {
        resultado *= i;
    }
    
    establecerValor(resultado);
    rellenar_info(resultado, 'Factorial');
};

// ====== OPERACIONES BINARIAS ======

// Función suma
const suma = () => {
    const entrada = obtenerValor();
    const validacion = validar(entrada);
    
    if (!validacion.valido || validacion.tipo !== 'numero') {
        establecerValor('Error: Entrada inválida');
        rellenar_info('Error: Debe ingresar un número válido');
        return;
    }
    
    operandoAnterior = validacion.valor;
    operadorActual = '+';
    establecerValor('');
    rellenar_info('Ingrese el segundo número y presione =');
};

// Función multiplicación
const multiplicacion = () => {
    const entrada = obtenerValor();
    const validacion = validar(entrada);
    
    if (!validacion.valido || validacion.tipo !== 'numero') {
        establecerValor('Error: Entrada inválida');
        rellenar_info('Error: Debe ingresar un número válido');
        return;
    }
    
    operandoAnterior = validacion.valor;
    operadorActual = '*';
    establecerValor('');
    rellenar_info('Ingrese el segundo número y presione =');
};

// Función igual
const eq = () => {
    if (operandoAnterior === null || operadorActual === null) {
        rellenar_info('Error: No hay operación pendiente');
        return;
    }
    
    const entrada = obtenerValor();
    const validacion = validar(entrada);
    
    if (!validacion.valido || validacion.tipo !== 'numero') {
        establecerValor('Error: Entrada inválida');
        rellenar_info('Error: Debe ingresar un número válido');
        return;
    }
    
    const operandoActual = validacion.valor;
    let resultado;
    let operacionNombre;
    
    switch (operadorActual) {
        case '+':
            resultado = operandoAnterior + operandoActual;
            operacionNombre = 'Suma';
            break;
        case '*':
            resultado = operandoAnterior * operandoActual;
            operacionNombre = 'Multiplicación';
            break;
        default:
            establecerValor('Error: Operador desconocido');
            rellenar_info('Error: Operador desconocido');
            return;
    }
    
    establecerValor(resultado);
    rellenar_info(resultado, operacionNombre);
    
    // Reset variables
    operandoAnterior = null;
    operadorActual = null;
};

// ====== OPERACIONES CSV ======

// Función sumatorio
const sumatorio = () => {
    const entrada = obtenerValor();
    const validacion = validar(entrada);
    
    if (!validacion.valido) {
        establecerValor('Error: Entrada inválida');
        rellenar_info('Error: Debe ingresar números separados por comas');
        return;
    }
    
    if (validacion.tipo === 'numero') {
        establecerValor(validacion.valor);
        rellenar_info(validacion.valor, 'Sumatorio');
        return;
    }
    
    if (validacion.tipo === 'csv') {
        const resultado = validacion.valor.reduce((suma, num) => suma + num, 0);
        establecerValor(resultado);
        rellenar_info(resultado, 'csv');
        return;
    }
};

// Función ordenar
const ordenar = () => {
    const entrada = obtenerValor();
    const validacion = validar(entrada);
    
    if (!validacion.valido) {
        establecerValor('Error: Entrada inválida');
        rellenar_info('Error: Debe ingresar números separados por comas');
        return;
    }
    
    if (validacion.tipo === 'numero') {
        establecerValor(validacion.valor);
        rellenar_info(validacion.valor, 'csv');
        return;
    }
    
    if (validacion.tipo === 'csv') {
        const resultado = [...validacion.valor].sort((a, b) => a - b);
        establecerValor(resultado.join(', '));
        rellenar_info('Lista ordenada', 'csv');
        return;
    }
};

// Función revertir
const revertir = () => {
    const entrada = obtenerValor();
    const validacion = validar(entrada);
    
    if (!validacion.valido) {
        establecerValor('Error: Entrada inválida');
        rellenar_info('Error: Debe ingresar números separados por comas');
        return;
    }
    
    if (validacion.tipo === 'numero') {
        establecerValor(validacion.valor);
        rellenar_info(validacion.valor, 'csv');
        return;
    }
    
    if (validacion.tipo === 'csv') {
        const resultado = [...validacion.valor].reverse();
        establecerValor(resultado.join(', '));
        rellenar_info('Lista revertida', 'csv');
        return;
    }
};

// Función quitar (elimina el último elemento)
const quitar = () => {
    const entrada = obtenerValor();
    const validacion = validar(entrada);
    
    if (!validacion.valido) {
        establecerValor('Error: Entrada inválida');
        rellenar_info('Error: Debe ingresar números separados por comas');
        return;
    }
    
    if (validacion.tipo === 'numero') {
        establecerValor('');
        rellenar_info('Elemento eliminado', 'csv');
        return;
    }
    
    if (validacion.tipo === 'csv') {
        if (validacion.valor.length <= 1) {
            establecerValor('');
            rellenar_info('Lista vacía', 'csv');
            return;
        }
        
        const resultado = validacion.valor.slice(0, -1);
        establecerValor(resultado.join(', '));
        rellenar_info('Último elemento eliminado', 'csv');
        return;
    }
};

// ====== UTILIDADES ======

// Función borrar
const borrar = () => {
    establecerValor('');
    document.getElementById('info').textContent = 'Info sobre el número';
    document.getElementById('info').className = 'grande';
    operandoAnterior = null;
    operadorActual = null;
};

// ====== EVENTOS DE TECLADO ======

// Agregar soporte de teclado
document.addEventListener('keydown', (event) => {
    const display = document.getElementById('display');
    
    // Solo procesar si el display está enfocado o si no hay otro elemento enfocado
    if (document.activeElement === display || document.activeElement === document.body) {
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                if (operadorActual) {
                    eq();
                }
                break;
            case 'Escape':
                event.preventDefault();
                borrar();
                break;
            case '+':
                if (operandoAnterior === null) {
                    event.preventDefault();
                    suma();
                }
                break;
            case '*':
                event.preventDefault();
                multiplicacion();
                break;
        }
    }
});

// Permitir que los números se puedan escribir directamente
document.getElementById('display').addEventListener('input', () => {
    // No hacer nada especial, permitir que el usuario escriba
});