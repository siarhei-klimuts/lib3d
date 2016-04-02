#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

uniform sampler2D coverMap;

$common
$color_pars_fragment
$uv_pars_fragment
$map_pars_fragment
$fog_pars_fragment
$bsdfs
$lights_pars
$lights_phong_pars_fragment
$bumpmap_pars_fragment
$specularmap_pars_fragment

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

	$color_fragment
	$specularmap_fragment
	$normal_fragment

	$lights_phong_fragment
	$lights_template

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	
	$fog_fragment
}