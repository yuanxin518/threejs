import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons";
import { Tween } from "three/examples/jsm/libs/tween.module.js";
import flyLine from "./fly";

type ThreeContext = {
    scene: THREE.Scene | null;
    renderer: THREE.WebGLRenderer | null;
    camera: THREE.PerspectiveCamera | null;
    controls: OrbitControls | null;
    tween: Tween<THREE.Vector3>[] | null;
    cameraProperty: {
        aspect: number;
    };
};

const threeInstance = (container: HTMLElement) => {
    if (!container) throw new Error("Container is null.");
    const uniforms: { [uniform: string]: THREE.IUniform<any> } = {
        u_time: {
            value: 0,
        },
    };
    const buildScene = (scene: THREE.Scene, camera: THREE.Camera, container: HTMLElement) => {
        scene.add(flyLine(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 0), uniforms));
        scene.add(flyLine(new THREE.Vector3(1, 1, 0), new THREE.Vector3(-2, 3, 0), uniforms));
    };

    const context: ThreeContext = {
        scene: null,
        renderer: null,
        camera: null,
        controls: null,
        cameraProperty: {
            aspect: 1,
        },
        tween: [],
    };

    /**
     * 初始化场景
     */
    const initScene = () => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        context.scene = scene;
    };

    /**
     * 初始化摄像机
     */
    const initCamera = () => {
        context.cameraProperty.aspect = container.clientWidth / container.clientHeight;
        const camera = new THREE.PerspectiveCamera(50, context.cameraProperty.aspect, 0.1, 2000);

        camera.position.set(0, -3, 5);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        context.camera = camera;
    };

    /**
     * 初始化渲染器
     */
    const initRenderer = () => {
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        renderer.shadowMap.enabled = true;
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        context.renderer = renderer;
    };

    const initHelper = () => {
        // const axes = new THREE.AxesHelper(12);
        // context.scene?.add(axes);

        const grid = new THREE.GridHelper(24, 24, 0xff0000, 0x444444);
        grid.material.transparent = true;
        grid.rotation.x = Math.PI / 2;
        context.scene?.add(grid);
    };

    const initControls = () => {
        if (!context.camera) return;
        context.controls = new OrbitControls(context.camera, container);
    };

    /**
     * 初始化Threejs
     * @returns
     */
    const initialize = (isControls: boolean) => {
        initScene();
        initRenderer();
        initCamera();
        isControls && initControls();
        initHelper();
        if (!context.scene || !context.camera) return;
        buildScene(context.scene, context.camera, container);

        const ambientLight = new THREE.AmbientLight(0x404040, 15);
        context.scene.add(ambientLight);
        const light = new THREE.DirectionalLight(0x404040, 15);
        light.castShadow = true;
        light.position.set(0, -3, 5);
        light.target.position.set(0, 0, 0);
        context.scene?.add(light);
        context.scene.add(light.target);
    };

    const startAnimation = () => {
        context.tween?.forEach((item) => {
            item.start();
        });
    };
    /**
     * 调用刷新渲染
     */
    const render = () => {
        if (!context.renderer || !context.camera || !context.scene) throw new Error("Something has not been initialized.");
        context.renderer.render(context.scene, context.camera);
        if (context.controls) {
            context.controls.update();
        }
        context.tween?.forEach((item) => {
            item.update();
        });
        // 传递给着色器的时间
        uniforms.u_time.value += 1;
    };

    return { initialize, render, startAnimation };
};

export default threeInstance;
