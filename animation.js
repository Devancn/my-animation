export class Timeline {
    constructor() {
        this.animations = []
    }
    tick() {
        let t = Date.now() - this.startTime;
        for (let animation of this.animations) {
            if (t > animation.duration + animation.delay) {
                continue;
            }
            let { object, property, start, end, delay, template, duration, timingFunction } = animation;

            let progression = timingFunction((t - delay) / duration) // 0-1之间的数(比分比)

            let value = start + progression * (end - start); // value就是根据progression算出的当前值

            object[property] = template(value);
        }
        requestAnimationFrame(() => this.tick())
    }

    start() {
        this.startTime = Date.now();
        this.tick();
    }

    add(animation) {
        this.animations.push(animation);
    }
}

export class Animation {
    constructor(object, template, property, start, end, duration, delay, timingFunction) {
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

