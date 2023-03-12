var testing = false
var url = "https://pounce.lol"
var urlws = "wss://pounce.lol/"
var token = document.cookie.split('=')[1]
// 
//alert(document.cookie)

token = JSON.parse(document.cookie.split(';')[0])
token = token.token

//alert(token)
if (testing == true) {
    url = "http://localhost:7777"
    urlws = "ws://localhost:7777/"
} else {}
document.body.style = "display:none;"

//loading 

document.body.style = "display:block;"

var usernames = {}
//usernames["joshid123"] = "josh"

function clear() {
    let chats = document.getElementById('list')
    chats.innerHTML = ""
}

function openRoom(id) {
    fetch(`${url}/room/?r=${id}`, {
    method: 'GET',
    headers: {
        'auth': `${token}`,
    },
    })
    .then((response) => response.text())
    .then((text) => {
        document.getElementById('infoHeader').innerText = text
    });
}

function getRooms() {
    fetch(`${url}/getRooms`, {
    method: 'GET',
    headers: {
        'auth': `${token}`,
    },
    })
    .then((response) => response.text())
    .then((text) => {
        let rooms = text.split(';')
        for (i=0; i<rooms.length; i++) {
            console.log(rooms[i])
            let room = `
            <div class="room-button" onclick='openRoom(${i})'><h1 class="room-title">
                ${i}
            </h1></div>
            `
            document.getElementById('selectRoom').innerHTML += room
        }
    });
} getRooms()


function loadRoom(id, auth) {
    //document.getElementById('list').style = "display:none;"
    req = `${url}/loadRoom/`//+id
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        let response = xhttp.responseText
        let chats = response.split(';')
        for (i=1; i<chats.length; i++) {
            newMessage(chats[i])
        }
        }
    };
    xhttp.open("GET", req, true);
    xhttp.send();
} loadRoom()
document.getElementById('chat-window').scrollBy(0, 1000);

var username = "default"
var keyinput = document.getElementById("chat-input");

// repeat every 15 seconds
setInterval(function() {
    let mes = {
        ping: "ping",
        token: token
    }
    sendMessage(JSON.stringify(mes))
    console.log("pinged server to prevent timeout")
}, 15000);




keyinput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault(); 
        let input = document.getElementById('chat-input')
        let content = input.value
        if (input.value == '') {return} 
        let mes = {
            messageContent: content,
            token: token
        }
        console.log(mes)
        input.value = ''
        sendMessage(JSON.stringify(mes))
    }
  });





// Create WebSocket connection.
var socket = new WebSocket(urlws);

socket.addEventListener('open', function (event) {
    //alert("done")
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    //alert(event.data)
    // check if 
    let userId = JSON.parse(event.data).userId
    let time = JSON.parse(event.data).time
    let content = JSON.parse(event.data).content
    console.log(`${userId} HIUWDGHAWIGDHYUIAWGDYIWAGDYI`)
    getUserName(userId, time, content)
});

function sendMessage(message) {
    console.log('Sending message: '+message+'...')
    socket.send(message)
}

function addName(name, userid) {
    usernames[userid] = name;
    //alert(usernames[userid])
}

function loadC(id) {
    const xhr = new XMLHttpRequest();
    let req = url + '/sort1/?id='+id
    //alert(req)
    xhr.open('GET', req);
    xhr.send();

    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(xhr.responseText)
        let usernames = xhr.getResponseHeader('usernames')
        //alert(xhr.getResponseHeader('usernames'))
        multiusername(usernames, response)
    }
    };
}

async function loadA(array) {
    multiusername(array)
}

function multiusername(array, response) {
    let req = `${url}/multi/usernames/?data=${array}`
    // Create an XMLHttpRequest object
    const xhttp = new XMLHttpRequest();

    // Define a callback function
    xhttp.onload = function() {
        //alert(xhttp.responseText)
        let ar = JSON.parse(xhttp.responseText)
        //alert(ar[0], ar[1])
        let run = false
        for (i = 0; i < ar.length; i++) {
            //alert(ar[i])
            usernames[ar[i][1]] = ar[i][0]
        }
        run = true
        //alert(run)
        //if (run = true) {loadMessages('test8')}
        for (i = 0; i < response.length; i++) {
            newMessage(usernames[response[i].userId],response[i].time,response[i].messageContent)
        }
    }

    // Send a request
    xhttp.open("GET", req);
    xhttp.send();
}

function first(array) {
    let req = `${url}/multi/usernames/?data=${array}`
    return new Promise((resolve, reject) => {
        fetch(req)
          .then(response => {
            return Promise.all([response.text(), response.headers]);
          })
          .then(([text, headers]) => {
            alert(text, headers)
            resolve({ text, headers });
          })
          .catch(error => {
            alert('error')
            reject(error);
          });
    })
}

function getUserName(userId, time, content) {
    const xhr = new XMLHttpRequest();
    let req = url + '/user/name/?id='+userId
    //alert(req)
    xhr.open('GET', req);
    xhr.send();

    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        let response = xhr.responseText
        newMessage(response, time, content)
    }
    };
}

