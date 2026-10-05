
var poisk = [];
var elements_sites = [];
var elements_p = [];
var elements_op = [];
var elements_img = [];
var elements_prosm = [];

const SERVER_URL = "https://qlykai-files.onrender.com";


// ============================================================
// ОПРЕДЕЛЕНИЕ ФОРМАТА ЭКРАНА
// true  = ближе к 16:9
// false = ближе к 9:16
// ============================================================

function isLandscape() {
    const ratio = window.innerWidth / window.innerHeight;

    const ratio169 = 16 / 9;
    const ratio916 = 9 / 16;

    return Math.abs(ratio - ratio169) < Math.abs(ratio - ratio916);
}


// Старое название функции, если оно используется в HTML/CSS
function ect9by() {
    return !isLandscape();
}


// ============================================================
// ПРОГРЕВ СЕРВЕРА RENDER
// ============================================================

let serverReady = false;
let warmupPromise = null;


function warmupServer() {
    // Если сервер уже прогрет — второй раз ничего не делаем
    if (serverReady) {
        return Promise.resolve(true);
    }

    // Если прогрев уже выполняется — используем тот же запрос
    if (warmupPromise) {
        return warmupPromise;
    }

    warmupPromise = fetch(SERVER_URL + "/health", {
        method: "GET",
        cache: "no-store",
        headers: {
            "Cache-Control": "no-cache"
        }
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        serverReady = true;
        return true;
    })
    .catch(function(error) {
        console.log("Прогрев сервера:", error.message);

        // Не считаем это критической ошибкой.
        // Сам поиск всё равно сможет попробовать подключиться.
        return false;
    })
    .finally(function() {
        warmupPromise = null;
    });

    return warmupPromise;
}


// Запускаем прогрев сразу после загрузки страницы
window.addEventListener("load", function() {
    // Небольшая задержка, чтобы не мешать первоначальной загрузке страницы
    setTimeout(function() {
        warmupServer();
    }, 300);
});


// ============================================================
// ОЧИСТКА РЕЗУЛЬТАТОВ
// ============================================================

function clearResults() {
    for (let i = 0; i < elements_sites.length; i++) {
        if (elements_sites[i] && elements_sites[i].remove) {
            elements_sites[i].remove();
        }
    }

    for (let i = 0; i < elements_p.length; i++) {
        if (elements_p[i] && elements_p[i].remove) {
            elements_p[i].remove();
        }
    }

    for (let i = 0; i < elements_op.length; i++) {
        if (elements_op[i] && elements_op[i].remove) {
            elements_op[i].remove();
        }
    }

    for (let i = 0; i < elements_img.length; i++) {
        if (elements_img[i] && elements_img[i].remove) {
            elements_img[i].remove();
        }
    }

    for (let i = 0; i < elements_prosm.length; i++) {
        if (elements_prosm[i] && elements_prosm[i].remove) {
            elements_prosm[i].remove();
        }
    }

    elements_sites = [];
    elements_p = [];
    elements_op = [];
    elements_img = [];
    elements_prosm = [];
}


// ============================================================
// ПОИСК
// ============================================================

async function search(query) {

    query = String(query || "").trim();

    if (!query) {
        return;
    }

    /*
        ВАЖНО:

        Если Render спал, первый запрос к /search сам разбудит его.

        Поэтому здесь мы НЕ делаем:

            await warmupServer();

        перед каждым поиском.

        Иначе пользователь будет ждать:

            /health -> пробуждение -> /search

        вместо одного запроса.

        Если прогрев уже идёт, поиск всё равно может выполняться
        независимо от него.
    */


    try {

        const response = await fetch(SERVER_URL + "/search", {
            method: "POST",

            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "no-cache"
            },

            cache: "no-store",

            body: JSON.stringify({
                query: query
            })
        });


        if (!response.ok) {
            throw new Error(
                "Сервер вернул HTTP " + response.status
            );
        }


        const data = await response.json();

        clearResults();

        poisk = data;


        showResults(data);


        serverReady = true;


    } catch (error) {

        console.error("Ошибка поиска:", error);

        /*
            Если запрос не прошёл из-за того, что Render спал,
            пробуем прогреть его и повторить запрос один раз.
        */

        try {

            await warmupServer();


            const retryResponse = await fetch(
                SERVER_URL + "/search",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json; charset=utf-8",
                        "Cache-Control": "no-cache"
                    },

                    cache: "no-store",

                    body: JSON.stringify({
                        query: query
                    })
                }
            );


            if (!retryResponse.ok) {
                throw new Error(
                    "Повторный запрос: HTTP " +
                    retryResponse.status
                );
            }


            const retryData = await retryResponse.json();

            clearResults();

            poisk = retryData;

            showResults(retryData);

            serverReady = true;


        } catch (retryError) {

            console.error(
                "Повторный запрос тоже завершился ошибкой:",
                retryError
            );

            alert(
                "Не удалось выполнить поиск. " +
                "Попробуйте ещё раз."
            );
        }
    }
}


