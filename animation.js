export class Timeline {
    constructor() {
        this.animations = [];
        this.requestID = null;
        this.state = "inited";
        this.tick = () => {
            let t = Date.now() - this.startTime;
            let animations = this.animations.filter(animation => !animation.finished);
            for (let animation of this.animations) {

                let { object, property, template, start, end, duration, timingFunction, delay, startTime } = animation;

                let progression = timingFunction((t - delay - startTime) / duration) // 0-1之间的数(比分比)

                if (t > duration + delay + startTime) {
                    progression = 1;
                    animation.finished = true;
                }

                let value = start + progression * (end - start); // value就是根据progression算出的当前值

                object[property] = template(value);
            }
            if (animations.length)
                this.requestID = requestAnimationFrame(this.tick)

        }
    }

    pause() {
        if (this.state !== "playing")
            return
        this.state = "paused";
        this.pauseTime = Date.now();
        if (this.requestID !== null) {
            cancelAnimationFrame(this.requestID)
        }
    }

    resume() {
        if (this.state !== "paused")
            return
        this.state = "playing";
        this.startTime += Date.now() - this.pauseTime;
        this.tick();
    }

    start() {
        if (this.state !== "inited")
            return
        this.state = "playing";
        this.startTime = Date.now();
        this.tick();
    }

    restart() {
        if (this.state === "playing")
            this.pause();
        this.animations = [];
        this.requestID = null;
        this.state = "playing";
        this.startTime = Date.now();
        this.pauseTime = null;
        this.tick();
    }

    add(animation, startTime) {
        this.animations.push(animation);
        animation.finished = false;
        if (this.state === "playing")
            animation.startTime = startTime !== void 0 ? startTime : Date.now() - this.startTime;
        else
            animation.startTime = startTime !== void 0 ? startTime : 0;
    }
}

export class Animation {
    constructor(object, property, template, start, end, duration, delay, timingFunction) {
        this.object = object;
        this.template = template;
        this.property = property;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay || 0;
        this.timingFunction = timingFunction;
        // ease linear easeIn easeOut
    }
}