function newMessage(username1, time, content) {
    //alert(data)
    //let obj = JSON.parse(data)
    //let userId = obj.userId
    if (username = undefined) {
        console.log("Username not found")
        return "Username not found"
    }

    //    Wed Mar 01 2023 20:57:22 GMT+1100 (Australian Eastern Daylight Time)

    //time conversion
        let nTime = new Date(time)
        nTime = nTime.toString()
        //alert(nTime)
        let month = nTime.split(' ')[1]
        let day = nTime.split(' ')[0]
        let nDay = nTime.split(' ')[2]
        nTime = nTime.split(' ')[4]
        time = nTime
        let hour = parseInt(nTime.split(':')[0])
        if (nTime.split(':')[0] > 13) {
            time = hour - 12 + ":" + nTime.split(':')[1] + "PM"
        } else {
            time = nTime.split(':')[0] + nTime.split(':')[1] + "AM"
        }
        // checking if it was yesterday TODO
        let today = Date(Date.now().toString()).split(' ')[2]
        if (today == nDay) {

        } else {
            time = nDay + " " + month + " " + time 
        }

        let appendedMessage = document.createElement('li');
        appendedMessage.classList.add('chat-message');
    console.log(`${username1} THIS THIS HIT SHITS`)
        appendedMessage.innerHTML = `
        <li class="chat-message">
                <div class="chat-message-content-header">
                    <span class="chat-message-content-header-username">${username1}</span>
                    <span class="chat-message-content-header-time">${time}</span>
                </div>
                <div class="chat-message-content-body">
                    <span class="chat-message-content-body-message">${content}</span>
                </div>
        </li>
        `;
        document.getElementById('list').appendChild(appendedMessage);
        appendedMessage.scrollIntoView();
}
 

function addChannel(channelID) {
    let channels = document.getElementById('select-channel').innerHTML
    document.getElementById('select-channel').innerHTML = document.getElementById('select-channel').innerHTML + `<div class="channel" onclick="reconnect('${channelID}'); loadMessages('${channelID}')"><i class="fa-solid fa-list"></i>${channelID}</div>`
}

function loadMessages(channelID) {
    let requrl = url+"/sort/?id="+channelID
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        let messageArray = JSON.parse(xhttp.responseText)
        for (i = 0; i < messageArray.length; i++) {
            console.log(messageArray)
            let tempmessage =  {content:messageArray[i].messageContent, userId:messageArray[i].userId, time:messageArray[i].time}
            if (usernames[tempmessage.userId] == undefined) {
                newMessage(JSON.stringify(tempmessage), "request")
            }
            newMessage(JSON.stringify(tempmessage), usernames[tempmessage.userId])  
            if (i < messageArray.length - 1) {
                //document.getElementById('list').style = "display:block;"
            }
        } 
        }
    };
    xhttp.open("GET", requrl, true);
    xhttp.send();
    //document.getElementById('list').style = "display:block;"
}

function test() {
    socket.close()
}

function reconnect(sId) {
    //document.getElementById('list').style = "display:none;"
    clear()
    socket.close()
    sId = urlws + sId
    socket = new WebSocket(sId);

    socket.addEventListener('open', function (event) {
    });
    
    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        let userId = JSON.parse(event.data).userId
        let time = JSON.parse(event.data).time
        let content = JSON.parse(event.data).content
        getUserName(userId, time, content)
    });
}

// wait 2 seconds

async function add() {
    let nfill = 0;
    let nchat = 500;
    let win = document.getElementById('chat-window')
    //win.style.gridTemplateRows = '0px 500px 50px'
    // let fill = document.getElementById('filler');
    // fill.style.height = '0px';
    // repeat 20 times
    for (let i = 0; i < 40; i++) {
        // wait 1 second
        await new Promise(resolve => setTimeout(resolve, 50));
        // append to list
        let message = document.createElement('li');
        message.classList.add('chat-message');
        message.innerHTML = `
        <li class="chat-message">
                <div class="chat-message-content-header">
                    <span class="chat-message-content-header-username">Pounce8</span>
                    <span class="chat-message-content-header-time">9:43 AM</span>
                </div>
                <div class="chat-message-content-body">
                    <span class="chat-message-content-body-message">Message ${i}</span>
                </div>
        </li>
        `;
        document.getElementById('list').appendChild(message);
        message.scrollIntoView();
        //print chat-window height in pixels
        console.log(win.offsetHeight);
        // if chat-window height is less than 500px
    //     if (win.offsetHeight < 500) {
    //         win.style.overflowY = 'hidden';
    //     } else {
    //         win.style.overflowY = 'scroll';
    //     }
    }
}

function fill(a, b) {
    let x = 500 - b
    let y = 500 - a
    if (x == 0) {
        return
    } else {
        
    }
}

//add();

// get the current width of the screen
window.innerWidth