// ============================================================
// ВЫВОД РЕЗУЛЬТАТОВ
// ============================================================

function showResults(data) {

    /*
        Здесь используется существующая разметка QlyКАЙ.

        Если в твоём HTML есть контейнер результатов,
        он определяется автоматически.
    */

    let container =
        document.getElementById("results") ||
        document.getElementById("rezultaty") ||
        document.getElementById("result");

    if (!container) {
        console.error(
            "Не найден контейнер результатов."
        );
        return;
    }


    /*
        Максимум 200 результатов.
    */

    const maxResults = Math.min(
        data.length,
        200
    );


    for (let i = 0; i < maxResults; i++) {

        const item = data[i];

        if (!Array.isArray(item)) {
            continue;
        }


        const title =
            item[0] !== undefined
                ? String(item[0])
                : "";


        const description =
            item[1] !== undefined
                ? String(item[1])
                : "";


        const url =
            item[2] !== undefined
                ? String(item[2])
                : "";


        const visits =
            item[3] !== undefined
                ? item[3]
                : 0;


        // ----------------------------------------------------
        // Блок сайта
        // ----------------------------------------------------

        const site = document.createElement("div");

        site.className = "site";

        elements_sites.push(site);


        // ----------------------------------------------------
        // Ссылка / название
        // ----------------------------------------------------

        const link = document.createElement("a");

        link.href = url;

        link.target = "_blank";

        link.rel = "noopener noreferrer";

        link.textContent = title || url;

        link.className = "site_title";


        link.addEventListener(
            "click",
            function() {
                sendLink(url);
            }
        );


        elements_op.push(link);


        // ----------------------------------------------------
        // Описание
        // ----------------------------------------------------

        const p = document.createElement("p");

        p.textContent = description;

        p.className = "site_description";

        elements_p.push(p);


        // ----------------------------------------------------
        // URL
        // ----------------------------------------------------

        const urlElement =
            document.createElement("div");

        urlElement.textContent = url;

        urlElement.className = "site_url";

        elements_op.push(urlElement);


        // ----------------------------------------------------
        // Просмотры
        // ----------------------------------------------------

        const views =
            document.createElement("div");

        views.textContent =
            "Посещений: " + visits;

        views.className = "site_views";

        elements_prosm.push(views);


        // ----------------------------------------------------
        // Сборка
        // ----------------------------------------------------

        site.appendChild(link);

        site.appendChild(urlElement);

        site.appendChild(p);

        site.appendChild(views);

        container.appendChild(site);
    }
}


// ============================================================
// ОТСЛЕЖИВАНИЕ ПЕРЕХОДОВ
// ============================================================

async function sendLink(url) {

    if (!url) {
        return;
    }


    try {

        await fetch(SERVER_URL + "/visit", {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json; charset=utf-8"
            },

            body: JSON.stringify({
                url: url
            }),

            keepalive: true
        });

    } catch (error) {

        /*
            Ошибка статистики посещения не должна
            мешать пользователю открыть сайт.
        */

        console.log(
            "Не удалось отправить посещение:",
            error
        );
    }
}


// ============================================================
// ОБРАБОТКА ПОИСКА
// ============================================================

async function handleSearch() {

    const input =
        document.getElementById("pole");

    if (!input) {
        return;
    }


    const query =
        input.value.trim();


    if (!query) {
        return;
    }


    await search(query);
}


// ============================================================
// КНОПКА ПОИСКА
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const input =
            document.getElementById("pole");

        const button =
            document.getElementById("sell");


        if (button) {

            button.addEventListener(
                "click",
                function() {
                    handleSearch();
                }
            );
        }


        if (input) {
            input.addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch();
                }
            };
        }


        /*
            Дополнительный прогрев после создания DOM.

            Он использует тот же Promise, поэтому
            одновременно несколько /health запросов
            не отправятся.
        */

        setTimeout(
            function() {
                warmupServer();
            },
            500
        );
    }
);


// ============================================================
// ЕСЛИ РАЗМЕР ОКНА ИЗМЕНИЛСЯ
// ============================================================

window.addEventListener(
    "resize",
    function() {

        /*
            Оставляем возможность существующему
            интерфейсу реагировать на изменение
            ориентации.
        */

        const landscape =
            isLandscape();

        document.documentElement
            .classList.toggle(
                "landscape",
                landscape
            );

        document.documentElement
            .classList.toggle(
                "portrait",
                !landscape
            );
    }
);


// Первоначальное определение формата
document.addEventListener(
    "DOMContentLoaded",
    function() {

        const landscape =
            isLandscape();

        document.documentElement
            .classList.toggle(
                "landscape",
                landscape
            );

        document.documentElement
            .classList.toggle(
                "portrait",
                !landscape
            );
    }
);
