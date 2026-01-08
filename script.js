const convertButton = document.querySelector(".convert-button");
const currencySelect = document.querySelector(".currency-select");
const currencySelectFrom = document.querySelector(".currency-select-from");

// Variables para almacenar las tasas de cambio
let exchangeRates = {
    USD: 5.2,
    EUR: 6.2,
    GBP: 7.3,
    BTC: 503580.19
};

// Función para obtener tasas de cambio actualizadas
async function updateExchangeRates() {
    try {
        // Obtener tasas de monedas fiduciarias
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/BRL');
        const data = await response.json();
        
        if (data.rates) {
            // Invertir las tasas porque la API devuelve cuántas monedas extranjeras por 1 BRL
            exchangeRates.USD = 1 / data.rates.USD;
            exchangeRates.EUR = 1 / data.rates.EUR;
            exchangeRates.GBP = 1 / data.rates.GBP;
        }

        // Obtener precio de Bitcoin
        const bitcoinResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl');
        const bitcoinData = await bitcoinResponse.json();
        
        if (bitcoinData.bitcoin) {
            exchangeRates.BTC = bitcoinData.bitcoin.brl;
        }

        console.log('Tasas actualizadas:', exchangeRates);
    } catch (error) {
        console.log('Error al obtener tasas de cambio, usando valores por defecto');
    }
}

// Actualizar tasas cuando carga la página
updateExchangeRates();

// Actualizar tasas cada 5 minutos (300000 ms)
setInterval(updateExchangeRates, 300000);

function convertValues() {
    const inputCurrencyValue = document.querySelector(".input").value;
    const currencyValueToConverter = document.querySelector(".currency-value-to-converter");
    const currencyValue = document.querySelector(".currency-value");
    
    // Usar las tasas del objeto exchangeRates en lugar de constantes
    const dollarToday = exchangeRates.USD;
    const euroToday = exchangeRates.EUR;
    const bitcoinToday = exchangeRates.BTC;
    const libraEsterlinaToday = exchangeRates.GBP;
    const realToday = 1;

    // Determinar la moneda de origen y su formato
    let currencyFromLocale = "pt-BR";
    let currencyFromCode = "BRL";

    if (currencySelectFrom.value == 'USD') {
        currencyFromLocale = "en-US";
        currencyFromCode = "USD";
    }
    if (currencySelectFrom.value == 'EUR') {
        currencyFromLocale = "de-DE";
        currencyFromCode = "EUR";
    }
    if (currencySelectFrom.value == 'BTC') {
        currencyFromLocale = "en-US";
        currencyFromCode = "BTC";
    }
    if (currencySelectFrom.value == 'GBP') {
        currencyFromLocale = "en-GB";
        currencyFromCode = "GBP";
    }
    if (currencySelectFrom.value == 'BRL') {
        currencyFromLocale = "pt-BR";
        currencyFromCode = "BRL";
    }

    // Mostrar el valor de entrada en el formato correcto
    currencyValueToConverter.innerHTML = new Intl.NumberFormat(currencyFromLocale, {
        style: "currency",
        currency: currencyFromCode,
    }).format(inputCurrencyValue);

    // Convertir a BRL primero
    let valueInBRL = inputCurrencyValue;

    if (currencySelectFrom.value == 'USD') {
        valueInBRL = inputCurrencyValue * dollarToday;
    }
    if (currencySelectFrom.value == 'EUR') {
        valueInBRL = inputCurrencyValue * euroToday;
    }
    if (currencySelectFrom.value == 'BTC') {
        valueInBRL = inputCurrencyValue * bitcoinToday;
    }
    if (currencySelectFrom.value == 'GBP') {
        valueInBRL = inputCurrencyValue * libraEsterlinaToday;
    }

    if (currencySelect.value == 'dollar') {
        currencyValue.innerHTML = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(valueInBRL / dollarToday);
    }

    if (currencySelect.value == 'euro') {
        currencyValue.innerHTML = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
    }).format(valueInBRL / euroToday);
    }

    if (currencySelect.value == 'bitcoin') {
        const bitcoinValue = valueInBRL / bitcoinToday;
        // Mostrar Bitcoin con 8 decimales (satoshi precision)
        currencyValue.innerHTML = bitcoinValue.toFixed(8);
    }

    if (currencySelect.value == 'libraEsterlina') {
        currencyValue.innerHTML = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
    }).format(valueInBRL / libraEsterlinaToday);
    }

    if (currencySelect.value == 'real') {
        currencyValue.innerHTML = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valueInBRL);
    }



    
}

function changeCurrency() {
    const currencyName = document.getElementById('currency-name');
    const currencyImg = document.querySelector('.currency-img');

    currencyImg.classList.add('rotate');

    setTimeout(() => {
        if (currencySelect.value == 'dollar') {
            currencyName.innerHTML = "Dólar Americano";
            currencyImg.src = "./asset/US dollar.png";
        }
        if (currencySelect.value == 'euro') {
            currencyName.innerHTML = "Euro";
            currencyImg.src = "./asset/Euro.png";
        }

        if (currencySelect.value == 'bitcoin') {
            currencyName.innerHTML = "Bitcoin";
            currencyImg.src = "./asset/bitcoin.png";
        }
        if (currencySelect.value == 'libraEsterlina') {
            currencyName.innerHTML = "Libra Esterlina";
            currencyImg.src = "./asset/Libra.png";
        }
        if (currencySelect.value == 'real') {
            currencyName.innerHTML = "Real Brasileiro";
            currencyImg.src = "./asset/Real.png";
        }

        currencyImg.classList.remove('rotate');
    }, 200);

    convertValues()
}

function changeCurrencyFrom() {
    const currencyNameFrom = document.querySelector('.from .currency');
    const currencyFlagFrom = document.querySelector('.flag');

    currencyFlagFrom.classList.add('rotate');

    setTimeout(() => {
        if (currencySelectFrom.value == 'BRL') {
            currencyNameFrom.innerHTML = "Valor em Real:";
            currencyFlagFrom.src = "./asset/Real.png";
        }
        if (currencySelectFrom.value == 'USD') {
            currencyNameFrom.innerHTML = "Valor em Dólar:";
            currencyFlagFrom.src = "./asset/US dollar.png";
        }
        if (currencySelectFrom.value == 'EUR') {
            currencyNameFrom.innerHTML = "Valor em Euro:";
            currencyFlagFrom.src = "./asset/Euro.png";
        }
        if (currencySelectFrom.value == 'BTC') {
            currencyNameFrom.innerHTML = "Valor em Bitcoin:";
            currencyFlagFrom.src = "./asset/bitcoin.png";
        }
        if (currencySelectFrom.value == 'GBP') {
            currencyNameFrom.innerHTML = "Valor em Libra:";
            currencyFlagFrom.src = "./asset/Libra.png";
        }

        currencyFlagFrom.classList.remove('rotate');
    }, 200);

    convertValues()
}

currencySelect.addEventListener("change", changeCurrency);
currencySelectFrom.addEventListener("change", changeCurrencyFrom);
convertButton.addEventListener("click", convertValues);



 