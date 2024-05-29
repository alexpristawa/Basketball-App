const body = document.body;
const html = document.documentElement;
const root = document.querySelector(':root');
let activeScreen = 'playerScreen';
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.strokeStyle = 'black';
let colorOptionsOpen = [false,false];

let team1 = [];
let team2 = [];
let activePlayer = {};

let colorOptions = [
    'rgb(113, 18, 27)', //Red
    'rgb(185, 52, 9)', //Orange
    'rgb(217, 159, 9)', //Yellow
    'rgb(27, 75, 51)', //Green
    'rgb(30, 186, 71)', //lime
    'rgb(12, 83, 109)', //Teal
    'rgb(42, 63, 133)', //Blue
    'rgb(61, 26, 118)', //Purple
    'rgb(142, 144, 146)', //Gray
    'rgb(26, 25, 29)', //Black
    'rgb(255,255,255)', //white
]

let team1Info = {
    'Name': 'Team 1',
    'Side': 'Left',
    'Color': colorOptions[0]
};

let team2Info = {
    'Name': 'Team 2',
    'Side': 'Right',
    'Color': colorOptions[5]
};

let buttonOptions = [
    'Player',
    'Shot',
    'Foul',
    'Steal',
    'Rebound'
];

//onLoad function that gets the code running
window.onload = () => {
    titleLetterHandler();
    colorHandler();
    makeCourt();
    resizeFunction();
    if(localStorage['BasketballApp'] == undefined) {
        newPlayer(1);
        newPlayer(2);
    } else {
        loadFromLocalStorage();
    }
    let teamSide = document.getElementById('teamSide');
    teamSide.addEventListener('click', () => {

        let teamSideRotater = document.getElementById('teamSideRotater');
        teamSideRotater.classList.remove('teamSideRotater');
        setTimeout(() => {
            teamSideRotater.classList.add('teamSideRotater');
        });
        let teamNameLeft = document.getElementById('teamNameLeft');
        let teamNameRight = document.getElementById('teamNameRight');
        if(team1Info['Side'] == 'Left') {
            team1Info['Side'] = 'Right';
            team2Info['Side'] = 'Left';
            teamNameLeft.querySelector('p').innerHTML = team2Info['Name'];
            teamNameRight.querySelector('p').innerHTML = team1Info['Name'];
        } else {
            team1Info['Side'] = 'Left';
            team2Info['Side'] = 'Right';
            teamNameLeft.querySelector('p').innerHTML = team1Info['Name'];
            teamNameRight.querySelector('p').innerHTML = team2Info['Name'];
        }
        removeCircles();
    });
}

//Loads the saved information from the local storage and updates the team arrays
let loadFromLocalStorage = () => {
    let obj = JSON.parse(localStorage['BasketballApp']);
    team1 = obj['team1'];
    team2 = obj['team2'];
    team1Info = obj['team1Info'];
    team2Info = obj['team2Info'];
    for(let i = 0; i < team1.length; i++) {
        newPlayer(1, team1[i]);
    }
    for(let i = 0; i < team2.length; i++) {
        newPlayer(2, team2[i]);
    }
    let teamNameLeft = document.getElementById('teamNameText1');
    let teamNameRight = document.getElementById('teamNameText2');
    teamNameLeft.value = team1Info['Name'];
    teamNameRight.value = team2Info['Name'];
    save();
}

//Makes event listeners for each color to make a color picker for your team
let colorHandler = () => {
    let colorSquaresDisplay = document.querySelectorAll('.colorSquareOnDisplay');
    colorSquaresDisplay[0].style.backgroundColor = colorOptions[0];
    colorSquaresDisplay[1].style.backgroundColor = colorOptions[5];
    let colorSquareNumber = 1;
    colorSquaresDisplay.forEach(colorSquareDisplay => {
        const teamNumber = colorSquareNumber;
        colorSquareDisplay.addEventListener('click', () => {
            if(!colorOptionsOpen[teamNumber]) {
                colorOptionsOpen[teamNumber] = true;
                let div = document.createElement('div');
                div.classList.add('colorsHolder');
                div.classList.add(`colorsHolderTeam${teamNumber}`);
                const rect = colorSquareDisplay.getBoundingClientRect();
                div.style.top = `calc(${rect.top}px + 2vw)`;
                div.style.left = `calc(${rect.left}px - ${colorOptions.length/2}vw)`
                div.style.width = `calc(${colorOptions.length}vw + ${colorOptions.length*2-2}px)`;
                body.appendChild(div);
                for(let i = 0; i < colorOptions.length; i++) {
                    let square = document.createElement('div');
                    square.classList.add('colorSquares');
                    square.style.backgroundColor = colorOptions[i];
                    if(colorOptions[i] == colorSquareDisplay.style.backgroundColor) {
                        square.style.border = '1px solid rgb(230, 230, 230)';
                    }
                    div.appendChild(square);
                    square.addEventListener('click', () => {
                        colorSquareDisplay.style.backgroundColor = colorOptions[i];
                        let squares = div.querySelectorAll('div');
                        squares.forEach(squareForNoBorder => {
                            squareForNoBorder.style.border = '0px';
                        });
                        square.style.border = '1px solid rgb(230, 230, 230)';
                        if(teamNumber == 1) {
                            team1Info['Color'] = colorOptions[i];
                        } else if(teamNumber == 2) {
                            team2Info['Color'] = colorOptions[i];
                        }
                    });
                }
            } else {
                let div = document.querySelector(`.colorsHolderTeam${teamNumber}`);
                div.remove();
                colorOptionsOpen[teamNumber] = false;
            }
        });
        colorSquareNumber++;
    });
}

//Calls functions that resize the functions and gets rid of circles when the window is resized
window.onresize = () => {
    resizeFunction();
    removeCircles();
}

//Resizes stuff based on window height
let resizeFunction = () => {
    html.style.fontSize = `${(window.innerHeight*window.innerWidth)/65970}px`;

    makeCourt();
    let teamNameLeft = document.getElementById('teamNameLeft');
    let teamNameRight = document.getElementById('teamNameRight');
    let teamSide = document.getElementById('teamSide');
    teamNameLeft.style.top = `calc(${canvas.style.top} - 3vh)`;
    teamNameLeft.style.left = `calc(${canvas.style.left} + 1vw)`;
    teamNameRight.style.top = `calc(${canvas.style.top} - 3vh)`;
    teamNameRight.style.right = `calc(${window.innerWidth - parseFloat(canvas.style.left.substring(0,canvas.style.left.length-2)) - canvas.offsetWidth}px + 1vw)`;
    teamSide.style.top = `calc(${canvas.style.top} - 4vh)`;
    teamSide.style.left = `calc(${window.innerWidth/2}px - 1vw)`;
    if(team1Info['Side'] == 'Left') {
        teamNameLeft.querySelector('p').innerHTML = team1Info['Name'];
        teamNameRight.querySelector('p').innerHTML = team2Info['Name'];
    } else {
        teamNameRight.querySelector('p').innerHTML = team1Info['Name'];
        teamNameLeft.querySelector('p').innerHTML = team2Info['Name'];
    }
}

