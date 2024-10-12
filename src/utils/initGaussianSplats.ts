//@ts-ignore
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from 'three';

const { Viewer } = GaussianSplats3D;

const initGaussianSplats = (id: string, path: string) => {
    const container = document.getElementById(id) as HTMLElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    animate();

    const viewer = new Viewer({ threeScene: scene });
    viewer.addSplatScene(path).then(() => {
        viewer.start();
    });
    // '../../public/models/splat.ply'
};

export default initGaussianSplats;