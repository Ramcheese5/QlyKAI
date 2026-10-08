
var poisk = [];

var elements_sites = [];
var elements_p = [];
var elements_op = [];
var elements_img = [];
var elements_prosm = [];

const SERVER_URL = "https://qlykai-files.onrender.com";
function ect9by() {

    return window.innerHeight > window.innerWidth;

}
if(ect9by()) {
  sell.remove();
}

// ==========================================
// ПРОГРЕВ RENDER
// ==========================================

async function warmupServer() {

    console.log("Прогреваю Render...");

    try {

        const response = await fetch(
            SERVER_URL + "/health",
            {
                method: "GET",
                cache: "no-cache"
            }
        );

        if (response.ok) {

            console.log("Render готов:", response.status);

        } else {

            console.log(
                "Render ответил:",
                response.status
            );
        }

    }
    catch (error) {

        console.log(
            "Ошибка прогрева Render:",
            error
        );
    }
}


// Запускаем прогрев сразу после загрузки JS
warmupServer();





// ==========================================
// ПОИСК
// ==========================================

async function search(query) {

    console.log(
        "Отправляю запрос на Render:",
        query
    );


    const response = await fetch(
        SERVER_URL + "/search",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json; charset=utf-8"
            },

            body: JSON.stringify({
                query: query
            })
        }
    );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            "Ошибка сервера: HTTP " +
            response.status +
            " " +
            errorText
        );
    }


    const result =
        await response.json();


    console.log(
        "Получено от Render:",
        result
    );


    return result;
}


// ==========================================
// ЭЛЕМЕНТЫ СТРАНИЦЫ
// ==========================================

var sell = document.getElementById("sell");
var input = document.getElementById("pole");
var logo = document.getElementById("logo");
input.setAttribute("inputmode", "search");
input.setAttribute("enterkeyhint", "search");

input.addEventListener("keydown", function(event) {
    if (
        event.key === "Enter" ||
        event.key === "Go" ||
        event.key === "Search"
    ) {
        event.preventDefault();
        handleSearch(event);
    }
});
input.addEventListener("search", function(event) {
    event.preventDefault();
    handleSearch(event);
});


// ==========================================
// УДАЛЕНИЕ СТАРЫХ РЕЗУЛЬТАТОВ
// ==========================================

function clearResults() {

    for (let i = 0;
         i < elements_sites.length;
         i++) {

        elements_sites[i].remove();
    }


    for (let i = 0;
         i < elements_p.length;
         i++) {

        elements_p[i].remove();
    }


    for (let i = 0;
         i < elements_op.length;
         i++) {

        elements_op[i].remove();
    }


    for (let i = 0;
         i < elements_img.length;
         i++) {

        elements_img[i].remove();
    }


    for (let i = 0;
         i < elements_prosm.length;
         i++) {

        elements_prosm[i].remove();
    }


    elements_sites = [];
    elements_p = [];
    elements_op = [];
    elements_img = [];
    elements_prosm = [];
}


// ==========================================
// ОБРАБОТКА ПОИСКА
// ==========================================