//Makes an event listener tohandle when a button is clicked
document.addEventListener('keydown', (event) => {
    if(event.target.classList.contains('playerNumber')) {
        setTimeout(() => {
            if(event.target.value.length > +!+[]+!+[] && !isNaN(event.key)) {
                event.target.blur();
                let p = event.target.parentNode.querySelector('.playerName');
                p.focus();
                if(event.target.value.length > 4) {
                    event.target.value = event.target.value.substring(0,4);
                }
            } else if(event.target.value.split('').indexOf('#') == -1) {
                event.target.value = `#${event.target.value}`;
            }
        });
    }
    if(event.key == 'Enter') {
        if(event.target.classList.contains('team1') || event.target.classList.contains('team2')) {
            if(event.target.classList.contains('playerNumber')) {
                event.target.parentNode.querySelector('.playerName').focus();
            } else if(event.target.classList.contains('playerName')) {
                event.target.parentNode.querySelector('.playerPosition').focus();
            } else if(event.target.classList.contains('playerPosition')) {
                if(event.target.classList.contains('team1')) {
                    newPlayer(1);
                } else {
                    newPlayer(2);
                }
            }
        }
        if(event.target.tagName == "INPUT" && event.target.type == "text") {
            event.target.blur();
        }
    }
    if(activeScreen == 'playerScreen') {
        setTimeout(() => {
            save();
            if(team1.length == 0 && team2.length == 0) {
                delete localStorage['BasketballApp'];
            } else {
                localStorage['BasketballApp'] = JSON.stringify({
                    'team1': team1,
                    'team2': team2,
                    'team1Info': team1Info,
                    'team2Info': team2Info
                });
            }
        });
    }
});

//When a key is clicked, it calls this function and updates the local storage, and the team objects
let save = () => {
    let playerNames1 = document.querySelectorAll('.playerName.team1');
    let playerPositions1 = document.querySelectorAll('.playerPosition.team1');
    let playerNumbers1 = document.querySelectorAll('.playerNumber.team1');
    let playerNames2 = document.querySelectorAll('.playerName.team2');
    let playerPositions2 = document.querySelectorAll('.playerPosition.team2');
    let playerNumbers2 = document.querySelectorAll('.playerNumber.team2');
    for(let i = 0; i < playerNames1.length; i++) {
        if(playerNames1.length > team1.length) {
            team1.push({});
        } else {
            break;
        }
    }
    for(let i = 0; i < playerNames2.length; i++) {
        if(playerNames2.length > team2.length) {
            team2.push({});
        } else {
            break;
        }
    }
    const temp1 = [...team1];
    const temp2 = [...team2];
    team1 = [];
    team2 = [];
    for(let i = 0; i < playerNames1.length; i++) {
        if(playerNumbers1[i].value != '#') {
            if('Shots' in temp1[i]) {
                team1.push({
                    'Name': playerNames1[i].value,
                    'Number': playerNumbers1[i].value,
                    'Position': playerPositions1[i].value,
                    'Shots': {...temp1[i]['Shots']},
                    'Fouls': temp1[i]['Fouls'],
                    'Steals': temp1[i]['Steals'],
                    'Rebounds': temp1[i]['Rebounds'],
                    'Free Throws Made': temp1[i]['Free Throws Made'],
                    'Free Throws Missed': temp1[i]['Free Throws Missed']
                });
            } else {
                team1.push({
                    'Name': playerNames1[i].value, 
                    'Number': playerNumbers1[i].value, 
                    'Position': playerPositions1[i].value,
                    'Shots': {
                        'Shots': 0,
                        'Misses': 0,
                        'Scores': 0,
                        'Points': 0,
                        '2 Pointers': 0,
                        '3 Pointers': 0
                    },
                    'Fouls': 0,
                    'Steals': 0,
                    'Rebounds': 0,
                    'Free Throws Made': 0,
                    'Free Throws Missed': 0
                });
            }
        }
    }
    for(let i = 0; i < playerNames2.length; i++) {
        if(playerNumbers2[i].value != '#') {
            if('Shots' in temp2[i]) {
                team2.push({
                    'Name': playerNames2[i].value,
                    'Number': playerNumbers2[i].value,
                    'Position': playerPositions2[i].value,
                    'Shots': {...temp2[i]['Shots']},
                    'Fouls': temp2[i]['Fouls'],
                    'Steals': temp2[i]['Steals'],
                    'Rebounds': temp2[i]['Rebounds'],
                    'Free Throws Made': temp2[i]['Free Throws Made'],
                    'Free Throws Missed': temp2[i]['Free Throws Missed']
                });
            } else {
                team2.push({
                    'Name': playerNames2[i].value, 
                    'Number': playerNumbers2[i].value, 
                    'Position': playerPositions2[i].value,
                    'Shots': {
                        'Shots': 0,
                        'Misses': 0,
                        'Scores': 0,
                        'Points': 0,
                        '2 Pointers': 0,
                        '3 Pointers': 0
                    },
                    'Fouls': 0,
                    'Steals': 0,
                    'Rebounds': 0,
                    'Free Throws Made': 0,
                    'Free Throws Missed': 0
                });
            }
        }
    }

    let teamName1 = document.getElementById('teamNameText1');
    let teamName2 = document.getElementById('teamNameText2');
    team1Info['Name'] = teamName1.value;
    team2Info['Name'] = teamName2.value;

    resizeFunction();
}

//Takes the title and makes the animation where when you hover, the letters bounce
let titleLetterHandler = () => {
    let titleLetterContainer = document.getElementById('titleLetterContainer');
    let h1 = document.getElementById('appTitleH1');
    let div = document.createElement('div');
    for(let i = 0; i < h1.innerText.length; i++) {
        let p = document.createElement('p');
        p.innerText = h1.innerText[i];
        div.appendChild(p);
    }
    titleLetterContainer.appendChild(div);
    h1.remove();
    let animationRunning = false;
    titleLetterContainer.addEventListener('mouseenter', () => {
        if(!animationRunning) {
            animationRunning = true;
            let paragraphs = titleLetterContainer.querySelectorAll('p');
            for(let i = 0; i < paragraphs.length; i++) {
                let p = paragraphs[i];
                setTimeout(() => {
                    p.classList.add('titleLetterAnimation');
                    setTimeout(() => {
                        p.classList.remove('titleLetterAnimation');
                        if(i == paragraphs.length-1) {
                            animationRunning = false;
                        }
                    },800);
                },40*i);
            }
        }
    });
}

