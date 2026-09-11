var poisk = [];
var elements_sites = [];
var elements_p = [];
var elements_op = [];
var elements_img = [];
var elements_prosm = [];
function search(query) {

    return new Promise((resolve, reject) => {

        const socket = new WebSocket(
            "ws://46.150.175.171:18765"
        );

        socket.onopen = function () {
            console.log("Отправляю:", query);
            socket.send(query);
        };

        socket.onmessage = function (event) {

            console.log("Получено:", event.data);

            try {
                const result = JSON.parse(event.data);
                resolve(result);
            }
            catch (error) {
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


var sell = document.getElementById("sell");
var input = document.getElementById("pole");
var logo = document.getElementById('logo')


sell.onclick = async function () {
    input.style.right = "-2vw";
    input.style.bottom = "-3vh";
    input.style.width = "30vw";
     input.style.height = "5vh";
    input.style.marginRight = "40vw";
    input.style.paddingRight = "7vw";
    logo.style.right = "-2vw";
    logo.style.bottom = "-2vh";
    logo.style.width = "10vw";
    logo.style.height = "6vh";
    sell.style.right = "-38vw";
    sell.style.bottom = "-4vh";
    // sell.style.width = "2vw";
    // sell.style.height = "1.5vw";
    // sell.style.fontSize = "0.8vw";
    // sell.style.overflow = "hidden";

    var query = input.value;

    console.log("Запрос пользователя:", query);

    try {

        poisk = await search(query);


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
        var len = poisk.length;
        if(len > 200)
          len = 200;
        for(var n = 0; n < len; n++) {
          if(poisk[n][0].length > 60) {
            elements_sites[n].innerHTML = poisk[n][0].slice(0 , 60) + "..." + "<span class = 'pros'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;👁️&nbsp;" + poisk[n][3]  + "</span>" + "<br>";
          } else {
            elements_sites[n].innerHTML = poisk[n][0] + "<span class = 'pros'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;👁️&nbsp;" + poisk[n][3] + "</span>" + "<br>";
          }
          elements_sites[n].href = poisk[n][2];
          elements_sites[n].style.fontFamily = "Arial";
          elements_sites[n].style.fontSize = "1.2vw";
          elements_sites[n].style.color = "#5b94f0";
          // elements_sites[n].onclick = "sendLink(this)";
          if(n == 0) {
            elements_sites[n].style.position = "relative";
            elements_sites[n].style.bottom = "-7vh";

            elements_p[n].style.position = "relative";
            elements_p[n].style.bottom = "-7vh";
            elements_op[n].style.position = "relative";
            elements_op[n].style.bottom = "-7vh";
          }
          elements_sites[n].style.marginLeft = "5vw";




          if(poisk[n][2] > 100) {
            elements_p[n].innerHTML = poisk[n][2].slice(0 , 100) + "..."  + "<br>";
          } else {
            elements_p[n].innerHTML = poisk[n][2] + "<br>";
          }
          elements_p[n].style.fontFamily = "Arial";
          elements_p[n].style.fontSize = "0.6vw";
          elements_p[n].style.color = "#25422d";

          elements_p[n].style.marginLeft = "5vw";


          if(poisk[n][1].length > 120) {
            elements_op[n].innerHTML = poisk[n][1].slice(0 , 120) + "..."  + "<br>";
          } else {
            elements_op[n].innerHTML = poisk[n][1] + "<br>";
          }
          elements_op[n].style.fontFamily = "Arial";
          elements_op[n].style.fontSize = "0.9vw";
          elements_op[n].style.color = "grey";

          elements_op[n].style.marginLeft = "5vw";
          if(n == 0) {
            elements_op[n].style.marginBottom = "7vw";
          } else {
            elements_op[n].style.marginBottom = "4vw";
          }

        }

    }
    catch (error) {

        console.log("Ошибка поиска:", error);

    }
};
function sendLink(a) {

    const href = a.href;

    console.log("НАЖАТА ССЫЛКА:", href);
    console.log("Подключаюсь к порту 12874...");

    const socket = new WebSocket(
        "ws://46.150.175.171:12874"
    );

    socket.onopen = function () {

        console.log("ПОДКЛЮЧЕНИЕ К 12874 УСПЕШНО");

        console.log(
            "Отправляю посещение:",
            href
        );

        socket.send(href);
    };

    socket.onmessage = function (event) {

        console.log(
            "Ответ Python:",
            event.data
        );

        socket.close();

        window.location.href = href;
    };

    socket.onerror = function (error) {

        console.log(
            "ОШИБКА ПОРТА 2874:",
            error
        );

        socket.close();

        window.location.href = href;
    };

    socket.onclose = function () {

        console.log(
            "WebSocket 2874 закрыт"
        );
    };
}
