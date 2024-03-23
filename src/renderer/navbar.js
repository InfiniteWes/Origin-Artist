document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('mouseenter', function() {
                const line = document.querySelector('.hover-line');
                if (line) {
                    line.style.width = this.offsetWidth + 'px';
                    line.style.left = this.offsetLeft + 'px';
                }
            });
        });

        // Hide the line when not hovering over a link
        navbar.addEventListener('mouseleave', function() {
            const line = document.querySelector('.hover-line');
            if (line) {
                line.style.width = 0;
            }
        });
    } else {
        console.error('Navbar element not found');
    }
});