//Makes a new player div and adds it to the team box
let newPlayer = (team, obj) => {
    let playerAddHolder = document.querySelectorAll('.playerAddHolder');
    playerAddHolder[team-1].classList.remove('playerAddHolderSlideDown');
    playerAddHolder[team-1].classList.remove('playerAddHolderSlideUp');

    let teamDiv = document.getElementById(`team${team}`);
    let teamDivPlayers = document.getElementById(`teamPlayers${team}`);
    let div = document.createElement('div');
    div.classList.add('playerDiv');
    div.classList.add('playerDivSlideDown');
    teamDivPlayers.appendChild(div);

    let playerNumber = document.createElement('input');
    playerNumber.type = 'text';
    playerNumber.value = '#'
    playerNumber.classList.add('playerNumber');
    playerNumber.classList.add(`team${team}`);
    div.appendChild(playerNumber);
    playerNumber.focus();

    let infoDiv = document.createElement('div');
    infoDiv.classList.add('playerInfoDiv');
    div.appendChild(infoDiv);

    let playerName = document.createElement('input');
    playerName.type = 'text';
    playerName.placeholder = 'Name';
    playerName.classList.add('playerName');
    playerName.classList.add(`team${team}`);
    infoDiv.appendChild(playerName);

    let playerPosition = document.createElement('input');
    playerPosition.type = 'text';
    playerPosition.placeholder = 'Position (Optional)';
    playerPosition.classList.add('playerPosition');
    playerPosition.classList.add(`team${team}`);
    infoDiv.appendChild(playerPosition);

    let x = document.createElement('button');
    x.innerHTML = '&times;';
    x.classList.add('xButtons');
    div.appendChild(x);

    x.classList.add('xButtonTeamDiv');
    x.addEventListener('click', () => {
        let number = div.querySelector('.playerNumber').value;
        let index = findPlayerNumber(team, number);
        if(team == 1) {
            if(team1[index]['Number'] != '#') {
                team1.splice(index, 1);
            }
        } else {
            if(team2[index]['Number'] != '#') {
                team2.splice(index, 1);
            }
        }
        
        div.classList.remove('playerDivSlideDown');
        playerAddHolder[team-1].classList.remove('playerAddHolderSlideDown');
        x.classList.add("xButtonAnimating")

        setTimeout(() => {
            x.classList.remove("xButtonAnimating")
        },150)
        setTimeout(() => {
            div.classList.add('playerDivSlideUp');
            playerAddHolder[team-1].classList.add('playerAddHolderSlideUp');
            setTimeout(() => {
                div.remove();
                playerAddHolder[team-1].classList.remove('playerAddHolderSlideUp');
            },400);
        });
    });

    setTimeout(() => {
        playerAddHolder[team-1].classList.add('playerAddHolderSlideDown');
        teamDiv.scrollTop = teamDiv.scrollHeight;
    });

    if(obj) {
        playerName.value = obj['Name'];
        playerPosition.value = obj['Position'];
        playerNumber.value = obj['Number']
    }

    if(!obj) {
        save();
    }
}

//Makes the teams go out to the sides and brings the user to the court
let goToCourt = () => {
    if(activeScreen == "statsScreen") {
        toggleTeamStats();
    }

    if(activeScreen != 'courtScreen') {
        activeScreen = 'courtScreen';
        let team1Box = document.getElementById('team1');
        let team2Box = document.getElementById('team2');

        colorOptionsOpen = [false,false];
        
        teamBoxCurrentlyAnimating = true;
        team1Box.classList.add('teamSlideOutLeft');
        team2Box.classList.add('teamSlideOutRight');
    
        makeCourt();
    } else {
        bringBothTeamsBack();
    }
    removeStuff();
}

//Removes all of the stuff that would appear on the screen or canvas
let removeStuff = () => {
    removeCircles();
    removeColorChooser();
    removePlayerChooser();
}

//Removes the color choosers
let removeColorChooser = () => {
    let colorChoosers = document.querySelectorAll('.colorsHolder');
    colorChoosers.forEach(div => {
        div.remove();
    });
}

//Removes the player chooser
let removePlayerChooser = () => {
    let playerChoosers = document.querySelectorAll('.playerChooser');
    playerChoosers.forEach(chooser => {
        chooser.classList.remove('fadeIn');
        setTimeout(() => {
            chooser.classList.add('fadeOut');
            setTimeout(() => {
                chooser.remove();
            },300);
        });
    })
}

