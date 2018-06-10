enchant();

let XorShift = function (seed = 88675123) {
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    this.w = seed;
    console.log(this.w);
};
XorShift.prototype.next = function () {
    let t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w ^= (this.w >>> 19) ^ t ^ (t >>> 8);
    return this.w;
};
XorShift.prototype.range = function (l, r) {
    let range = r - l;
    return Math.abs(this.next()) % range + l;
};
window.onload = function() {
    let game = new Game(320, 320);
    game.fps = 20;
    game.ups = 10;
    game.preload('chara.png', 'map.png', 'apple.png');
    const WIDTH = 8;
    const HEIGHT = 8;
    const MAX_X = 32 * 7;
    const MAX_Y = 32 * 7;
    const SEED = null;
    let rng = new XorShift(Math.floor(SEED ? SEED: Math.random() * 1000000000));
    function random_pos() {
        return rng.range(0, 32 * 7);
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
    const WATER_X = [0, 1, 0, -1, 10000];
    const WATER_Y = [-1, 0, 1, 0, 10000];
    const INPUT_DV = 4;
    const TOUCH_THRESHOLD = 10;
    const APPLE_THRESHOLD = 12;
    let startX = null;
    let startY = null;
    let touched = new Array();
    game.rootScene.addEventListener('touchstart', function(e) {
        startX = e.x;
        startY = e.y;
    });
    game.rootScene.addEventListener('touchmove', function(e) {
        if (startX) {
            touched["R"] = e.x - startX > TOUCH_THRESHOLD;
            touched["L"] = startX - e.x > TOUCH_THRESHOLD;
        }
        if (startY) {
            touched["D"] = e.y - startY > TOUCH_THRESHOLD;
            touched["U"] = startY - e.y > TOUCH_THRESHOLD;
        }
    });
    game.rootScene.addEventListener('touchend', function(e) {
        for (let val of touched.values()) val = false;
    });
    Player = enchant.Class.create(Sprite, {
        initialize: function() {
            let game = enchant.Game.instance;
            Sprite.call(this, 32, 32);
            this.image = game.assets['chara.png'];
            this.x = 0;
            this.y = 0;
            this.count = 0;
            this.addEventListener('enterframe', function() {
                this.count += 1;
                let dx = 0;
                let dy = 0;
                if (game.input.left || touched["L"]) {
                    dx -= INPUT_DV;
                } else if (game.input.right || touched["R"]) {
                    dx += INPUT_DV;
                } else if (game.input.up || touched["U"]) {
                    dy -= INPUT_DV;
                } else if (game.input.down || touched["D"]) {
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
    Apple.prototype.reset = function () {
        this.x = random_pos();
        this.y = random_pos();
    };
    game.onload = function() {
        let map = new Map(32, 32);
        map.image = game.assets['map.png'];
        map.loadData(MAP_DATA);
        let player = new Player();
        let apple = new Apple();
        apple.reset();
        apple.addEventListener('enterframe', function() {
            if (player.within(this, APPLE_THRESHOLD)) {
                apple.reset();
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
