const BUTTONS_ROTATE_SPEED = 100;
const BUTTONS_GO_SPEED = 0.02;

/** 
 * Helper for smooth camera control
 */
export default class Navigation {
    /**
     * @param {Camera} camera
     */
    constructor(camera) {
        this.camera = camera;
        this.state = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false,
            rotateX: 0,
            rotateY: 0
        };

        this.update = this.update.bind(this);
    }

    /**
     * @func Stop updating camera
     */
    goStop() {
        this.state.forward = false;
        this.state.backward = false;
        this.state.left = false;
        this.state.right = false;
        this.state.up = false;
        this.state.down = false;
        this.state.rotateX = 0;
        this.state.rotateY = 0;
    }

    /**
     * @func Start moving camera forward 
     */
    goForward() {
        this.state.forward = true;
    }

    /**
     * @func Start moving camera backward 
     */
    goBackward() {
        this.state.backward = true;
    }

    /**
     * @func Start rotating camera left 
     */
    goLeft() {
        this.state.left = true;
    }

    /**
     * @func Start rotating camera right
     */
    goRight() {
        this.state.right = true;
    }

    /**
     * @func Start rotating camera up
     */
    goUp() {
        this.state.up = true;
    }

    /**
     * @func Start rotating camera down
     */
    goDown() {
        this.state.down = true;
    }

    /**
     * @func Change rotate camera speed
     */
    rotate(speedX, speedY) {
        this.state.rotateX = speedX || 0;
        this.state.rotateY = speedY || 0;
    }

    /**
     * @func Update camera
     * @example env.addLoop(navigation.update);
     */
    update() {
        if (this.state.forward) {
            this.camera.go(BUTTONS_GO_SPEED);
        } else if (this.state.backward) {
            this.camera.go(-BUTTONS_GO_SPEED);
        } else if (this.state.left) {
            this.camera.rotate(BUTTONS_ROTATE_SPEED, 0);
        } else if (this.state.right) {
            this.camera.rotate(-BUTTONS_ROTATE_SPEED, 0);
        } else if (this.state.up) {
            this.camera.rotate(0, BUTTONS_ROTATE_SPEED);
        } else if (this.state.down) {
            this.camera.rotate(0, -BUTTONS_ROTATE_SPEED);
        }
        if (this.state.rotateX || this.state.rotateY) {
            this.camera.rotate(this.state.rotateX, this.state.rotateY);
        }
    }
}