//Function called when window loads and resizes, and it draws the court
let makeCourt = () => {
    let canvasHeight;
    let canvasWidth;
    //adjusts canvas size based on the height and width of the screen at a ratio of 94:50
    if(window.innerWidth / (window.innerHeight/10*9) > 94/50) {
        canvasHeight = (window.innerHeight/10*9)/10*9;
        canvasWidth = canvasHeight/50*94;
    } else {
        canvasWidth = (window.innerWidth/10*9);
        canvasHeight = canvasWidth/94*50;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    canvas.style.left = `${(window.innerWidth - (canvas.width + 6))/2}px`;
    canvas.style.top = `${(window.innerHeight/5 + window.innerHeight/10*9-canvasHeight)/2}px`;

    ctx.clearRect(0,0,canvas.width,canvas.height);


    ctx.beginPath();
        ctx.arc(canvas.width/2,canvas.height/2,canvas.height/6,0,Math.PI*2);
    ctx.stroke();


    ctx.beginPath();
        ctx.moveTo(canvas.width/2,0)
        ctx.lineTo(canvas.width/2,canvas.height)
    ctx.stroke()


    /* THE FOLLOWING CODE WILL DRAW THE PHYSICAL LINES ON THE COURT USING THE CANVAS CONTEXT APPROACH*/
    
    //Right Three Point Line
    ctx.beginPath();
        ctx.moveTo(canvas.width,canvas.height/2 + canvas.height/2.5)
        ctx.lineTo(canvas.width/20*18,canvas.height/2 + canvas.height/2.5)
        ctx.arc(canvas.width/20*18,canvas.height/2,canvas.height/2.5,Math.PI/2, Math.PI*1.5);
        ctx.moveTo(canvas.width,canvas.height/2 - canvas.height/2.5)
        ctx.lineTo(canvas.width/20*18,canvas.height/2 - canvas.height/2.5)
    ctx.stroke();

    //Right inside circle
    ctx.beginPath();
        ctx.arc(canvas.width/20*15.75,canvas.height/2,canvas.height/6.5,0,Math.PI*2)

        ctx.moveTo(canvas.width/20*15.75,canvas.height/2- canvas.height/6.5)
        ctx.lineTo(canvas.width,canvas.height/2- canvas.height/6.5)
        ctx.moveTo(canvas.width/20*15.75,canvas.height/2- canvas.height/6.5)

        ctx.lineTo(canvas.width/20*15.75,canvas.height/2 + canvas.height/6.5)

        ctx.moveTo(canvas.width/20*15.75,canvas.height/2 + canvas.height/6.5)
        ctx.lineTo(canvas.width,canvas.height/2 + canvas.height/6.5)


    ctx.stroke();
    

    //Left Three Point Line
    ctx.beginPath();
        ctx.moveTo(0, canvas.height/2 - canvas.height/2.5)
        ctx.lineTo(canvas.width/10, canvas.height/2 - canvas.height/2.5);
        ctx.arc(canvas.width/10,canvas.height/2,canvas.height/2.5,Math.PI*1.5, Math.PI/2);
        ctx.moveTo(0,canvas.height/2 + canvas.height/2.5)
        ctx.lineTo(canvas.width/20*2,canvas.height/2 + canvas.height/2.5)
    ctx.stroke()

      //left inside circle
    ctx.beginPath();
        ctx.arc(canvas.width/20*4.25,canvas.height/2,canvas.height/6.5,0,Math.PI*2)

        ctx.moveTo(canvas.width/20*4.25,canvas.height/2- canvas.height/6.5)
        ctx.lineTo(0,canvas.height/2 - canvas.height/6.5)
        ctx.moveTo(canvas.width/20*4.25,canvas.height/2- canvas.height/6.5)

        ctx.lineTo(canvas.width/20*4.25,canvas.height/2 + canvas.height/6.5)
        ctx.moveTo(canvas.width/20*4.25,canvas.height/2 + canvas.height/6.5)
        ctx.lineTo(0,canvas.height/2 + canvas.height/6.5)
    ctx.stroke();


    //left hoop
    ctx.beginPath();
        ctx.moveTo(canvas.width/20 * 0.50, canvas.height/2 - canvas.height/10)
        ctx.lineTo(canvas.width/20 * 0.50, canvas.height/2 + canvas.height/10)
        ctx.moveTo(canvas.width/20 * 0.50,canvas.height/2)
        ctx.arc(canvas.width/20, canvas.height/2, canvas.width/40, Math.PI, Math.PI*3)
    ctx.stroke();

    //right hoop
    ctx.beginPath();
        ctx.moveTo(canvas.width/20 * 19.50, canvas.height/2 - canvas.height/10)
        ctx.lineTo(canvas.width/20 * 19.50, canvas.height/2 + canvas.height/10)
        ctx.moveTo(canvas.width/20 * 19.50, canvas.height/2)
        ctx.arc(canvas.width - canvas.width/40 * 2, canvas.height/2, canvas.width/40, Math.PI*2, 0)
    ctx.stroke();


    /* LINES ON THE COURT ARE DONE BEING DRAWN */
    
}

let removeCircles = () => {
    let otherButtons = document.querySelectorAll('.clickOptions');
    otherButtons.forEach(button => {
        for(let i = 0; i < 6; i++) {
            button.classList.remove(`clickOptionsIn${i}`);
        }
        setTimeout(() => {
            button.classList.add('fadeOut');
            setTimeout(() => {
                button.remove();
            },300);
        });
    });

    let redXs = document.querySelectorAll('.centerXDiv');
    redXs.forEach(redX => {
        redX.classList.add('fadeOut');
        setTimeout(() => {
            redX.remove();
        },300);
    });
}

//Adds an event listener to the canvas for when you click on it, which makes the circles around your cursor
canvas.addEventListener('mousedown', (event) => {
    let localButtonOptions = [...buttonOptions];
    if(activeScreen == 'courtScreen' && (team1.length > 0 || team2.length > 0)) {


        let x = event.clientX;
        let y = event.clientY;

        if(whichNetIsCloser(x) == 1) {
            let canvasX = canvas.width/20*4.25 + parseFloat(canvas.style.left.substring(0,canvas.style.left.length-2));
            let canvasY = canvas.height/2 + parseFloat(canvas.style.top.substring(0,canvas.style.top.length-2));
            if(Math.pow(x - canvasX,2) + Math.pow(y - canvasY,2) < Math.pow(canvas.height/6.5,2)) {
                if((team1Info['Side'] == 'Right' && team1.length != 0) || (team2Info['Side'] == 'Right' && team2.length != 0)) {
                    localButtonOptions.push('Free Throw');
                }
            }
        } else {
            let canvasX = canvas.width/20*15.75 + parseFloat(canvas.style.left.substring(0,canvas.style.left.length-2));
            let canvasY = canvas.height/2 + parseFloat(canvas.style.top.substring(0,canvas.style.top.length-2));
            if(Math.pow(x - canvasX,2) + Math.pow(y - canvasY,2) < Math.pow(canvas.height/6.5,2)) {
                if((team1Info['Side'] == 'Left' && team1.length != 0) || (team2Info['Side'] == 'Left' && team2.length != 0)) {
                    localButtonOptions.push('Free Throw');
                }
            }
        }

        removeStuff();
        
        let centerXDiv = document.createElement('div');
        centerXDiv.classList.add('centerXDiv');
        centerXDiv.style.left = `${x - window.innerWidth/100*0.625}px`;
        centerXDiv.style.top = `${y - window.innerWidth/100*0.625}px`;
        body.appendChild(centerXDiv);
        
        centerXDiv.addEventListener('click', removeStuff);

        let centerX = document.createElement('p');
        centerX.classList.add('centerX');
        centerX.innerHTML = '<strong>&times;<strong>';
        centerXDiv.appendChild(centerX);
        

        for(let i = 0; i < localButtonOptions.length; i++) {
            let button = document.createElement('div');
            button.classList.add('clickOptions');
            let distance = (window.innerWidth/100*3)*1.62037037;
            let xChange = distance/(1+Math.sqrt(3));
            let yChange = xChange * Math.sqrt(3);

            root.style.setProperty('--circleAnimationDistance', `${distance}px`);
            root.style.setProperty('--circleAnimationDistanceX', `${xChange}px`);
            root.style.setProperty('--circleAnimationDistanceY', `${yChange}px`);

            if(i == 0) {
                button.style.left = `${x - distance - window.innerWidth/100*(2/5)}px`;
                button.style.top = `${y - window.innerWidth/100*1.5}px`;
                button.classList.add(`clickOptionsIn${i}`);
                button.classList.add('clickOptionsNumber');
                let p = document.createElement('p');
                p.classList.add('circleOptionNumber');
                let theTeam;
                if(whichNetIsCloser(x) == 1) {
                    if(team1Info['Side'] == 'Right') {
                        if(team1.length > 0) {
                            theTeam = 1;
                        } else if(team2.length > 0) {
                            theTeam = 2;
                        }
                    } else {
                        if(team2.length > 0) {
                            theTeam = 2;
                        } else if(team1.length > 0) {
                            theTeam = 1;
                        }
                    }
                } else {
                    if(team1Info['Side'] == 'Left') {
                        if(team1.length > 0) {
                            theTeam = 1;
                        } else if(team2.length > 0) {
                            theTeam = 2;
                        }
                    } else {
                        if(team2.length > 0) {
                            theTeam = 2;
                        } else if(team1.length > 0) {
                            theTeam = 1;
                        }
                    }
                }
                activePlayer['Team'] = theTeam;
                if(theTeam == 1) {
                    button.style.backgroundColor = team1Info['Color'];
                    p.innerHTML = team1[0]['Number'];
                    activePlayer['Number'] = team1[0]['Number'];
                } else if(theTeam == 2) {
                    button.style.backgroundColor = team2Info['Color'];
                    p.innerHTML = team2[0]['Number'];
                    activePlayer['Number'] = team2[0]['Number'];
                }
                let color = button.style.backgroundColor;
                if(sumOfColors(color) < 384) {
                    p.style.color = 'rgb(220, 220, 220)';
                }
                button.appendChild(p);
                button.addEventListener('click', () => {
                    if(document.querySelectorAll('.playerChooser').length == 0) {
                        makePlayerChooser(x, y);
                    } else {
                        removePlayerChooser();
                    }
                });
            } else if(i == 1) {
                button.style.left = `${x - xChange - window.innerWidth/100*1.5}px`;
                button.style.top = `${y - yChange - window.innerWidth/100*1.5}px`;
                button.classList.add(`clickOptionsIn${i}`);
                button.innerHTML = localButtonOptions[i];
                button.addEventListener('click', () => {
                    if(button.innerHTML == 'Shot') {
                        shotButton(x, y);
                    }
                });
            } else if(i == 2) {
                button.style.left = `${x + xChange - window.innerWidth/100*1.5}px`;
                button.style.top = `${y - yChange - window.innerWidth/100*1.5}px`;
                button.classList.add(`clickOptionsIn${i}`);
                button.innerHTML = localButtonOptions[i];
                button.addEventListener('click', () => {
                    if(button.innerHTML == 'Foul') {
                        let firstCircle = document.querySelector('.clickOptionsNumber');
                        if(firstCircle.style.backgroundColor == team1Info['Color']) {
                            let index = findPlayerNumber(1, firstCircle.querySelector('p').innerText);
                            team1[index]['Fouls']++;
                        } else {
                            let index = findPlayerNumber(2, firstCircle.querySelector('p').innerText);
                            team2[index]['Fouls']++;
                        }
                        removeCircles();
                    }
                });
            } else if(i == 3) {
                button.style.left = `${x + distance - window.innerWidth/100*2.5}px`;
                button.style.top = `${y - window.innerWidth/100*1.5}px`;
                button.classList.add(`clickOptionsIn${i}`);
                button.innerHTML = localButtonOptions[i];
                button.addEventListener('click', () => {
                    let firstCircle = document.querySelector('.clickOptionsNumber');
                    if(firstCircle.style.backgroundColor == team1Info['Color']) {
                        let index = findPlayerNumber(1, firstCircle.querySelector('p').innerText);
                        team1[index]['Steals']++;
                    } else {
                        let index = findPlayerNumber(2, firstCircle.querySelector('p').innerText);
                        team2[index]['Steals']++;
                    }
                    removeCircles();
                });
            } else if(i == 4) {
                button.style.left = `${x + xChange - window.innerWidth/100*1.5}px`;
                button.style.top = `${y + yChange - window.innerWidth/100*1.5}px`;
                button.classList.add(`clickOptionsIn${i}`);
                button.innerHTML = localButtonOptions[i];
                button.addEventListener('click', () => {
                    let firstCircle = document.querySelector('.clickOptionsNumber');
                    if(firstCircle.style.backgroundColor == team1Info['Color']) {
                        let index = findPlayerNumber(1, firstCircle.querySelector('p').innerText);
                        team1[index]['Rebounds']++;
                    } else {
                        let index = findPlayerNumber(2, firstCircle.querySelector('p').innerText);
                        team2[index]['Rebounds']++;
                    }
                    removeCircles();
                });
            } else if(i == 5) {
                button.style.left = `${x - xChange - window.innerWidth/100*1.5}px`;
                button.style.top = `${y + yChange - window.innerWidth/100*1.5}px`;
                button.classList.add(`clickOptionsIn${i}`);
                button.innerHTML = localButtonOptions[i];
                button.addEventListener('click', () => {
                    shotButton(x, y, true);
                });
            }
            body.appendChild(button);
            checkForButton(button);
        }
    } else if(team1.length == 0 && team2.length == 0 && activeScreen == 'courtScreen') {
        
        bringBothTeamsBack()

        canvas.style.border = '3px solid rgba(194, 53, 17,1)'
        setTimeout(() => {
            canvas.style.border = '3px solid black'
        },300)

        setTimeout(() => {
            canvas.style.animation = 'shake 0.5s 1'
            setTimeout(() => {
                canvas.style.animation = '';
                canvas.classList.remove('canvasSlideDown');
                canvas.classList.remove('canvasSlideInUp');
            },500);
        });
    }
});

//When you click on the shot button, it removes the buttons, and changes some to 'miss' or 'score'
let shotButton = (centerX, centerY, freeThrow) => {
    let buttons = document.querySelectorAll('.clickOptions');
    for(let i = 0; i < buttons.length; i++) {
        if([0,3,4,5,6].indexOf(i) != -1) {
            buttons[i].remove();
        } else if(i == 1) {
            buttons[i].innerHTML = 'Score';
            buttons[i].addEventListener('click', () => {
                removeCircles();
                let index = findPlayerNumber(activePlayer['Team'], activePlayer['Number']);
                if(!freeThrow) {
                    if(index != -1) {
                        let netNumber;
                        if(activePlayer['Team'] == 1) {
                            if(team1Info['Side'] == 'Left') {
                                netNumber = 2;
                            } else {
                                netNumber = 1;
                            }
                        } else {
                            if(team2Info['Side'] == 'Left') {
                                netNumber = 2;
                            } else {
                                netNumber = 1;
                            }
                        }
                        if(checkFor3Points(centerX, centerY, netNumber) == false) {
                            if(activePlayer['Team'] == 1) {
                                team1[index]['Shots']['Shots']++;
                                team1[index]['Shots']['Scores']++;
                                team1[index]['Shots']['Points']+= 2;
                                team1[index]['Shots']['2 Pointers']++;
                            } else {
                                team2[index]['Shots']['Shots']++;
                                team2[index]['Shots']['Scores']++;
                                team2[index]['Shots']['Points']+= 2;
                                team2[index]['Shots']['2 Pointers']++;
                            }
                        } else {
                            if(activePlayer['Team'] == 1) {
                                team1[index]['Shots']['Shots']++;
                                team1[index]['Shots']['Scores']++;
                                team1[index]['Shots']['Points']+= 3;
                                team1[index]['Shots']['3 Pointers']++;
                            } else {
                                team2[index]['Shots']['Shots']++;
                                team2[index]['Shots']['Scores']++;
                                team2[index]['Shots']['Points']+= 3;
                                team2[index]['Shots']['3 Pointers']++;
                            }
                        }
                    }
                } else {
                    if(index != -1) {
                        if(activePlayer['Team'] == 1) {
                            team1[index]['Free Throws Made']++;
                        } else {
                            team2[index]['Free Throws Made']++;
                        }
                    }
                }
            });
        } else if(i == 2) {
            buttons[i].innerHTML = 'Miss';
            buttons[i].addEventListener('click', () => {
                removeCircles();
                let index = findPlayerNumber(activePlayer['Team'], activePlayer['Number']);
                if(!freeThrow) {
                    if(index != -1) {
                        if(activePlayer['Team'] == 1) {
                            team1[index]['Shots']['Shots']++;
                            team1[index]['Shots']['Misses']++;
                        } else if(activePlayer['Team'] == 2) {
                            team2[index]['Shots']['Shots']++;
                            team2[index]['Shots']['Misses']++;
                        }
                    }
                } else {
                    if(index != -1) {
                        if(activePlayer['Team'] == 1) {
                            team1[index]['Free Throws Missed']++;
                        } else {
                            team2[index]['Free Throws Missed']++;
                        }
                    }
                }
            });
        }
    }
}

//Checks to see if the place you clicked is valid for 2 or 3 points
let checkFor3Points = (x, y, netNumber) => {
    if(netNumber == 1) {
        let canvasLeft = removePx(canvas.style.left);
        let canvasTop = removePx(canvas.style.top);
        if(x >= canvasLeft && x < canvasLeft + canvas.offsetWidth/10) {
            if(y > canvasTop + canvas.offsetHeight/10 && y < canvasTop + canvas.offsetHeight/10*9) {
                return false;
            } else {
                return true;
            }
        } else if(x >= canvasLeft + canvas.offsetWidth/10 && x < canvasLeft + canvas.offsetWidth/10 + canvas.offsetHeight/2.5) {
            let centerX = canvasLeft + canvas.offsetWidth/10;
            let centerY = canvasTop + canvas.offsetHeight/2;
            if(Math.pow(centerX - x,2) + Math.pow(centerY - y, 2) < Math.pow(canvas.offsetHeight/2.5, 2)) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    } else {
        let canvasRight = removePx(canvas.style.left) + canvas.offsetWidth;
        let canvasTop = removePx(canvas.style.top);
        if(x <= canvasRight && x > canvasRight - canvas.offsetWidth/10) {
            if(y > canvasTop + canvas.offsetHeight/10 && y < canvasTop + canvas.offsetHeight/10*9) {
                return false;
            } else {
                return true;
            }
        } else if(x <= canvasRight - canvas.offsetWidth/10 && x > canvasRight - canvas.offsetWidth/10 - canvas.offsetHeight/2.5) {
            let centerX = canvasRight - canvas.offsetWidth/10;
            let centerY = canvasTop + canvas.offsetHeight/2;
            if(Math.pow(centerX - x,2) + Math.pow(centerY - y, 2) < Math.pow(canvas.offsetHeight/2.5, 2)) {
                return false;
            } else {
                return true;
            }
        }
    }
}


let makePlayerChooser = (x, y) => {
    //creates the playerChooser div upon clicking on the player selector menu
    let div = document.createElement('div');
    div.classList.add('playerChooser');
    div.classList.add('fadeIn');
    //logic to ensure that the div will stay on the canvas and not go off screen
    if(x > window.innerWidth/2) {
        div.style.left = `${x-window.innerWidth/100*(7+20)}px`;
    } else {
        div.style.left = `${x+window.innerWidth/100*(7)}px`;
    }
    let top = y-window.innerHeight/10*2.5
    if(top < window.innerHeight/10) { 
        top = window.innerHeight/10;
    } else if(top > window.innerHeight/100*48) {
        top = window.innerHeight/100*48;
    }
    div.style.top = `${top}px`;
    //appends the child div to the body
    body.appendChild(div);
    //creates and appends new button element to the body that allows the user to exit out of this player menu
    let xButton = document.createElement('button');
    xButton.innerHTML = '&times;';
    xButton.classList.add('xButtons');
    div.appendChild(xButton);
    //adds eventListener and style for the exit button
    xButton.addEventListener('click', () => {
        removePlayerChooser()
    });
    xButton.classList.add('xButtonPlayerChooser');
    let teamObjects = [team1, team2];
    let teamInfoObjects = [team1Info, team2Info];
    //Iterates twice for each team
    for(let i = 0; i < 2; i++) {
        //creates vertical rule (not virtual reality)
        if(i == 1) {
            let vr = document.createElement('div');
            vr.classList.add('playerChooserVr');
            div.appendChild(vr);
        }
        //Makes the divs for each team
        let teamContainer = document.createElement('div');
        teamContainer.classList.add('playerChooserTeamDiv');
        div.appendChild(teamContainer);
        //Adds the text at the top for each team name
        let teamName = document.createElement('p');
        teamName.classList.add('teamContainerTeamName');
        teamName.innerHTML = teamInfoObjects[i]['Name'];
        teamContainer.appendChild(teamName);
        //Adds the div that holds all of the players
        let playerHolder = document.createElement('div');
        playerHolder.classList.add('playerChooserPlayerHolder');
        teamContainer.appendChild(playerHolder);
        //Iterates through the amount of players on the team times
        for(let j = 0; j < teamObjects[i].length; j++) {
            //Makes a div for the player
            let individualPlayerHolder = document.createElement('div');
            individualPlayerHolder.classList.add('playerHolderIndividualPlayerHolder');
            playerHolder.appendChild(individualPlayerHolder);
            //Adds the player's number to the div
            let number = document.createElement('p');
            number.classList.add('playerHolderPlayerNumber');
            number.innerHTML = teamObjects[i][j]['Number'];
            individualPlayerHolder.appendChild(number);
            //Makes a div to store the players' names and positions
            let nameAndPosDiv = document.createElement('div');
            nameAndPosDiv.classList.add('playerHolderNameAndPosDiv');
            individualPlayerHolder.appendChild(nameAndPosDiv);
            //Adds the player's name to the nameAndPosDiv
            let name = document.createElement('p');
            name.classList.add('playerHolderPlayerName');
            name.innerHTML = teamObjects[i][j]['Name'];
            nameAndPosDiv.appendChild(name);
            //Adds the player's position to the nameAndPosDiv
            let position = document.createElement('p');
            position.classList.add('playerHolderPlayerPosition');
            position.innerHTML = teamObjects[i][j]['Position'];
            nameAndPosDiv.appendChild(position);
            //Adds an hr to playerHolder to separate each player
            let hr = document.createElement('hr');
            hr.classList.add('playerHolderHr');
            playerHolder.appendChild(hr);
            //Adds an event listener for when the div holding the player is clicked
            individualPlayerHolder.addEventListener('click', () => {
                //Makes a const variable for the color of the number to see if it changes later
                const oldColor = document.querySelector('.clickOptionsNumber').style.backgroundColor;
                //Removes the player chooser
                div.remove();
                //Updates the color of the button that has the number and team color on it
                let button = document.querySelector('.clickOptionsNumber');
                button.style.backgroundColor = teamInfoObjects[i]['Color'];
                //Changes information of which player is active
                activePlayer['Team'] = i + 1;
                activePlayer['Number'] = teamObjects[i][j]['Number'];
                //Gets the p element inside of the button and changes its text to the correct number
                let p = button.querySelector('p');
                p.innerHTML = teamObjects[i][j]['Number'];
                //Checks to see if the font color is better as white or black
                if(sumOfColors(teamInfoObjects[i]['Color']) < 384) {
                    p.style.color = 'rgb(220, 220, 220)';
                } else {
                    p.style.color = 'black';
                }
                //Checks to see if the team of the player changed
                if(oldColor != teamInfoObjects[i]['Color']) {
                    //Checks to see if the free throw button should be displayed
                    if((activePlayer['Team'] == 1 && ((team1Info['Side'] == 'Left' && whichNetIsCloser(x) == 2) || 
                    (team1Info['Side'] == 'Right' && whichNetIsCloser(x) == 1))) || (activePlayer['Team'] == 2 && 
                    ((team2Info['Side'] == 'Left' && whichNetIsCloser(x) == 2) || (team2Info['Side'] == 'Right' && 
                    whichNetIsCloser(x) == 1)))) {
                        //Creates a free throw button
                        let button = document.createElement('div');
                        button.classList.add('clickOptions');
                        let distance = (window.innerWidth/100*3)*1.62037037;
                        let xChange = distance/(1+Math.sqrt(3));
                        let yChange = xChange * Math.sqrt(3);
                        //Changes root properties for the @keyframes animation
                        root.style.setProperty('--circleAnimationDistance', `${distance}px`);
                        root.style.setProperty('--circleAnimationDistanceX', `${xChange}px`);
                        root.style.setProperty('--circleAnimationDistanceY', `${yChange}px`);
                        //Gives the button its properties based on the (x,y) parameters of this function
                        button.style.left = `${x - xChange - window.innerWidth/100*1.5}px`;
                        button.style.top = `${y + yChange - window.innerWidth/100*1.5}px`;
                        button.classList.add(`clickOptionsIn${i}`);
                        button.innerHTML = 'Free Throw';
                        button.addEventListener('click', () => {
                            //Calls the function that makes the buttons display 'score' or 'miss' 
                            //{true} parameter is true if the button clicked was free throw and false otherwise
                            shotButton(x, y, true);
                        });
                        //Appends the button to the body
                        body.appendChild(button);
                    //If free throw is an option where it shouldnt be, remove it. 
                    } else if(document.querySelectorAll('.clickOptions').length == 6) {
                        document.querySelectorAll('.clickOptions')[5].remove();
                    }
                }
            });
        }
    }
}

//Checks to see if white text or black text is better with a color
let sumOfColors = (color) => {
    let array = color.split(/[,()]/);
    array.splice(0,1);
    array.splice(array.length-1,1);
    let sum = 0;
    for(let i = 0; i < 3; i++) {
        sum += parseInt(array[i]);
    }
    return sum;
}

//Checks to see which side net is closer to where you clicked
let whichNetIsCloser = (x) => {
    if(window.innerWidth/2 > x) {
        return 1;
    } else {
        return 2;
    }
}

//Changes the font size for buttons whose text is too long
let checkForButton = (button) => {
    if(button.innerText == 'Rebound') {
        button.style.fontSize = '0.6rem';
    }
}

{ //Team boxes being clicked
    let teamBoxCurrentlyAnimating = false;
    let teams = document.querySelectorAll('.team')
    teams.forEach(team => {
        team.addEventListener('animationend', () => {
            teamBoxCurrentlyAnimating = false;
        }); 
        team.addEventListener('click', () => {
            if((team.classList.contains('teamSlideOutRight') || team.classList.contains('teamSlideOutLeft')) && teamBoxCurrentlyAnimating == false) {
                if(team.id == 'team1') {
                    activeScreen = 'playerScreen';
                    team.classList.remove('teamSlideOutLeft')
                    team.classList.add('teamSlideInLeft')
                    setTimeout(() => {
                        team.classList.remove('teamSlideInLeft');
                    },500);
                }
                if(team.id == 'team2') {
                    activeScreen = 'playerScreen';
                    team.classList.remove('teamSlideOutRight');
                    team.classList.add('teamSlideInRight');
                    setTimeout(() => {
                        team.classList.remove('teamSlideInRight');
                    },500);
                }
                removeCircles();
            } else {
                return;
            }       
        });
    });
}

{ //Reset All Stats Buttons
    let buttons = document.querySelectorAll('.resetAllStats');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if(button.id.endsWith('1')) {
                for(let i = 0; i < team1.length; i++) {
                    team1[i]['Shots'] = {
                        'Shots': 0,
                        'Misses': 0,
                        'Scores': 0,
                        'Points': 0,
                        '2 Pointers': 0,
                        '3 Pointers': 0
                    }
                    team1[i]['Fouls'] = 0;
                    team1[i]['Steals'] = 0;
                    team1[i]['Rebounds'] = 0;
                    team1[i]['Free Throws Made'] = 0;
                    team1[i]['Free Throws Missed'] = 0;
                }
            } else if(button.id.endsWith('2')) {
                for(let i = 0; i < team2.length; i++) {
                    team2[i]['Shots'] = {
                        'Shots': 0,
                        'Misses': 0,
                        'Scores': 0,
                        'Points': 0,
                        '2 Pointers': 0,
                        '3 Pointers': 0
                    }
                    team2[i]['Fouls'] = 0;
                    team2[i]['Steals'] = 0;
                    team2[i]['Rebounds'] = 0;
                    team2[i]['Free Throws Made'] = 0;
                    team2[i]['Free Throws Missed'] = 0;
                }
            }
        });
    });
}

