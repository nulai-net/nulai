/**
 * NULAI - Interactive Audience Grid
 * Cursor-reactive grid wall with 50+ audience types
 */

class AudienceGrid {
    constructor() {
        this.gridContainer = document.getElementById('audience-grid');
        if (!this.gridContainer) return;

        this.audiences = [
            'CREATORS', 'YOUTUBERS', 'PODCASTERS', 'STREAMERS', 'VLOGGERS',
            'INFLUENCERS', 'TIKTOKERS', 'INSTAGRAMMERS', 'BLOGGERS', 'WRITERS',
            'ARTISTS', 'PHOTOGRAPHERS', 'VIDEOGRAPHERS', 'MUSICIANS', 'SINGERS',
            'DANCERS', 'PERFORMERS', 'ENTERTAINERS', 'COMEDIANS', 'STORYTELLERS',
            'EDUCATORS', 'COACHES', 'TRAINERS', 'MENTORS', 'TEACHERS',
            'ATHLETES', 'GAMERS', 'REVIEWERS', 'CRITICS', 'COMMENTATORS',
            'CHEFS', 'FOODIES', 'TRAVELERS', 'ADVENTURERS', 'EXPLORERS',
            'LIFESTYLE', 'FASHIONISTAS', 'BEAUTY', 'MAKEUP', 'STYLISTS',
            'FITNESS', 'YOGIS', 'RUNNERS', 'CYCLISTS', 'CLIMBERS',
            'CRAFTERS', 'MAKERS', 'BUILDERS', 'GARDENERS', 'DECORATORS',
            'BOOKWORMS', 'READERS', 'POETS', 'NOVELISTS', 'JOURNALISTS',
            'HISTORIANS', 'SCIENTISTS', 'RESEARCHERS', 'INVENTORS', 'THINKERS',
            'PHILOSOPHERS', 'MOTIVATORS', 'SPEAKERS', 'HOSTS', 'PRESENTERS',
            'INTERVIEWERS', 'ANCHORS', 'REPORTERS', 'CORRESPONDENTS', 'CRITICS',
            'COLLECTORS', 'HOBBYISTS', 'ENTHUSIASTS', 'FANS', 'SUPPORTERS',
            'SKATERS', 'SURFERS', 'SNOWBOARDERS', 'HIKERS', 'CAMPERS',
            'FISHERS', 'HUNTERS', 'BIKERS', 'MOTORCYCLISTS', 'DRIVERS',
            'PILOTS', 'SAILORS', 'DIVERS', 'SWIMMERS', 'WALKERS',
            'PAINTERS', 'SCULPTORS', 'ILLUSTRATORS', 'DESIGNERS', 'ANIMATORS',
            'CARTOONISTS', 'SKETCHERS', 'DRAWERS', 'CALLIGRAPHERS', 'TATTOOISTS',
            'BAKERS', 'COOKS', 'BARISTAS', 'MIXOLOGISTS', 'SOMMELIERS',
            'WINE LOVERS', 'BEER LOVERS', 'COFFEE LOVERS', 'TEA LOVERS', 'FOOD LOVERS',
            'PET LOVERS', 'DOG LOVERS', 'CAT LOVERS', 'BIRD LOVERS', 'FISH KEEPERS',
            'PLANT LOVERS', 'FLOWER LOVERS', 'TREE HUGGERS', 'NATURE LOVERS', 'ECO WARRIORS',
            'MINIMALISTS', 'MAXIMALISTS', 'ORGANIZERS', 'CLEANERS', 'TIDIERS',
            'KNITTERS', 'SEWERS', 'QUILTERS', 'EMBROIDERERS', 'WEAVERS',
            'WOODWORKERS', 'METALWORKERS', 'JEWELERS', 'POTTERS', 'GLASSBLOWERS',
            'MAGICIANS', 'JUGGLERS', 'ACROBATS', 'MIMES', 'CLOWNS',
            'VOICE ACTORS', 'NARRATORS', 'AUDIOBOOK READERS', 'RADIO HOSTS', 'DJS'
        ];

        this.init();
    }

    init() {
        this.createGrid();
        this.bindEvents();
    }

