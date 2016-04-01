import THREE from 'three';

// var vertexShader = require('./shaders/BookMaterial.vs');
// var fragmentShader = require('./shaders/BookMaterial.fs');

var vertexShader = `
#define PHONG

varying vec3 vViewPosition;
varying vec3 vNormal;

${THREE.ShaderChunk.common}
${THREE.ShaderChunk.uv_pars_vertex}
${THREE.ShaderChunk.lights_phong_pars_vertex}
${THREE.ShaderChunk.color_pars_vertex}

void main() {
	${THREE.ShaderChunk.uv_vertex}
	${THREE.ShaderChunk.color_vertex}

	${THREE.ShaderChunk.beginnormal_vertex}
	${THREE.ShaderChunk.defaultnormal_vertex}
	
	vNormal = normalize(transformedNormal);

	${THREE.ShaderChunk.begin_vertex}
	${THREE.ShaderChunk.project_vertex}

	vViewPosition = -mvPosition.xyz;

	${THREE.ShaderChunk.worldpos_vertex}
	${THREE.ShaderChunk.lights_phong_vertex}
}`;

var fragmentShader = `
#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

uniform sampler2D coverMap;

${THREE.ShaderChunk.common}
${THREE.ShaderChunk.color_pars_fragment}
${THREE.ShaderChunk.uv_pars_fragment}
${THREE.ShaderChunk.map_pars_fragment}
${THREE.ShaderChunk.fog_pars_fragment}
${THREE.ShaderChunk.bsdfs}
${THREE.ShaderChunk.lights_pars}
${THREE.ShaderChunk.lights_phong_pars_fragment}
${THREE.ShaderChunk.bumpmap_pars_fragment}
${THREE.ShaderChunk.specularmap_pars_fragment}

void main() {
	vec4 diffuseColor = vec4(diffuse, opacity);
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	
	vec4 baseColor;
	vec4 testcolor = vec4(1.0, 1.0, 1.0, 1.0);
	float eps = 0.004;

	#ifdef USE_MAP
		baseColor = texture2D(map, vUv);
	#else
		baseColor = vec4(1.0, 1.0, 1.0, 1.0);
	#endif
	
	#ifdef USE_COVER
		vec4 coverColor = texture2D(coverMap, vUv * vec2(2.3, 1.3) - vec2(1.3, 0.3));
		if(vUv.y > 0.23 && (vUv.x > 0.57 || (all(greaterThanEqual(baseColor,testcolor-eps)) && all(lessThanEqual(baseColor,testcolor+eps)))))
			diffuseColor = coverColor;
		else
			diffuseColor = baseColor;
	#else
		diffuseColor = baseColor;
	#endif

	${THREE.ShaderChunk.color_fragment}
	${THREE.ShaderChunk.specularmap_fragment}
	${THREE.ShaderChunk.normal_fragment}

	${THREE.ShaderChunk.lights_phong_fragment}
	${THREE.ShaderChunk.lights_template}

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	
	${THREE.ShaderChunk.fog_fragment}
}`;

export default class BookMaterial extends THREE.ShaderMaterial {
	constructor(mapImage, bumpMapImage, specularMapImage, coverMapImage) {
		var defines = {};
		var uniforms;
		var parameters;

        var map;
        var bumpMap;
        var specularMap;
        var coverMap;
		
		uniforms = THREE.UniformsUtils.merge([
			THREE.UniformsLib.common,
			THREE.UniformsLib.bump,
			THREE.UniformsLib.fog,
			THREE.UniformsLib.lights
		]);

		uniforms.shininess = {type: 'f', value: 10};

		if(mapImage) {
			map = new THREE.Texture(mapImage);
			map.needsUpdate = true;
			uniforms.map = {type: 't', value: map};
		}

		if(bumpMapImage) {
			bumpMap = new THREE.Texture(bumpMapImage);
			bumpMap.needsUpdate = true;
			uniforms.bumpMap = {type: 't', value: bumpMap};
			uniforms.bumpScale = {type: 'f', value: 0.005};
		}

		if(specularMapImage) {
			specularMap = new THREE.Texture(specularMapImage);
			specularMap.needsUpdate = true;
			uniforms.specular = {type: 'c', value: new THREE.Color(0x555555)};
			uniforms.specularMap = {type: 't', value: specularMap};
		}

        if(coverMapImage) {
			coverMap = new THREE.Texture(coverMapImage);
			coverMap.needsUpdate = true;
			uniforms.coverMap = {type: 't', value: coverMap};
			defines.USE_COVER = true;
        }

		parameters = {
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: uniforms,
			defines: defines,
			lights: true,
			fog: true
		};

		super(parameters);

		this.map = !!mapImage;
		this.bumpMap = !!bumpMapImage;
		this.specularMap = !!specularMapImage;		
	}
}