async function handleSearch(event) {

    if (event) {
        event.preventDefault();
    }


    // ======================================
    // ИЗМЕНЕНИЕ ПОЛЯ ПОИСКА
    // ======================================
    if(ect9by()) {
      logo.remove();

      input.style.width = "70vw";
      input.style.marginRight = "20vw";
    } else {
      logo.style.height = "6vh";
      logo.style.right = "-2vw";
      logo.style.bottom = "-2vh";
      logo.style.width = "10vw";

      sell.style.right = "-38vw";
      sell.style.bottom = "-4vh";
      input.style.width = "30vw";
      input.style.marginRight = "40vw";
    }
    input.style.right = "-2vw";
    input.style.bottom = "-3vh";





    input.style.height = "5vh";







    input.style.paddingRight = "7vw";



    // ======================================
    // ЗАПРОС
    // ======================================

    var query =
        input.value.trim();


    console.log(
        "Запрос пользователя:",
        query
    );


    if (!query) {
        return;
    }


    clearResults();


    

    poisk = await search(query);
    

    var uniqueUrls = new Set();
    var uniqueTitlesDescriptions = new Set();

    poisk = poisk.filter(function(result) {

        var title = result[0] || "";
        var description = result[1] || "";
        var url = result[2] || "";

        // Проверяем полностью одинаковый URL
        if (uniqueUrls.has(url)) {
            return false;
        }

    // Проверяем полностью одинаковые название + описание
        var titleDescription =
            title + "|||" + description;

        if (uniqueTitlesDescriptions.has(titleDescription)) {
            return false;
        }

    // Запоминаем результат
        uniqueUrls.add(url);
        uniqueTitlesDescriptions.add(titleDescription);

        return true;
    });
    



        // ==================================
        // СОЗДАЁМ ЭЛЕМЕНТЫ
        // ==================================

        for (let i = 0; i < 200; i++) {

            // ------------------------------
            // ЗАГОЛОВОК
            // ------------------------------

            let a =
                document.createElement("a");

            a.className = "sites";


            a.onclick =
                function(event) {

                    event.preventDefault();

                    sendLink(this);
                };


            document.body.appendChild(a);

            elements_sites.push(a);


            // ------------------------------
            // URL
            // ------------------------------

            let p =
                document.createElement("p");

            p.className = "silka";

            document.body.appendChild(p);

            elements_p.push(p);


            // ------------------------------
            // ОПИСАНИЕ
            // ------------------------------

            let opis =
                document.createElement("p");

            opis.className = "opis";

            document.body.appendChild(opis);

            elements_op.push(opis);


            // ------------------------------
            // КАРТИНКА
            // ------------------------------

            let img =
                document.createElement("img");

            img.className =
                "images_eye";

            document.body.appendChild(img);

            elements_img.push(img);


            // ------------------------------
            // ПРОСМОТРЫ
            // ------------------------------

            let prosm =
                document.createElement("p");

            prosm.className = "prosm";

            document.body.appendChild(prosm);

            elements_prosm.push(prosm);
        }


        // ==================================
        // КОЛИЧЕСТВО РЕЗУЛЬТАТОВ
        // ==================================

        var len =
            poisk.length;


        if (len > 200) {
            len = 200;
        }


        // ==================================
        // ВЫВОД РЕЗУЛЬТАТОВ
        //
        // [title, description, url, visits]
        // ==================================

        for (var n = 0;
             n < len;
             n++) {


            var title =
                poisk[n][0] || "";


            var description =
                poisk[n][1] || "";


            var url =
                poisk[n][2] || "";


            var visits =
                poisk[n][3] || 0;


            // ==================================
            // ЗАГОЛОВОК
            // ==================================

            if (title.length > 60) {

                elements_sites[n].innerHTML =
                    title.slice(0, 60) +
                    "..." +
                    "<span class='pros'>" +
                    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                    "👁️&nbsp;" +
                    visits +
                    "</span>" +
                    "<br>";

            } else {

                elements_sites[n].innerHTML =
                    title +
                    "<span class='pros'>" +
                    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                    "👁️&nbsp;" +
                    visits +
                    "</span>" +
                    "<br>";
            }


            elements_sites[n].href =
                url;


            elements_sites[n].style.fontFamily =
                "Arial";
            if(ect9by()) {
              elements_sites[n].style.fontSize = "1.8vw";
            } else {
                elements_sites[n].style.fontSize = "1.2vw";

            }
            elements_sites[n].style.color =
                "#5b94f0";


            elements_sites[n].style.marginLeft =
                "5vw";


            // ==================================
            // ПЕРВЫЙ РЕЗУЛЬТАТ
            // ==================================

            if (n == 0) {

                elements_sites[n].style.position =
                    "relative";


                elements_sites[n].style.bottom = "-7vh";



                elements_p[n].style.position =
                    "relative";

                elements_p[n].style.bottom =
                    "-7vh";


                elements_op[n].style.position =
                    "relative";

                elements_op[n].style.bottom =
                    "-7vh";
            }


            // ==================================
            // URL
            // ==================================

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


            elements_p[n].style.fontFamily =
                "Arial";
            if(ect9by()) {
              elements_p[n].style.fontSize = "1vw";
            } else {
              elements_p[n].style.fontSize = "0.6vw";

            }

            elements_p[n].style.color =
                "#25422d";

            elements_p[n].style.marginLeft =
                "5vw";


            // ==================================
            // ОПИСАНИЕ
            // ==================================

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


            elements_op[n].style.fontFamily =
                "Arial";
            if(ect9by()) {
              elements_op[n].style.fontSize = "1.5vw";
            } else {
              elements_op[n].style.fontSize = "0.9vw";
            }

            elements_op[n].style.color =
                "grey";

            elements_op[n].style.marginLeft =
                "5vw";


            // ==================================
            // ОТСТУП
            // ==================================

            if (n == 0) {

                elements_op[n].style.marginBottom =
                    "7vw";

            } else {

                elements_op[n].style.marginBottom =
                    "4vw";
            }
        }

    }



// ==========================================
// КНОПКА
// ==========================================

sell.onclick =
    handleSearch;


// ==========================================
// ФОРМА
// ==========================================

if (form) {

    form.onsubmit =
        handleSearch;
}


// ==========================================
// ОТПРАВКА ПОСЕЩЕНИЯ
// ==========================================

async function sendLink(a) {

    const href =
        a.href;


    console.log(
        "НАЖАТА ССЫЛКА:",
        href
    );


    console.log(
        "Отправляю посещение на Render..."
    );


    try {

        const response =
            await fetch(
                SERVER_URL + "/visit",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        url: href
                    }),

                    keepalive: true
                }
            );


        const result =
            await response.json();


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


    // Открываем сайт
    window.location.href =
        href;
}
