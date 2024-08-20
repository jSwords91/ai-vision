export function initializeModules() {
    const modules = document.querySelectorAll('.module');
    
    modules.forEach(module => {
        const toggleBtn = module.querySelector('.toggle-btn');
        const moduleTitle = module.querySelector('.module-title');
        
        // Set initial aria-expanded state
        toggleBtn.setAttribute('aria-expanded', !module.classList.contains('collapsed'));
        
        moduleTitle.addEventListener('click', () => {
            toggleModule(module, toggleBtn);
        });
        
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleModule(module, toggleBtn);
        });
    });
}

function toggleModule(module, toggleBtn) {
    module.classList.toggle('collapsed');
    const isExpanded = !module.classList.contains('collapsed');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
    
    const moduleContent = module.querySelector('.module-content');
    if (isExpanded) {
        moduleContent.style.maxHeight = moduleContent.scrollHeight + 'px';
    } else {
        moduleContent.style.maxHeight = null;
    }
}