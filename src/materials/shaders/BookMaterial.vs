#define PHONG

varying vec3 vViewPosition;
varying vec3 vNormal;

$common
$uv_pars_vertex
$lights_phong_pars_vertex
$color_pars_vertex

void main() {
	$uv_vertex
	$color_vertex

	$beginnormal_vertex
	$defaultnormal_vertex
	
	vNormal = normalize(transformedNormal);

	$begin_vertex
	$project_vertex

	vViewPosition = -mvPosition.xyz;

	$worldpos_vertex
	$lights_phong_vertex
}