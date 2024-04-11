import * as THREE from 'three';
import '/style.css';  
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import gsap from "gsap"

// Scene
const scene = new THREE.Scene();

// Sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: "#00ff83", roughness: 0.5 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Particle system
const particlesGeometry = new THREE.BufferGeometry();
const particlesMaterial = new THREE.PointsMaterial({ color: '#ffffff', size: 0.1 });

const particlesCount = 1000;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// Light
const light = new THREE.PointLight(0xffffff, 75, 100, 2);
light.position.set(10, 10, 10);
scene.add(light);


// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webg1'); 
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true

// Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

// Render loop
const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
};
loop();

// Timeline 
const t1 = gsap.timeline({ defaults: { duration: 1 } })
t1.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
t1.fromTo("nav", { y: '-100%' }, { y: '0%' })
t1.fromTo(".title", { opacity: 0 }, { opacity: 1 })

// Mouse animation
let mouseDown = false
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

canvas.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        const rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150,
        ];
        const newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
        gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b });
    }
});
