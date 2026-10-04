var poisk = [];
var elements_sites = [];
var elements_p = [];
var elements_op = [];
var elements_img = [];
var elements_prosm = [];

const SERVER_URL = "https://qlykai-files.onrender.com";

function ect9by(tolerance = 0.05) {
    const targetRatio = 9 / 16;
    const currentRatio = window.innerWidth / window.innerHeight;

    return Math.abs(currentRatio - targetRatio) <= tolerance;
}


// ==========================================
// ПОИСК
// ==========================================

async function search(query) {

    console.log("Отправляю запрос на Render:", query);

    const response = await fetch(
        SERVER_URL + "/search",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query
            })
        }
    );

    if (!response.ok) {
        throw new Error(
            "Ошибка сервера: HTTP " + response.status
        );
    }

    const result = await response.json();

    console.log("Получено от Render:", result);

    return result;
}


var sell = document.getElementById("sell");
var input = document.getElementById("pole");
var logo = document.getElementById("logo");
var form = document.getElementById("my-form");


// ==========================================
// ОБРАБОТКА ПОИСКА
// ==========================================

async function handleSearch(event) {

    if (event) event.preventDefault();

    input.style.right = "-2vw";
    input.style.bottom = "-3vh";
    input.style.width = "30vw";

    if (ect9by()) {
        input.style.height = "2.5vh";
    } else {
        input.style.height = "5vh";
        logo.style.height = "6vh";
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

        console.log("Количество результатов:", poisk.length);


        // ==========================================
        // СОЗДАЁМ ЭЛЕМЕНТЫ
        // ==========================================

        for (let i = 0; i < 200; i++) {

            let a = document.createElement("a");

            a.className = "sites";

            a.onclick = function(event) {
                event.preventDefault();
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


        // ==========================================
        // ВЫВОДИМ РЕЗУЛЬТАТЫ
        //
        // Сервер возвращает:
        // [title, description, url, visits]
        // ==========================================

        var len = poisk.length;

        if (len > 200)
            len = 200;


        for (var n = 0; n < len; n++) {

            var title = poisk[n][0];
            var description = poisk[n][1];
            var url = poisk[n][2];
            var visits = poisk[n][3];


            // ======================================
            // ЗАГОЛОВОК
            // ======================================

            if (title.length > 60) {

                elements_sites[n].innerHTML =
                    title.slice(0, 60) +
                    "..." +
                    "<span class='pros'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;👁️&nbsp;" +
                    visits +
                    "</span>" +
                    "<br>";

            } else {

                elements_sites[n].innerHTML =
                    title +
                    "<span class='pros'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;👁️&nbsp;" +
                    visits +
                    "</span>" +
                    "<br>";
            }


            elements_sites[n].href = url;

            elements_sites[n].style.fontFamily = "Arial";
            elements_sites[n].style.fontSize = "1.2vw";
            elements_sites[n].style.color = "#5b94f0";


            if (n == 0) {

                elements_sites[n].style.position = "relative";
                elements_sites[n].style.bottom = "-7vh";

                elements_p[n].style.position = "relative";
                elements_p[n].style.bottom = "-7vh";

                elements_op[n].style.position = "relative";
                elements_op[n].style.bottom = "-7vh";
            }


            elements_sites[n].style.marginLeft = "5vw";


            // ======================================
            // URL
            // ======================================

            if (url.length > 100) {

                elements_p[n].innerHTML =
                    url.slice(0, 100) +
                    "..." +
                    "<br>";

            } else {

                elements_p[n].innerHTML =
                    url +
                    "<br>";
            }


            elements_p[n].style.fontFamily = "Arial";
            elements_p[n].style.fontSize = "0.6vw";
            elements_p[n].style.color = "#25422d";

            elements_p[n].style.marginLeft = "5vw";


            // ======================================
            // ОПИСАНИЕ
            // ======================================

            if (description.length > 120) {

                elements_op[n].innerHTML =
                    description.slice(0, 120) +
                    "..." +
                    "<br>";

            } else {

                elements_op[n].innerHTML =
                    description +
                    "<br>";
            }


            elements_op[n].style.fontFamily = "Arial";
            elements_op[n].style.fontSize = "0.9vw";
            elements_op[n].style.color = "grey";

            elements_op[n].style.marginLeft = "5vw";


            if (n == 0) {

                elements_op[n].style.marginBottom = "7vw";

            } else {

                elements_op[n].style.marginBottom = "4vw";
            }
        }

    }
    catch (error) {

        console.log("Ошибка поиска:", error);

    }
}


// ==========================================
// КНОПКА / ФОРМА
// ==========================================

sell.onclick = handleSearch;

if (form) {
    form.onsubmit = handleSearch;
}


// ==========================================
// ОТПРАВКА ПОСЕЩЕНИЯ
// ==========================================

async function sendLink(a) {

    const href = a.href;

    console.log("НАЖАТА ССЫЛКА:", href);
    console.log("Отправляю посещение на Render...");


    try {

        const response = await fetch(
            SERVER_URL + "/visit",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: href
                })
            }
        );


        const result = await response.json();

        console.log(
            "Ответ Render:",
            result
        );

    }
    catch (error) {

        console.log(
            "Ошибка отправки посещения:",
            error
        );

    }


    // В любом случае открываем сайт
    window.location.href = href;
}
