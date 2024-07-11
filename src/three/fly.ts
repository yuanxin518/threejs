import * as THREE from "three";
import vertexMove from "../shaders/move/vertex.glsl?raw";
import fragmentMove from "../shaders/move/fragment.glsl?raw";

const flyLine = (startPoint: THREE.Vector3, endPoint: THREE.Vector3, globalUniforms: { [uniform: string]: THREE.IUniform<any> }) => {
    const uniforms = {
        u_pointLength: {
            value: 0,
        },
    };
    const curve = new THREE.QuadraticBezierCurve3(startPoint, new THREE.Vector3((startPoint.x + endPoint.x) / 2, (startPoint.y + endPoint.y) / 2, 3), endPoint);
    const points = curve.getPoints(50);
    const indexList: number[] = points.map((_, index) => index);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    geometry.setAttribute("aIndex", new THREE.Float32BufferAttribute(indexList, 1));
    uniforms.u_pointLength.value = points.length;

    const material = new THREE.RawShaderMaterial({
        fragmentShader: fragmentMove,
        vertexShader: vertexMove,
        side: THREE.DoubleSide,
        vertexColors: true,
        uniforms: { ...uniforms, ...globalUniforms },
    });
    const content = new THREE.Points(geometry, material);
    return content;
};
export default flyLine;
