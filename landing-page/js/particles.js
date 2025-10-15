/**
 * NULAI - Advanced Particle System
 * GPU-accelerated particles with mouse interaction
 */

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.particleCount = window.innerWidth < 768 ? 150 : 500; // Much fewer particles
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.setupScene();
        this.createParticles();
        this.setupLights();
        this.bindEvents();
        this.animate();
    }

    setupScene() {
        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const velocities = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);

        // Orange color palette
        const color1 = new THREE.Color('#FF6B35');
        const color2 = new THREE.Color('#FFA726');
        const color3 = new THREE.Color('#FFB74D');

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            // Position
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;

            // Velocity
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

            // Colors - random orange shades
            const colorChoice = Math.random();
            const color = colorChoice < 0.33 ? color1 : colorChoice < 0.66 ? color2 : color3;

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Subtle, professional particle material
        const material = new THREE.PointsMaterial({
            size: 0.15, // Smaller particles
            vertexColors: true,
            transparent: true,
            opacity: 0.4, // Much more subtle
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // Store velocities for animation
        this.velocities = velocities;
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xFF6B35, 1, 100);
        pointLight.position.set(0, 0, 50);
        this.scene.add(pointLight);
    }

    bindEvents() {
        // Mouse move
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    updateParticles() {
        const positions = this.particles.geometry.attributes.position.array;

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            // Update position with velocity
            positions[i3] += this.velocities[i3];
            positions[i3 + 1] += this.velocities[i3 + 1];
            positions[i3 + 2] += this.velocities[i3 + 2];

            // Boundary check and reverse
            if (Math.abs(positions[i3]) > 50) {
                this.velocities[i3] *= -1;
            }
            if (Math.abs(positions[i3 + 1]) > 50) {
                this.velocities[i3 + 1] *= -1;
            }
            if (Math.abs(positions[i3 + 2]) > 25) {
                this.velocities[i3 + 2] *= -1;
            }

            // Mouse interaction - repulsion
            const dx = positions[i3] - this.mouse.x * 30;
            const dy = positions[i3 + 1] - this.mouse.y * 30;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 10) {
                const force = (10 - distance) / 10;
                this.velocities[i3] += (dx / distance) * force * 0.01;
                this.velocities[i3 + 1] += (dy / distance) * force * 0.01;
            }

            // Velocity damping
            this.velocities[i3] *= 0.99;
            this.velocities[i3 + 1] *= 0.99;
            this.velocities[i3 + 2] *= 0.99;
        }

        this.particles.geometry.attributes.position.needsUpdate = true;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth mouse following
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Update particles
        this.updateParticles();

        // Rotate particle cloud slowly
        this.particles.rotation.y += 0.0005;
        this.particles.rotation.x += 0.0002;

        // Camera follows mouse slightly
        this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouse.y * 5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ParticleSystem();
    });
} else {
    new ParticleSystem();
}
