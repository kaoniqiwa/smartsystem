class HWSPlayer {
 
    constructor(elementId, url, name) {
       this.player = new WSPlayer({
            elementId: elementId
        });
        this. player.url = url;
        this.player.name = name;
    }

    stop() {
        this.player.stop();
    }

    fullScreen() {
        this.player.fullScreen();
    }

    pause() {
        this.player.pause();
    }

    resume() {
        this.player.resume();
    }

    fast() {
        this.player.fast();
    }
    slow() {
        this.player.slow();
    }

    getPicture() {
        this.player.capturePicture();
    }

    frame() {
        this.player.frame();
    }
}

exports.HWSPlayer = HWSPlayer; 