//Brings both team boxes back into the middle of the screen
let bringBothTeamsBack = () => {
    let box1 = document.getElementById('team1');
    let box2 = document.getElementById('team2');
    activeScreen = 'playerScreen';
    box1.classList.remove('teamSlideOutLeft');
    box1.classList.add('teamSlideInLeft');
    box2.classList.remove('teamSlideOutRight');
    box2.classList.add('teamSlideInRight');
    setTimeout(() => {
        box1.classList.remove('teamSlideInLeft');
        box2.classList.remove('teamSlideInRight');
    },500);
}

//Finds the index in the team arrays of which player has which number
let findPlayerNumber = (teamNum, playerNum) => {
    if(teamNum == 1) {
        for(let i = 0; i < team1.length; i++) {
            if(team1[i]['Number'] == playerNum) {
                return i;
            }
        }
    } else if(teamNum == 2) {
        for(let i = 0; i < team2.length; i++) {
            if(team2[i]['Number'] == playerNum) {
                return i;
            }
        }
    }
    return -1;
}

//When the Team Stats button is clicked, it brings in the team stats menu
let toggleTeamStats = () => {
    removeCircles()
    let screenIds = ["switchTeamsButton","teamNameLeftp","teamNameRightp"];
    {
        let divs = document.querySelectorAll('.teamStatsPlayerHolder');
        divs.forEach(div => {
            div.innerHTML = '';
        });
    }

    let team1Box = document.getElementById('team1');
    let team2Box = document.getElementById('team2');

    let statsContainer = document.getElementById("teamStatsContainer");

    colorOptionsOpen = [false,false];
    
    teamBoxCurrentlyAnimating = true;
    team1Box.classList.add('teamSlideOutLeft');
    team2Box.classList.add('teamSlideOutRight');

    
    if(canvas.classList.contains('canvasSlideDown')) {
        activeScreen = 'courtScreen';
        canvas.classList.remove('canvasSlideDown');
        setTimeout(() => {
            canvas.classList.add('canvasSlideInUp');
        });
    } else {
        activeScreen = 'statsScreen';
        canvas.classList.remove('canvasSlideInUp');
        setTimeout(() => {
            canvas.classList.add('canvasSlideDown');
        });
    }
    
    for(let i = 0; i<screenIds.length; i++){
        document.getElementById(screenIds[i]).classList.toggle('canvasSlideDown')
    }

    
    for(let i = 0; i<screenIds.length; i++){
        document.getElementById(screenIds[i]).classList.toggle('canvasSlideInUp')
    }
    
    if(statsContainer.dataset.active == "closed") {
        statsContainer.classList.remove('canvasSlideDown');
        setTimeout(() => {
            statsContainer.style.zIndex = '99999';
            statsContainer.classList.add('canvasSlideInUp');
            statsContainer.style.display = 'flex'
        })
        statsContainer.dataset.active = "open"
    } else if (statsContainer.dataset.active == "open") {
        statsContainer.classList.remove('canvasSlideInUp');
        setTimeout(() => {
            statsContainer.style.zIndex = '0';
            statsContainer.classList.add('canvasSlideDown');
            setTimeout(() => {
                statsContainer.style.display = 'none';
            }, 500);
        })
        statsContainer.dataset.active = "closed" 
    }
    
    let playerHolders = document.querySelectorAll('.teamStatsPlayerHolder');
    for(let i = 0; i < 2; i++) {
        let holder = playerHolders[i];
        let h1 = document.querySelectorAll('.teamStats')[i].querySelector('h1');
        let obj;
        if(i == 0) {
            h1.innerHTML = team1Info['Name'];
            obj = [...team1];
        } else {
            h1.innerHTML = team2Info['Name'];
            obj = [...team2];
        }

        for(let j = 0; j < obj.length; j++) {
            let playerDiv = document.createElement('div');
            playerDiv.classList.add('teamStatsPlayer');
            holder.appendChild(playerDiv);

            let div = document.createElement('div');
            div.classList.add('playerInfoHolder');
            playerDiv.appendChild(div);

            let number = document.createElement('p');
            number.classList.add('teamStatsPlayerNumber');
            number.innerHTML = obj[j]['Number'];
            div.appendChild(number);

            let posDiv = document.createElement('div');
            posDiv.classList.add('teamStatsNameAndPosDiv');
            div.appendChild(posDiv);

            let name = document.createElement('p');
            name.classList.add('teamStatsPlayerName');
            name.innerHTML = obj[j]['Name'];
            posDiv.appendChild(name);

            let position = document.createElement('p');
            position.classList.add('teamStatsPlayerPosition');
            position.innerHTML = obj[j]['Position'];
            posDiv.appendChild(position);

            let statsDiv = document.createElement('div');
            statsDiv.classList.add('playerStatsStatsDiv');
            playerDiv.appendChild(statsDiv);

            let statsP = document.createElement('p');
            let text = `Shots: ${obj[j]['Shots']['Shots']}\nScored: ${obj[j]['Shots']['Scores']}\nMissed: ${obj[j]['Shots']['Misses']}`;
            statsP.innerText = text + `\nPoints: ${obj[j]['Shots']['Points']}\n2 Pointers: ${obj[j]['Shots']['2 Pointers']}\n3 Pointers: ${obj[j]['Shots']['3 Pointers']}`;
            statsDiv.appendChild(statsP);

            let otherStatsP = document.createElement('p');
            let otherText = `Fouls: ${obj[j]['Fouls']}\nSteals: ${obj[j]['Steals']}\nRebounds: ${obj[j]['Rebounds']}\nFree Throws`;
            otherStatsP.innerText = otherText + `\n   Made: ${obj[j]['Free Throws Made']}\n   Missed: ${obj[j]['Free Throws Missed']}`;
            statsDiv.appendChild(otherStatsP);
        }
    }
}

//Removes 'px' from the end of a string and makes it a float
let removePx = (str) => {
    return parseFloat(str.substring(0,str.length-2));
}

//Brings you to ESPN.com when you click on the Upcoming Games button
//Most useless function of them all
let openUpcomingGames = () => { window.open("https://www.espn.com/nba/schedule", "ESPN"); }