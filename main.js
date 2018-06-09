enchant();

window.onload = function() {
    let game = new Game(320, 320);
    game.fps = 20;
    game.ups = 10;
    game.preload('chara.png', 'map.png');
    const WIDTH = 8;
    const HEIGHT = 8;
    const MAX_X = 32 * 7;
    const MAX_Y = 32 * 7;
    function random_pos() {
        let r = Math.random() * 10;
        return r % 8;
    }
    const MAP_DATA = [
        [2, 3, 3, 3, 3, 3, 3, 0],
        [2, 2, 1, 0, 0, 0, 0, 0],
        [2, 1, 1, 1, 1, 0, 0, 0],
        [2, 2, 1, 1, 1, 0, 3, 0],
        [2, 2, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 2],
        [2, 1, 1, 1, 1, 1, 1, 4],
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
    game.onload = function() {
        let map = new Map(32, 32);
        map.image = game.assets['map.png'];
        map.loadData(MAP_DATA);
        let player = new Sprite(32, 32);
        player.isMoving = false;
        player.x = 0;
        player.y = 0;
        player.count = 0;
        player.addEventListener('enterframe', function() {
            player.count += 1;
            dx = 0; dy = 0;
            if (game.input.left) {
                dx -= INPUT_DV;
            } else if (game.input.right) {
                dx += INPUT_DV;
            } else if (game.input.up) {
                dy -= INPUT_DV;
            } else if (game.input.down) {
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
        });
        player.image = game.assets['chara.png'];
        let apple = new Sprite(32, 32);

        let stage = new Group();
        stage.addChild(map);
        stage.addChild(player);
        game.rootScene.addChild(stage);
    };
    game.start();
};
