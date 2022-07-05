const metalGear = new Audio ("audio/metalgear.mp3")
const ak = new Audio ("audio/ak.wav")
const reload = new Audio ("audio/reload.mp3")

const buttonHandler = function () {
    $('#start-btn').on('click', () => {
        $('#start-btn').remove();
        $('#gun').append('<img id="ak" class="selectDisable" src="images/ak.png"/>');
        $('#rules').remove(); 
        metalGear.play();
        init();
    });
}

const init = function () { // Run game screen 
    game.lvl1(); 

}

const game = { 
    time: 30,
    level: 1, 
    hp: 10,
    ammo: 9,
    score: 0,
    enemies: 0, 
    updateUI() {
        $('.player-info').html(`<div> Health: ${game.hp} <img style ="width: 5%; height: 5%;" src="https://img.icons8.com/color/50/000000/heart-puzzle.png">
        Ammo: ${game.ammo} <img style="width: 5%; height: 5%;" src="https://img.icons8.com/color/48/000000/bullet.png"></div>`);
    },
    shooting() {
        $('#screen').on('click', function (){
            ak.play();
            game.ammo--;
            game.updateUI();
            if (game.ammo === 0) {
                $('#screen').prepend('<div id="reload-text"/>');
                $('#reload-text').text("Press 'R' to Reload");
               
                $('body').css('pointer-events', 'none');
               
                $('body').on('keypress', function(e) {
                    if (e.which == 114) {
                        event.preventDefault();
                        reload.play();
                        game.ammo = 8;
                        game.updateUI();
                        $('body').css('pointer-events', '');
                        $('#reload-text').remove();
                    }
                });
            };
        });
        $('.spawn').on('click', function(e) { //shooting
            if ($(e.target).is('img')) {
                $(e.target).remove(); 
                game.enemies--;
                game.score += 100; 
                $('.score').text(`Score: ${game.score}`);
            }
        });
    },
    lvl1() {
        $('#screen').attr('class', 'screen--start');
        $('#screen').prepend(`<div id="time">${game.time}</div>`);
        $('.ui').css('display', 'block');
        this.shooting();
        this.setTime();
        // this.scoring();
    },
    setTime() {
        const timer = setInterval(function() {
            console.log(game.time);
            game.time--;
            $('#time').text(`${game.time}`);
            
            if (game.enemies < 5 && game.hp >= 1) { 
                game.spawnBaddies(); 
            }

            if (game.time === 0 || game.hp < 1) {
                $('body').css('pointer-events', 'none');
                clearInterval(timer);
                game.winLose(); 
                // call winLose();
            }
        }, 1000);
    },
    spawnBaddies() {
        let rand = Math.floor(Math.random() * 5);
        let t = null; 

        if ($('#spawn-' + rand).children().length === 0 && game.hp > 0) { 
            if (rand === 3 || rand === 4) {
                $('#spawn-' + rand).prepend('<img class="enemy-w selectDisable" src="images/enemylvl1-w.png">');
            } else {
                $('#spawn-' + rand).prepend('<img class="enemy selectDisable" src="images/enemylvl1.png">'); 
            };
            
            $('#spawn-' + rand).each(function(){                    
                $('#spawn-' + rand).on('click', function() {
                    clearTimeout(t);
                }); 

                if (t !== null || game.hp < 1 || game.time < 1 ) {
                    clearTimeout(t);
                    return;
                };

                t = setTimeout(function() {
                    if (rand === 3 || rand === 4) {
                        $('#spawn-' + rand).children().attr('src', 'images/enemylvl1-shoot-w.png');
                    } else {
                        $('#spawn-' + rand).children().attr('src', 'images/enemylvl1-shoot.png');
                    }
                    if (game.hp) {game.hit()};
                    $('.score').text(`Score: ${game.score}`);
                    console.log(game.hp + '<--- hp');
                }, 1400);

            });
        } else {
            return null;
        }
    },
    hit(){
        if (game.hp < 1){
            return;
        } else {
            $('#overlay').css('display', 'block');
            game.hp--; 
            game.score -= 50;
            game.updateUI();
            setTimeout(function() {
                $('#overlay').fadeOut();
            }, 120)
        }
    },
    winLose(){
        $('img').remove();
        $('#reload-text').remove();
        $('.player-info').hide();
        if (game.score >= 1200 && game.hp > 0) {
            $('#overlay-2').css('background-color', 'rgb(33, 100, 223)');
            $('#overlay-2').css('display', 'block');
            $('#death-text').text('VOCÊ GANHOU PARABÉNS!');       
            $('#death-text').css('display', 'block');
            $('#death-text2').css('display', 'block');    
        } else { 
            $('#overlay-2').css('display', 'block');
            $('#death-text').css('display', 'block');
            $('#death-text2').css('display', 'block')
        }
        this.refresh();
    },
    refresh(){
        $('#reload-text').css('display', 'none');
        $('body').on('keypress', function(e) {
            if (e.which === 32) {
                metalGear.pause();
                location.reload();
            }
        });
    }
}

 
buttonHandler();