    createGrid() {
        this.gridContainer.innerHTML = '';

        const centerX = 0;
        const centerY = 0;

        // Create multiple orbital rings
        const rings = 5;
        const itemsPerRing = Math.ceil(this.audiences.length / rings);

        this.audiences.forEach((audience, index) => {
            const item = document.createElement('div');
            item.className = 'grid-item';
            item.textContent = audience;
            item.dataset.text = audience;

            // Calculate which ring this item belongs to
            const ringIndex = Math.floor(index / itemsPerRing);
            const indexInRing = index % itemsPerRing;
            const totalInRing = Math.min(itemsPerRing, this.audiences.length - ringIndex * itemsPerRing);

            // Calculate position in OVAL orbit (wider horizontally)
            const baseRadius = 350 + (ringIndex * 120);
            const radiusX = baseRadius * 1.8; // Horizontal stretch
            const radiusY = baseRadius * 0.6; // Vertical compression
            const angle = (indexInRing / totalInRing) * Math.PI * 2;

            const x = centerX + Math.cos(angle) * radiusX;
            const y = centerY + Math.sin(angle) * radiusY;

            // Skip items that would overlap with center text using elliptical distance
            // This accounts for the oval shape of the exclusion zone
            const ellipticalDistance = Math.sqrt((x * x) / (450 * 450) + (y * y) / (150 * 150));
            if (ellipticalDistance < 1) {
                return; // Skip this item - it's inside the exclusion ellipse
            }

            // Position the item
            item.style.left = `calc(50% + ${x}px)`;
            item.style.top = `calc(50% + ${y}px)`;
            item.style.transform = 'translate(-50%, -50%)';
            item.style.animationDelay = `${index * 0.02}s`;

            // Store original position for animations
            item.dataset.radiusX = radiusX;
            item.dataset.radiusY = radiusY;
            item.dataset.angle = angle;

            this.gridContainer.appendChild(item);
        });

        this.gridItems = Array.from(this.gridContainer.querySelectorAll('.grid-item'));

        // Hide any items that overlap with center text after DOM render
        setTimeout(() => this.hideOverlappingItems(), 100);

        // Start subtle rotation animation
        this.startOrbitalAnimation();
    }

    startOrbitalAnimation() {
        let rotation = 0;

        const animate = () => {
            rotation += 0.0003;

            this.gridItems.forEach((item) => {
                const originalAngle = parseFloat(item.dataset.angle);
                const radiusX = parseFloat(item.dataset.radiusX);
                const radiusY = parseFloat(item.dataset.radiusY);

                const newAngle = originalAngle + rotation;
                const x = Math.cos(newAngle) * radiusX;
                const y = Math.sin(newAngle) * radiusY;

                item.style.left = `calc(50% + ${x}px)`;
                item.style.top = `calc(50% + ${y}px)`;
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    hideOverlappingItems() {
        const centerTitle = document.querySelector('.center-title-overlay');
        if (!centerTitle) return;

        const centerRect = centerTitle.getBoundingClientRect();
        const paddingHorizontal = 120; // More padding on left/right
        const paddingVertical = 60; // Less padding on top/bottom

        this.gridItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();

            // Check if item overlaps with center title (with asymmetric padding)
            const overlaps = !(
                itemRect.right < centerRect.left - paddingHorizontal ||
                itemRect.left > centerRect.right + paddingHorizontal ||
                itemRect.bottom < centerRect.top - paddingVertical ||
                itemRect.top > centerRect.bottom + paddingVertical
            );

            if (overlaps) {
                item.style.opacity = '0';
                item.style.pointerEvents = 'none';
            }
        });
    }

    bindEvents() {
        this.gridContainer.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.gridContainer.addEventListener('mouseleave', () => this.clearGlow());
    }

    handleMouseMove(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        this.gridItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemCenterX = itemRect.left + itemRect.width / 2;
            const itemCenterY = itemRect.top + itemRect.height / 2;

            const distance = Math.sqrt(
                Math.pow(mouseX - itemCenterX, 2) +
                Math.pow(mouseY - itemCenterY, 2)
            );

            const glowRadius = 200;

            if (distance < glowRadius) {
                const intensity = 1 - (distance / glowRadius);
                const opacity = 0.15 + (intensity * 0.85);
                const scale = 1 + intensity * 0.3;

                item.style.color = `rgba(255, 107, 53, ${opacity})`;
                item.style.textShadow = `0 0 ${30 * intensity}px rgba(255, 107, 53, ${intensity}), 0 0 ${60 * intensity}px rgba(255, 107, 53, ${intensity * 0.5})`;
                item.style.transform = `translate(-50%, -50%) scale(${scale})`;
                item.style.fontWeight = '700';
            } else {
                item.style.color = 'rgba(255, 255, 255, 0.15)';
                item.style.textShadow = 'none';
                item.style.transform = 'translate(-50%, -50%) scale(1)';
                item.style.fontWeight = '600';
            }
        });
    }

    clearGlow() {
        this.gridItems.forEach(item => {
            item.style.color = 'rgba(255, 255, 255, 0.15)';
            item.style.textShadow = 'none';
            item.style.transform = 'translate(-50%, -50%) scale(1)';
            item.style.fontWeight = '600';
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AudienceGrid();
    });
} else {
    new AudienceGrid();
}
