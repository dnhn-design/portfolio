document.addEventListener('DOMContentLoaded', () => {

    // =======================================================================
    // 1. PROJECT DATA STRUCTURE (CATEGORY + INDIVIDUAL PROJECTS)
    // =======================================================================

    // A. Master list of ALL individual, detailed projects (Used by the large modal)
    // NOTE: The categoryId must match the Category ID in section B (e.g., 'proj-1')
    const individualProjects = [
        // --- PROJ-1 PROJECTS (Research & Discovery) ---
        { id: 'p1a', client: 'School Assignment', year: '2025', role: 'Student', categoryId: 'proj-1', thumbnail: '001/desmos_thumbnail.png', projectImages: ['001/Desmos.gif', '001/desmos-demo.gif', '001/desmos-flow.png'],
          title: 'Desmos Mobile App UI/UX Redesign', overview: 'Redesign concept for the Desmos mobile app that help create a more accessible, easier to use, and a more powerful tool to help enhance the aim of the company to ensure that everyone has the opportunity to discover their inner mathematician.', outcome: 'This project taught me the full process of thinking like a UX designer, from ideating and prototyping to usability testing, iterating, and presentation of the concept. Disclaimer: This is a fan-made concept and any logos used are for non-commercial, conceptual use only. All trademarks and agency names belong to their respective owners.', images: 3 },
        { id: 'p1b', client: 'School Assignment', year: '2025', role: 'Student', categoryId: 'proj-1', thumbnail: '001/redesign_process.png', projectImages: ['001/library_app.png', '001/library-menu.png', '001/library-wallet.png'],
          title: 'Bad UI and UX Redesign', overview: 'Redesigned the mobile app for my local library app for an assignment to redesign an app that I consider as bad.', outcome: 'I started by mapping out the existing user flow, features, and navigational hierachy. Then, I defined the user needs of the product, and I decided the most important features for the vast majority of users. After that, I prototyped and tested various design ideas, and eventually landed on the final version.', images: 3 },
        { id: 'p1c', client: 'School Assignment', year: '2025', role: 'Student', categoryId: 'proj-1', thumbnail: '001/ai_tech_app.png', projectImages: ['001/compare_AI.png', '001/compare-1.png', '001/compare-2.png'],
          title: 'If I were an App...', overview: 'This assignment challenged me to explore the intersection of identity, empathy, and design thinking. I conceptualized an app that represents my unique perspective and serves a meaningful purpose.', outcome: 'I developed a concept for an app that reflects my personal values of helping others and my interests in technology and tools. I identified a user group and a specific need or problem my app addresses, and I demonstrated design thinking process from analyzing competitors and iterating to the final solution to communciate my concept clearly through visuals and storytelling.', images: 3 },
          
        // --- PROJ-2 PROJECTS (Digital Innovation) ---
        { id: 'p2a', client: 'School Assignment', year: '2025', role: 'Student', categoryId: 'proj-2', thumbnail: '002/camera_data.png', projectImages: [],
          title: 'Last 100 Photo Data Viz', overview: 'I gathered the data about my last 100 photos on my phone gallery app to categorize and visualize it as a quick data viz exercise.', outcome: 'Static data visualization graphic showing the most frequent subject of my camera.', images: 3 },
        { id: 'p2b', client: 'School Assignment', year: '2025', role: 'Student', categoryId: 'proj-2', thumbnail: '002/subway4.png', projectImages: ['002/subway1.png', '002/subway2.png', '002/subway3.png'],
          title: 'NYC Subway in Paper', overview: 'Assignment was to visualize NYC without saying NYC. I designed every detail of the NYC subway cars and fabricated them out of paper.', outcome: 'Used various fabrication tools at SVA capable of cutting and folding large format paper to create paper models of NYC Subway Rolling stock.', images: 3 },
        { id: 'p2c', client: 'School Assignment', year: '2025', role: 'Student', categoryId: 'proj-2', thumbnail: '002/type2.png', projectImages: ['002/type3.png', '002/type4.png', '002/type5.JPG'],
          title: 'The Unit of Typography', overview: 'Designed a custom display typeface based on the intricate craft of woodworking that highlight the intricate craft of type design by designing and fabricating physical pieces of the letters that comes together like a little lego.', outcome: 'Learned the delicate craft of type design, 3D modeling, and 3D Printing.', images: 3 },
        
        // --- Add data for PROJ-3, PROJ-4, PROJ-5 projects here following the same structure ---

        // --- PROJ-3 PROJECTS (Visual Comm) ---
        { id: 'p3a', client: 'School Assignment', year: '2026', role: 'Student', categoryId: 'proj-3', thumbnail: '003/parachute.gif', projectImages: ['003/parachute1.png', '003/parachute2.png', '003/parachute3.png'],
          title: 'Parachute Brooklyn Brand Identity Refresh', overview: 'Assignment was to design a typographic brand identity redesign for a brooklyn-based children clothing store.', outcome: 'I created a dynamic brand identity that maintains their existing brand character while modernizing the aesthetics and versatility of the brand elements. Disclaimer: This is a fan-made conceptual design only. All trademarks and agency names belong to their respective owners.', images: 3 },
        { id: 'p3b', client: 'School Assignment', year: '2024', role: 'Student', categoryId: 'proj-3', thumbnail: '003/vine-cover.png', projectImages: ['003/vine-type.jpg', '003/vine-2.png', '003/vine-3.png'],
          title: 'Extra Virgin Olive Oil & Balsamic Vinegar Packaging and Branding', overview: 'Designed a typographic branding and packaging system for olive oil and vinegar products.', outcome: 'Explored packaging design, brand identity design, fabrication, and type design in one cumulative project.', images: 3 },
        { id: 'p3c', client: 'Personal Explorations', year: '2022–2026', role: 'Student', categoryId: 'proj-3', thumbnail: '003/type-design-1.png', projectImages: ['003/type2.jpg', '003/type3.jpg', '003/type4.jpg'],
          title: 'Miscellaneous Type Design Exploration', overview: 'Exploration of the various shapes that every English letterforms take.', outcome: 'Better understanding of type design processes and the visual artifacts of each letters.', images: 3 },

        // --- PROJ-4 PROJECTS (Purpose Driven Work) ---
        { id: 'p4a', client: 'School Assignment', year: 'Spring 2025', role: 'Student', categoryId: 'proj-4', thumbnail: '004/speciesism-1.jpeg', projectImages: ['004/speciesism-2.png', '004/speciesism-3.png', '004/speciesism-4.png'],
          title: 'Campaign Poster Series using Tactile Typography', overview: 'Goal was to explore type beyond the screen in the physical world. I have always been passionate about being anti-speciesist, so I wanted to explore the idea with type. Speciesism is the prejudice based on species, typically involving the assumption of human superiority to justify exploiting animals.', outcome: 'By molding actual meat and using my hand, I created an emotionally provocative poster triptych for campaign about Ending Speciesism.', images: 3 },
        { id: 'p4b', client: 'School Assignment', year: '2026', role: 'IxD Student', categoryId: 'proj-4', thumbnail: '004/routetime4.png', projectImages: ['004/routetime2.png', '004/routetime3.png', '004/routetime5.png'],
        title: 'RouteTime', overview: 'To design an experiential, multi-touchpoint product ecosystem that improves human agency.', outcome: 'Experience-based low-coast solution to unifying the fragmented commuter railroad system in the NYC area.', images: 3 },
        { id: 'p4c', client: 'TBD', year: '20XX', role: 'Student', categoryId: 'proj-4', thumbnail: 'desmos_thumbnail.png', projectImages: ['desmos_1.png', 'desmos_2.png', 'desmos_3.png'],
          title: 'Project 3', overview: 'Overview.', outcome: 'Outcome.', images: 3 },

        // --- PROJ-5 PROJECTS (Human Centered Design) ---
        { id: 'p5a', client: 'School Assignment', year: '2026', role: 'IxD Student', categoryId: 'proj-5', thumbnail: '005/spotdrop-main.png', projectImages: ['005/spotdrop1.gif', '005/spotdrop2.png', '005/spotdrop3.png'],
          title: 'Minimal Interaction: Spot', overview: 'Series of three minimal interaction apps that solves real pain point for real users. Minimal, yet meaningful interaction is the most important part.', outcome: 'ResearchGate reports that people circling city blocks just to find parking amounts to a total of 4.3 billion in wasted economic value in New York City alone. Spot aims to fix that by introducing a way to allow person leaving a spot to meet up with person looking for a spot with jsut one tap.', images: 3 },
        { id: 'p5b', client: 'School Assignment', year: '2026', role: 'IxD Student', categoryId: 'proj-5', thumbnail: '005/vision-main.png', projectImages: ['005/vision1.png', '005/vision2.png', '005/vision3.png'],
          title: 'Minimal Interaction: Vision Aid', overview: 'Series of three minimal interaction apps that solves real pain point for real users. Minimal, yet meaningful interaction is the most important part.', outcome: 'Indoor wayfinding remains a significantly under-supported area in navigational technology, despite rapid advancements in outdoor GPS. Vision Aid aims to help tackle this problem by using AI vision technology without the verbosity of AI Chatbots.', images: 3 },
        { id: 'p5c', client: 'School Assignment', year: '2026', role: 'IxD Student', categoryId: 'proj-5', thumbnail: '005/tasker-main.png', projectImages: ['005/tasker.gif', '005/tasker1.png', '005/tasker2.png'],
          title: 'Minimal Interaction: Tasker', overview: 'Series of three minimal interaction apps that solves real pain point for real users. Minimal, yet meaningful interaction is the most important part.', outcome: 'The Wall of Awful Effect makes initiating tasks feel impossible, causing people to avoid, procrastinate, or feel paralyzed. Tasker aims to improve morales by making completing tasks fun using satisfyingly simple gesture based interaction.', images: 3 },
        
    ];

    // B. Master list of all CATEGORIES (Used by the small hover dialog and for grouping)
    const categories = [
        { id: 'proj-1', name: 'Research & Discovery', overview: 'Understanding user needs and behavior, market trends and competition, and technological shifts through careful observation, testing, iteration, and analysis.', chips: ['User Research', 'UXR', 'Market Research','Awareness','IX Frameworks'], projectIds: ['p1a', 'p1b', 'p1c'] }, // Add projectIds here
        { id: 'proj-2', name: 'Digital Innovation', overview: 'Exploring emerging technologies including AI, AR/VR, interactive web, and physical fabrication tools to push creative boundaries.', chips: ['AI/ML', 'AR/MR/XR', 'HTML/CSS/JS', 'Creative Coding', 'Fabrication', '3D Printing'], projectIds: ['p2a', 'p2b', 'p2c'] },
        { id: 'proj-3', name: 'Visual Communication', overview: 'Crafting compelling visual narratives through typography, color, layout, and motion design.', chips: ['Typography', 'Branding', 'UI/UX'], projectIds: ['p3a', 'p3b', 'p3c'] }, // Add projectIds here
        { id: 'proj-4', name: 'Purpose-Driven Work', overview: 'Creating meaningful designs that solve real problems and contribute to a better, more accessible world.', chips: ['Accessibility', 'Sustainability', 'Social Good'], projectIds: ['p4a', 'p4b', 'p4c'] },
        { id: 'proj-5', name: 'Human-Centered Design', overview: 'Putting people first by designing intuitive, empathetic experiences that resonate with diverse audiences.', chips: ['Empathy', 'Usability', 'Inclusivity'], projectIds: ['p5a', 'p5b', 'p5c'] }, // Add projectIds here
    ];
    
    // Global State and Elements
    let activeProjects = []; // Stores the 3 projects currently in the modal view
    let currentProjectIndex = -1; // Index within activeProjects (0, 1, or 2)
    
    const containers = document.querySelectorAll('.hover-container');
    const mediaQuery = window.matchMedia('(min-width: 1024px)'); 
    let documentClickListener = null; 

    // Modal Element References
    const modal = document.getElementById('project-detail-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const prevBtn = document.getElementById('prev-project-btn');
    const nextBtn = document.getElementById('next-project-btn');
    const modalImagesArea = document.getElementById('modal-images');

    // --- Check for required modal elements ---
    if (!modal || !modalCloseBtn || !prevBtn || !nextBtn || !modalImagesArea) {
        console.error("One or more required modal elements are missing. Modal functions will be disabled.");
        // We will continue execution for sidebar/hover, but log the error
    }


    // =======================================================================
    // 2. SIDEBAR / HAMBURGER MENU LOGIC
    // =======================================================================

    const toggleButton = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('sidebar-overlay'); 

    if (toggleButton && sidebar && overlay) { 
        const toggleMenu = function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active'); 
            toggleButton.classList.toggle('open');
        };

        toggleButton.addEventListener('click', function(event) {
            event.stopPropagation(); 
            toggleMenu();
        });

        overlay.addEventListener('click', toggleMenu);
    } 

    // =======================================================================
    // 3. DIALOG & MODAL MANAGEMENT FUNCTIONS
    // =======================================================================

    // --- A. Position Hover Dialog (Stable Math) ---
    function positionDialog(triggerElement, dialogElement) {

        if (!dialogElement.classList.contains('is-visible')) {
            dialogElement.classList.add('is-visible');
        }

        const triggerRect = triggerElement.getBoundingClientRect();
        const dialogWidth = dialogElement.offsetWidth;
        const dialogHeight = dialogElement.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let dialogTop;
        let dialogLeft;

        const spaceBelow = viewportHeight - triggerRect.bottom;
        if (spaceBelow < dialogHeight && triggerRect.top > dialogHeight) {
            dialogTop = triggerRect.top - dialogHeight - 10;
        } else {
            dialogTop = triggerRect.bottom + 10;
        }

        let centerPoint = triggerRect.left + (triggerRect.width / 2);
        dialogLeft = centerPoint - (dialogWidth / 2);
        
        if (dialogLeft < 10) {
            dialogLeft = 10;
        }
        if (dialogLeft + dialogWidth > viewportWidth - 10) {
            dialogLeft = viewportWidth - dialogWidth - 10;
        }
        
        dialogElement.style.position = 'absolute'; 
        dialogElement.style.top = `${dialogTop + window.scrollY}px`;
        dialogElement.style.left = `${dialogLeft + window.scrollX}px`;
    }

    // --- B. Populate the Small Hover Dialog ---
    function populateSmallDialog(containerElement, categoryId) {
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;

        // Assuming the small dialog uses classes: .hover-dialog-h, .hover-dialog-p, .chips
        const dialog = containerElement.querySelector('.hover-dialog');
        dialog.querySelector('.hover-dialog-h').textContent = category.name;
        dialog.querySelector('.hover-dialog-p').textContent = category.overview;
        
        // Update chips dynamically
        const chipsDiv = dialog.querySelector('.chips');
        chipsDiv.innerHTML = category.chips.map(chip => `<span>${chip}</span>`).join('');
    }

    // --- C. Toggle Small Hover Dialog ---
    const toggleDialog = (dialog, shouldShow) => {
        if (shouldShow) {
            // Close all others
            document.querySelectorAll('.hover-dialog').forEach(d => d.classList.remove('is-visible'));
            dialog.classList.add('is-visible');
            positionDialog(dialog.closest('.hover-container'), dialog); 
        } else {
            dialog.classList.remove('is-visible');
        }
    };








    // --- D. Update Large Modal Content (Individual Project) ---
    const updateModalContent = (index) => {
        if (!modal || index < 0 || index >= activeProjects.length) return;
        currentProjectIndex = index;
        const project = activeProjects[index];
        const category = categories.find(c => c.id === project.categoryId);

        currentProjectIndex = index;
        const p = activeProjects[index];
        const cat = categories.find(c => c.id === p.categoryId);

        document.getElementById('modal-overview').textContent = cat.overview;
        document.getElementById('modal-title').textContent = cat.name;
        document.getElementById('project-subtitle').textContent = p.title;
        document.getElementById('project-client').textContent = p.client;
        document.getElementById('project-year').textContent = p.year;
        document.getElementById('project-role').textContent = p.role;
        document.getElementById('project-description').textContent = p.overview;
        document.getElementById('project-outcome').textContent = p.outcome;
        document.getElementById('project-counter').textContent = `${index + 1} of ${activeProjects.length}`;
    
        // Main Image
        const mainImg = document.getElementById('modal-main-image');
        if (p.thumbnail) {
            mainImg.src = p.thumbnail;
            mainImg.style.backgroundColor = "transparent";
        } else {
            // If no image is provided, show the grey placeholder
            mainImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            mainImg.style.backgroundColor = '#e0e0e0';
        }
    

        
        // 3 Boxes at the bottom
        const grid = document.getElementById('modal-images-grid');
        grid.innerHTML = ''; // Clear the old boxes

        const modalImagesArea = document.getElementById('modal-images-grid');
        if (modalImagesArea) {
            // 1. CLEAR everything first so old projects don't stay behind
            modalImagesArea.innerHTML = ''; 

            // 2. CHECK if the project has specific images
            if (project.projectImages && project.projectImages.length > 0) {
                // Only loop through what is actually in your data
                project.projectImages.forEach(src => {
                    const frame = document.createElement('div');
                    frame.className = 'modal-images-frame';
                    // Vertical scale fix: Ensure the image fills the tall frame
                    frame.innerHTML = `<img src="${src}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">`;
                    modalImagesArea.appendChild(frame);
                });
            } else {
                // 3. FALLBACK: Only if no images exist, create exactly 3 grey boxes
                for (let i = 0; i < 3; i++) {
                    const frame = document.createElement('div');
                    frame.className = 'modal-img-frame';
                    modalImagesArea.appendChild(frame);
                }
            }
        }

        if (prevBtn && nextBtn) {
            prevBtn.disabled = (index === 0); 
            nextBtn.disabled = (index === activeProjects.length - 1);
        }

    };








    // --- E. Open Large Modal (Category View) ---
    function openDetailedModal(categoryId) {
        if (!modal) return;
        
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;
        
        // Filter the master list to get only the 3 projects for this category
        activeProjects = individualProjects.filter(p => p.categoryId === categoryId);

        if (activeProjects.length === 0) {
             console.warn(`No projects found for category ID: ${categoryId}`);
             return;
        }

        // Start the modal view at the first project (index 0)
        updateModalContent(0);
            
        // Hide any active small hover dialogs
        document.querySelectorAll('.hover-dialog').forEach(d => d.classList.remove('is-visible'));

        // Show Modal and lock background scrolling
        modal.style.display = 'flex'; 
        document.body.classList.add('modal-open'); 
    }


    // --- F. Modal Event Listeners ---
    modalCloseBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });

    prevBtn.addEventListener('click', () => {
        if (currentProjectIndex > 0) {
            updateModalContent(currentProjectIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentProjectIndex < activeProjects.length - 1) {
            updateModalContent(currentProjectIndex + 1);
        }
    });

    // Close on clicking the dark overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });


    // =======================================================================
    // 4. HYBRID EVENT LOGIC (Hover/Tap Switch)
    // =======================================================================
    
    const handleEvents = (mql) => {
        containers.forEach(container => {
            const dialog = container.querySelector('.hover-dialog');
            const categoryId = container.dataset.projectId; // e.g., 'proj-1'
            
            // Handlers
            const onHoverEnter = () => {
                populateSmallDialog(container, categoryId);
                toggleDialog(dialog, true);
            }
            const onHoverLeave = () => toggleDialog(dialog, false);
            const onClickOpenModal = (e) => {
                e.preventDefault(); 
                e.stopPropagation();
                openDetailedModal(categoryId); // Open the large modal
            };

            // --- Clean up existing listeners on the container ---
            container.removeEventListener('mouseenter', onHoverEnter);
            container.removeEventListener('mouseleave', onHoverLeave);
            container.removeEventListener('click', onClickOpenModal); 

            // --- Apply new listeners based on screen width ---
            if (mql.matches) {
                // DESKTOP: Hover (for small dialog) + Click (for large modal)
                container.addEventListener('mouseenter', onHoverEnter);
                container.addEventListener('mouseleave', onHoverLeave);
                container.addEventListener('click', onClickOpenModal);
                
                if (documentClickListener) {
                    document.removeEventListener('click', documentClickListener);
                    documentClickListener = null;
                }
            } else {
                // MOBILE/TABLET: Tap/Click directly opens the Modal
                container.addEventListener('click', onClickOpenModal);

                // Add document listener to close small dialogs on tap outside 
                if (!documentClickListener) {
                    documentClickListener = (e) => {
                        if (!e.target.closest('.hover-container')) {
                            containers.forEach(c => toggleDialog(c.querySelector('.hover-dialog'), false));
                        }
                    };
                    document.addEventListener('click', documentClickListener);
                }
            }
        });
    };

    // Initial run and listener for screen size changes
    handleEvents(mediaQuery); 
    mediaQuery.addListener(handleEvents); 

    // ----------------------------------------------------
    // 5. RESIZE LOGIC (Debounced Handler)
    // ----------------------------------------------------

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.querySelectorAll('.hover-dialog.is-visible').forEach(dialog => {
                const container = dialog.closest('.hover-container');
                if (container) {
                    positionDialog(container, dialog);
                }
            });
        }, 100); 
    });
});
