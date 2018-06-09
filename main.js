enchant();

window.onload = function() {
    let game = new Game(320, 320);
    game.fps = 20;
    game.ups = 10;
    game.preload('chara.png', 'map.png', 'apple.png');
    const WIDTH = 8;
    const HEIGHT = 8;
    const MAX_X = 32 * 7;
    const MAX_Y = 32 * 7;
    function random_pos() {
        return ((Math.random() * 10) % 8) * 32;
    }
    const MAP_DATA = [
        [2, 3, 3, 3, 3, 3, 3, 0],
        [2, 2, 1, 0, 0, 0, 0, 0],
        [2, 1, 1, 1, 1, 0, 0, 0],
        [2, 2, 1, 1, 1, 0, 3, 0],
        [2, 2, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 2],
        [1, 1, 1, 1, 1, 1, 1, 4],
    ];
    let map_id = function (x, y) {
        let to_idx = function (i) {
            return Math.floor((i + 16) / 32);
        };
        return MAP_DATA[to_idx(y)][to_idx(x)];
    };
    const WATER_X = [0, 1, 0, -1, 100];
    const WATER_Y = [-1, 0, 1, 0, 100];
    const INPUT_DV = 4;
    let startX = null;
    let startY = null;
    let touchR = false;
    let touchL = false;
    let touchU = false;
    let touchD = false;
    let touch_init = function() {
        touchR = false;
        touchL = false;
        touchU = false;
        touchD = false;
    };
    game.rootScene.addEventListener('touchstart', function(e) {
        startX = e.x;
        startY = e.y;
    });
    game.rootScene.addEventListener('touchmove', function(e) {
        touch_init();
        if (startX) {
            if (e.x - startX > 10.0) {
                touchR = true;
            }
            if (startX - e.x > 10.0) {
                touchL = true;
            }
        }
        if (startY) {
            if (e.y - startY > 10.0) {
                touchD = true;
            }
            if (startY - e.y > 10.0) {
                touchU = true;
            }
        }
    });
    game.rootScene.addEventListener('touchend', function(e) {
        touch_init();
    });
    Player = enchant.Class.create(Sprite, {
        initialize: function() {
            let game = enchant.Game.instance;
            Sprite.call(this, 32, 32);
            this.image = game.assets['chara.png'];
            this.isMoving = false;
            this.x = 0;
            this.y = 0;
            this.count = 0;
            this.addEventListener('enterframe', function() {
                this.count += 1;
                let dx = 0;
                let dy = 0;
                if (game.input.left || touchL) {
                    dx -= INPUT_DV;
                } else if (game.input.right || touchR) {
                    dx += INPUT_DV;
                } else if (game.input.up || touchU) {
                    dy -= INPUT_DV;
                } else if (game.input.down || touchD) {
                    dy += INPUT_DV;
                }
                let id = map_id(this.x, this.y);
                this.x += WATER_X[id];
                this.y += WATER_Y[id];
                this.moveBy(dx, dy);
                this.x = Math.max(0, this.x);
                this.y = Math.max(0, this.y);
                this.x = Math.min(this.x, MAX_X);
                this.y = Math.min(this.y, MAX_Y);
            })
        }
    });
    Apple = enchant.Class.create(Sprite, {
        initialize: function () {
            let game = enchant.Game.instance;
            Sprite.call(this, 32, 32);
            this.image = game.assets['apple.png'];
        }
    });
    game.onload = function() {
        let map = new Map(32, 32);
        map.image = game.assets['map.png'];
        map.loadData(MAP_DATA);
        let player = new Player();
        let apple = new Apple();
        apple.x = random_pos();
        apple.y = random_pos();
        apple.addEventListener('enterframe', function() {
            if (player.within(this, 8)) {
                this.x = random_pos();
                this.y = random_pos();
            }
        });
        let stage = new Group();
        stage.addChild(map);
        stage.addChild(player);
        stage.addChild(apple);
        game.rootScene.addChild(stage);
    };
    game.start();
};
