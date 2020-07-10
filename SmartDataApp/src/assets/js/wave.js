const HSL = {
 hue: 213,
  saturation: 100,
  lightness: 50,
};
let FPS_LIMIT = 60;

let last = performance.now() / 1000;
let fpsThreshold = 0;

(function() {
  const pi = Math.PI;
  const pi2 = 2 * Math.PI;

  this.Waves = function(holder, options) {
    const Waves = this;

    Waves.options = extend(options || {}, {
      resize: false,
      rotation: 45,
      waves: 5,
      width: 100,
      hue: [11, 14],
      amplitude: 0.5,
      background: true,
      preload: true,
      speed: [0.004, 0.008],
      debug: false
    });

    Waves.waves = [];
    Waves.holder = document.querySelector(holder);
    Waves.canvas = document.createElement("canvas");
    Waves.ctx = Waves.canvas.getContext("2d");
    Waves.holder.appendChild(Waves.canvas);

    Waves.hue = HSL.hue;
    Waves.hueFw = true;
    Waves.stats = new Stats();

    Waves.resize();
    Waves.init(Waves.options.preload);

    if (Waves.options.resize)
      window.addEventListener(
        "resize",
        function() {
          Waves.resize();
        },
        false
      );
  };

  Waves.prototype.init = function(preload) {
    const Waves = this;
    const options = Waves.options;

    for (let i = 0; i < options.waves; i++) Waves.waves[i] = new Wave(Waves);

    if (preload) Waves.preload();
  };

  Waves.prototype.preload = function() {
    const Waves = this;
    const options = Waves.options;

    for (let i = 0; i < options.waves; i++) {
      Waves.updateColor();
      for (let j = 0; j < options.width; j++) {
        Waves.waves[i].update();
      }
    }
  };

  Waves.prototype.render = function() {
    const Waves = this;
    const ctx = Waves.ctx;
    const options = Waves.options;

    Waves.updateColor();
    Waves.clear();

    if (Waves.options.debug) {
      ctx.beginPath();
      ctx.strokeStyle = "#f00";
      ctx.arc(Waves.centerX, Waves.centerY, Waves.radius, 0, pi2);
      ctx.stroke();
    }

    if (Waves.options.background) {
      Waves.background();
    }

    each(Waves.waves, function(wave, i) {
      wave.update();
      wave.draw();
    });
  };

  Waves.prototype.animate = function() {
    const Waves = this;

    window.requestAnimationFrame(Waves.animate.bind(Waves));

    var now = performance.now() / 1000;
    var dt = Math.min(now - last, 1);
    last = now;

    if (FPS_LIMIT > 0) {
      fpsThreshold += dt;
      if (fpsThreshold < 1.0 / FPS_LIMIT) {
        return;
      }
      fpsThreshold -= 1.0 / FPS_LIMIT;
    }

    Waves.render();
  };

  Waves.prototype.clear = function() {
    const Waves = this;
    Waves.ctx.clearRect(0, 0, Waves.width, Waves.height);
  };

  Waves.prototype.background = function() {
    const Waves = this;
    const ctx = Waves.ctx;

    const gradient = Waves.ctx.createLinearGradient(0, 0, 0, Waves.height);
    gradient.addColorStop(0, "#000");
    gradient.addColorStop(1, Waves.color);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, Waves.width, Waves.height);
  };

  Waves.prototype.resize = function() {
    const Waves = this;
    const width = Waves.holder.offsetWidth;
    const height = Waves.holder.offsetHeight - 2;
    Waves.scale = window.devicePixelRatio || 1;
    Waves.width = width * Waves.scale;
    Waves.height = height * Waves.scale;
    Waves.canvas.width = Waves.width;
    Waves.canvas.height = Waves.height;
    Waves.canvas.style.width = width + "px";
    Waves.canvas.style.height = height + "px";
    Waves.radius =
      Math.sqrt(Math.pow(Waves.width, 2) + Math.pow(Waves.height, 2)) / 2;
    Waves.centerX = Waves.width / 2;
    Waves.centerY = Waves.height / 2;
    //Waves.radius /= 2; // REMOVE FOR FULLSREEN
  };

  Waves.prototype.updateColor = function() {
    const Waves = this;

    // Waves.hue += Waves.hueFw ? 0.01 : -0.01;

    // if (Waves.hue > Waves.options.hue[1] && Waves.hueFw) {
    //   Waves.hue = Waves.options.hue[1];
    //   Waves.Waves = false;
    // } else if (Waves.hue < HSL.hue && !Waves.hueFw) {
    //   Waves.hue = HSL.hue;
    //   Waves.Waves = true;
    // }

    // const a = Math.floor(127 * Math.sin(0.3 * Waves.hue + 0) + 128);
    // const b = Math.floor(127 * Math.sin(0.3 * Waves.hue + 2) + 128);
    // const c = Math.floor(127 * Math.sin(0.3 * Waves.hue + 4) + 128);

    Waves.color = `hsla(${HSL.hue}, ${HSL.saturation}%, ${
      HSL.lightness
    }%, 0.1)`;
  };

  function Wave(Waves) {
    const Wave = this;
    const speed = Waves.options.speed;

    Wave.Waves = Waves;
    Wave.Lines = [];

    Wave.angle = [rnd(pi2), rnd(pi2), rnd(pi2), rnd(pi2)];

    Wave.speed = [
      rnd(speed[0], speed[1]) * rnd_sign(),
      rnd(speed[0], speed[1]) * rnd_sign(),
      rnd(speed[0], speed[1]) * rnd_sign(),
      rnd(speed[0], speed[1]) * rnd_sign()
    ];

    return Wave;
  }

  Wave.prototype.update = function() {
    const Wave = this;
    const Lines = Wave.Lines;
    const color = Wave.Waves.color;

    Lines.push(new Line(Wave, color));

    if (Lines.length > Wave.Waves.options.width) {
      Lines.shift();
    }
  };

  Wave.prototype.draw = function() {
    const Wave = this;
    const Waves = Wave.Waves;

    const ctx = Waves.ctx;
    const radius = Waves.radius;
    const radius3 = radius / 3;
    const x = Waves.centerX;
    const y = Waves.centerY;
    const rotation = dtr(Waves.options.rotation);
    const amplitude = Waves.options.amplitude;
    const debug = Waves.options.debug;

    const Lines = Wave.Lines;

    each(Lines, function(line, i) {
      if (debug && i > 0) return;

      const angle = line.angle;

      const x1 = x - radius * Math.cos(angle[0] * amplitude + rotation);
      const y1 = y - radius * Math.sin(angle[0] * amplitude + rotation);
      const x2 = x + radius * Math.cos(angle[3] * amplitude + rotation);
      const y2 = y + radius * Math.sin(angle[3] * amplitude + rotation);
      const cpx1 = x - radius3 * Math.cos(angle[1] * amplitude * 2);
      const cpy1 = y - radius3 * Math.sin(angle[1] * amplitude * 2);
      const cpx2 = x + radius3 * Math.cos(angle[2] * amplitude * 2);
      const cpy2 = y + radius3 * Math.sin(angle[2] * amplitude * 2);

      ctx.strokeStyle = debug ? "#fff" : line.color;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
      ctx.stroke();

      if (debug) {
        ctx.strokeStyle = "#fff";
        ctx.globalAlpha = 0.3;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(cpx1, cpy1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(cpx2, cpy2);
        ctx.stroke();

        ctx.globalAlpha = 1;
      }
    });
  };

  function Line(Wave, color) {
    const Line = this;

    const angle = Wave.angle;
    const speed = Wave.speed;

    Line.angle = [
      Math.sin((angle[0] += speed[0])),
      Math.sin((angle[1] += speed[1])),
      Math.sin((angle[2] += speed[2])),
      Math.sin((angle[3] += speed[3]))
    ];

    Line.color = color;
  }

  function Stats() {
    this.data = [];
  }

  Stats.prototype.time = function() {
    return (performance || Date).now();
  };

  Stats.prototype.log = function() {
    if (!this.last) {
      this.last = this.time();
      return 0;
    }

    this.new = this.time();
    this.delta = this.new - this.last;
    this.last = this.new;

    this.data.push(this.delta);
    if (this.data.length > 10) this.data.shift();
  };

  Stats.prototype.fps = function() {
    const fps = 0;
    each(this.data, function(data, i) {
      fps += data;
    });

    return Math.round(1000 / (fps / this.data.length));
  };

  function each(items, callback) {
    for (let i = 0; i < items.length; i++) {
      callback(items[i], i);
    }
  }

  function extend(options, defaults) {
    for (let key in options)
      if (defaults.hasOwnProperty(key)) defaults[key] = options[key];
    return defaults;
  }

  function dtr(deg) {
    return (deg * pi) / 180;
  }

  function rtd(rad) {
    return (rad * 180) / pi;
  }

  function diagonal_angle(w, h) {
    const a = Math.atan2(h, w) * 1.27325;
    return a;
  }

  function rnd(a, b) {
    if (arguments.length == 1) return Math.random() * a;
    return a + Math.random() * (b - a);
  }

  function rnd_sign() {
    return Math.random() > 0.5 ? 1 : -1;
  }
})();

let rendered = false;

window.wallpaperPropertyListener = {
  applyUserProperties: function({ hue, saturation, lightness }) {
    
    if (hue) HSL.hue = hue.value;
    if (saturation) HSL.saturation = saturation.value;
    if (lightness) HSL.lightness = lightness.value;

     
  },
  applyGeneralProperties: function(properties) {
    if (properties.fps) {
      FPS_LIMIT = properties.fps;
    }
  }
};