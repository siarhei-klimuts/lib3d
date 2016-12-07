import THREE from 'three';
import glowDatUrl from './img/glow.png';
import * as config from './config';

const PLANE_ROTATION = Math.PI * 0.5;
const PLANE_MULTIPLIER = 2;
const COLOR_SELECT = 0x005533;
const COLOR_FOCUS = 0x003355;

export default class Highlight {
    constructor() {
        let materialProperties = {
            map: new THREE.Texture(new Image()),
            transparent: true, 
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthTest: false
        };

        materialProperties.map.image.src = glowDatUrl;
        materialProperties.map.needsUpdate = true;

        materialProperties.color = COLOR_SELECT;
        let materialSelect = new THREE.MeshBasicMaterial(materialProperties);

        materialProperties.color = COLOR_FOCUS;
        let materialFocus = new THREE.MeshBasicMaterial(materialProperties);

        let geometry = new THREE.PlaneBufferGeometry(1, 1, 1);

        this.selectPlane = new THREE.Mesh(geometry, materialSelect);
        this.selectPlane.rotation.x = PLANE_ROTATION;

        this.focusPlane = new THREE.Mesh(geometry, materialFocus);
        this.focusPlane.rotation.x = PLANE_ROTATION;
    }

    /**
     * @private
     */
    commonHighlight(which, obj) {
        if(obj) {
            let width = obj.geometry.boundingBox.max.x * PLANE_MULTIPLIER;
            let height = obj.geometry.boundingBox.max.z * PLANE_MULTIPLIER;
            let bottom = obj.geometry.boundingBox.min.y + config.CLEARANCE;
            
            which.position.y = bottom;
            which.scale.set(width, height, 1);
            obj.add(which);

            which.visible = true;
        } else {
            which.visible = false;
        }
    }

    enable(val) {
        this.focusPlane.visible = this.selectPlane.visible = val;
    }

    focus(obj) {
        this.commonHighlight(this.focusPlane, obj);
    }

    select(obj) {
        this.commonHighlight(this.selectPlane, obj);
    }
}
