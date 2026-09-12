var poisk = [];
var elements_sites = [];
var elements_p = [];
var elements_op = [];
var elements_img = [];
var elements_prosm = [];

// Элементы DOM
var sell = document.getElementById("sell");
var input = document.getElementById("pole");
var logo = document.getElementById('logo');
var form = document.getElementById('my-form'); // Убедитесь, что у формы id="my-form"

function ect9by(tolerance = 0.05) {
    const targetRatio = 9 / 16; // 0.5625
    const currentRatio = window.innerWidth / window.innerHeight;
    
    return Math.abs(currentRatio - targetRatio) <= tolerance;
}

function search(query) {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket("wss://46.150.175.171:18765");

        socket.onopen = function () {
            console.log("Отправляю:", query);
            socket.send(query);
        };

        socket.onmessage = function (event) {
            console.log("Получено:", event.data);
            try {
                const result = JSON.parse(event.data);
                resolve(result);
            } catch (error) {
                reject(error);
            }
            socket.close();
        };

        socket.onerror = function (error) {
            console.log("Ошибка WebSocket:", error);
            reject(error);
        };
    });
}

// Именованная асинхронная функция поиска
async function handleSearch(event) {
    if (event) event.preventDefault(); // Запрещаем перезагрузку страницы при вызове из submit

    input.disabled = true; // Блокируем ввод на время загрузки

    input.style.right = "-2vw";
    input.style.bottom = "-3vh";
    input.style.width = "30vw";
    if (ect9by()) {
        input.style.height = "5vh";
    } else {
        input.style.height = "2.5vh";
    }
    input.style.marginRight = "40vw";
    input.style.paddingRight = "7vw";
    logo.style.right = "-2vw";
    logo.style.bottom = "-2vh";
    logo.style.width = "10vw";
    sell.style.right = "-38vw";
    sell.style.bottom = "-4vh";

    var query = input.value;
    console.log("Запрос пользователя:", query);

    try {
        poisk = await search(query);

        for (let i = 0; i < 200; i++) {
            let a = document.createElement("a");
            a.className = "sites";
            a.onclick = function(e) {
                e.preventDefault();
                sendLink(this);
            };
            document.body.appendChild(a);
            elements_sites.push(a);

            let p = document.createElement("p");
            p.className = "silka";
            document.body.appendChild(p);
            elements_p.push(p);

            let opis = document.createElement("p");
            opis.className = "opis";
            document.body.appendChild(opis);
            elements_op.push(opis);

            let img = document.createElement("img");
            img.className = "images_eye";
            document.body.appendChild(img);
            elements_img.push(img);

            let prosm = document.createElement("p");
            prosm.className = "prosm";
            document.body.appendChild(prosm);
            elements_prosm.push(prosm);
        }

        var len = poisk.length;
        if (len > 200) len = 200;

        for (var n = 0; n < len; n++) {
            if (poisk[n][0].length > 60) {
                elements_sites[n].innerHTML = poisk[n][0].slice(0, 60) + "..." + "<span class='pros'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;👁️&nbsp;" + poisk[n][3] + "</span><br>";
            } else {
                elements_sites[n].innerHTML = poisk[n][0] + "<span class='pros'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;👁️&nbsp;" + poisk[n][3] + "</span><br>";
            }
            elements_sites[n].href = poisk[n][2];
            elements_sites[n].style.fontFamily = "Arial";
            elements_sites[n].style.fontSize = "1.2vw";
            elements_sites[n].style.color = "#5b94f0";

            if (n === 0) {
                elements_sites[n].style.position = "relative";
                elements_sites[n].style.bottom = "-7vh";
                elements_p[n].style.position = "relative";
                elements_p[n].style.bottom = "-7vh";
                elements_op[n].style.position = "relative";
                elements_op[n].style.bottom = "-7vh";
            }
            elements_sites[n].style.marginLeft = "5vw";

            if (poisk[n][2].length > 100) {
                elements_p[n].innerHTML = poisk[n][2].slice(0, 100) + "..." + "<br>";
            } else {
                elements_p[n].innerHTML = poisk[n][2] + "<br>";
            }
            elements_p[n].style.fontFamily = "Arial";
            elements_p[n].style.fontSize = "0.6vw";
            elements_p[n].style.color = "#25422d";
            elements_p[n].style.marginLeft = "5vw";

            if (poisk[n][1].length > 120) {
                elements_op[n].innerHTML = poisk[n][1].slice(0, 120) + "..." + "<br>";
            } else {
                elements_op[n].innerHTML = poisk[n][1] + "<br>";
            }
            elements_op[n].style.fontFamily = "Arial";
            elements_op[n].style.fontSize = "0.9vw";
            elements_op[n].style.color = "grey";
            elements_op[n].style.marginLeft = "5vw";

            if (n === 0) {
                elements_op[n].style.marginBottom = "7vw";
            } else {
                elements_op[n].style.marginBottom = "4vw";
            }
        }
    } catch (error) {
        console.log("Ошибка поиска:", error);
    } finally {
        input.disabled = false; // Разблокируем поле обратно
    }
}

function sendLink(a) {
    const href = a.href;
    console.log("НАЖАТА ССЫЛКА:", href);
    console.log("Подключаюсь к порту 12874...");

    const socket = new WebSocket("wss://46.150.175.171:12874");

    socket.onopen = function () {
        console.log("ПОДКЛЮЧЕНИЕ К 12874 УСПЕШНО");
        console.log("Отправляю посещение:", href);
        socket.send(href);
    };

    socket.onmessage = function (event) {
        console.log("Ответ Python:", event.data);
        socket.close();
        window.location.href = href;
    };

    socket.onerror = function (error) {
        console.log("ОШИБКА ПОРТА 2874:", error);
        socket.close();
        window.location.href = href;
    };

    socket.onclose = function () {
        console.log("WebSocket 2874 закрыт");
    };
}

// Связываем функцию с кликом по кнопке и отправкой формы
sell.onclick = handleSearch;
if (form) {
    form.onsubmit = handleSearch;
}
