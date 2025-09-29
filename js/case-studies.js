/**
 * Case Study Management System
 * Provides easy way to add and manage case studies
 */

class CaseStudyManager {
    constructor() {
        this.caseStudies = [];
        this.loadCaseStudies();
    }

    // Load case studies from data file or inline data
    loadCaseStudies() {
        // Default case studies data
        this.caseStudies = [
            {
                id: 'abyan-capital',
                slug: 'abyan-capital',
                title: {
                    ar: 'Abyan Capital',
                    en: 'Abyan Capital'
                },
                description: {
                    ar: 'تكامل Adjust SDK لتتبع دقيق للمستخدمين وتحسين أداء الحملات الإعلانية',
                    en: 'Adjust SDK integration for precise user tracking and campaign optimization'
                },
                industry: {
                    ar: 'الخدمات المالية',
                    en: 'Financial Services'
                },
                services: [
                    { ar: 'تكامل Adjust SDK', en: 'Adjust SDK Integration' },
                    { ar: 'تتبع المستخدمين', en: 'User Tracking' },
                    { ar: 'تحليلات متقدمة', en: 'Advanced Analytics' }
                ],
                technologies: ['Adjust SDK', 'iOS', 'Android', 'Analytics'],
                image: '/clients/abyan-capital.png',
                url: '/case-studies/abyan-capital.html',
                featured: true,
                completed: '2024',
                results: {
                    ar: [
                        'تحسين دقة تتبع المستخدمين بنسبة 95%',
                        'زيادة معدل التحويل بنسبة 40%',
                        'تحسين ROI للحملات الإعلانية بنسبة 60%'
                    ],
                    en: [
                        '95% improvement in user tracking accuracy',
                        '40% increase in conversion rate',
                        '60% improvement in advertising campaign ROI'
                    ]
                }
            }
        ];

        // Try to load additional case studies from external source
        this.loadExternalCaseStudies();
    }

    async loadExternalCaseStudies() {
        try {
            // This could load from a JSON file, CMS, or API
            const response = await fetch('/data/case-studies.json');
            if (response.ok) {
                const externalStudies = await response.json();
                this.caseStudies = [...this.caseStudies, ...externalStudies];
            }
        } catch (error) {
            console.log('No external case studies found, using default data');
        }
    }

    // Get all case studies
    getAllCaseStudies() {
        return this.caseStudies;
    }

    // Get featured case studies
    getFeaturedCaseStudies() {
        return this.caseStudies.filter(study => study.featured);
    }

    // Get case study by slug
    getCaseStudyBySlug(slug) {
        return this.caseStudies.find(study => study.slug === slug);
    }

    // Filter case studies by industry
    getCaseStudiesByIndustry(industry) {
        return this.caseStudies.filter(study => 
            study.industry.en.toLowerCase().includes(industry.toLowerCase()) ||
            study.industry.ar.includes(industry)
        );
    }

    // Filter case studies by technology
    getCaseStudiesByTechnology(tech) {
        return this.caseStudies.filter(study => 
            study.technologies.some(technology => 
                technology.toLowerCase().includes(tech.toLowerCase())
            )
        );
    }

    // Render case study card
    renderCaseStudyCard(caseStudy, lang = 'ar') {
        const title = caseStudy.title[lang];
        const description = caseStudy.description[lang];
        const industry = caseStudy.industry[lang];

        return `
            <div class="service-card case-study-card animate-fade-in">
                <div class="case-study-badge">
                    <span class="lang-ar">${caseStudy.featured ? 'مميز' : 'دراسة حالة'}</span>
                    <span class="lang-en hidden">${caseStudy.featured ? 'Featured' : 'Case Study'}</span>
                </div>
                
                <h3 class="text-xl font-semibold mb-3">${title}</h3>
                <p class="text-zinc-600 mb-4">${description}</p>
                
                <div class="case-study-meta mb-4">
                    <div class="flex items-center gap-2 text-sm text-zinc-500 mb-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <span>${industry}</span>
                    </div>
                    
                    <div class="flex flex-wrap gap-1">
                        ${caseStudy.technologies.slice(0, 3).map(tech => 
                            `<span class="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded">${tech}</span>`
                        ).join('')}
                        ${caseStudy.technologies.length > 3 ? 
                            `<span class="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded">+${caseStudy.technologies.length - 3}</span>` : 
                            ''
                        }
                    </div>
                </div>
                
                <a href="${caseStudy.url}" class="btn btn-secondary w-full">
                    <span class="lang-ar">اقرأ المزيد</span>
                    <span class="lang-en hidden">Read More</span>
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </a>
            </div>
        `;
    }

    // Render case studies grid
    renderCaseStudiesGrid(studies = null, containerId = 'case-studies-grid') {
        const studiesToRender = studies || this.getAllCaseStudies();
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.warn(`Container with ID '${containerId}' not found`);
            return;
        }

        const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'ar';
        
        container.innerHTML = studiesToRender.map(study => 
            this.renderCaseStudyCard(study, currentLang)
        ).join('');

        // Update language visibility
        if (window.languageManager) {
            window.languageManager.updateContentVisibility(currentLang);
        }
    }

    // Add new case study (for admin/content management)
    addCaseStudy(caseStudyData) {
        // Validate required fields
        const required = ['title', 'description', 'industry', 'services', 'technologies'];
        for (const field of required) {
            if (!caseStudyData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Generate slug if not provided
        if (!caseStudyData.slug) {
            caseStudyData.slug = this.generateSlug(caseStudyData.title.en || caseStudyData.title.ar);
        }

        // Generate ID if not provided
        if (!caseStudyData.id) {
            caseStudyData.id = caseStudyData.slug;
        }

        // Add default values
        caseStudyData.featured = caseStudyData.featured || false;
        caseStudyData.completed = caseStudyData.completed || new Date().getFullYear().toString();

        this.caseStudies.push(caseStudyData);
        this.saveCaseStudies();
        
        return caseStudyData;
    }

    // Generate URL-friendly slug
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Save case studies (would typically save to backend/CMS)
    saveCaseStudies() {
        try {
            // In a real implementation, this would save to a backend
            localStorage.setItem('rbconsult_case_studies', JSON.stringify(this.caseStudies));
            console.log('Case studies saved successfully');
        } catch (error) {
            console.error('Failed to save case studies:', error);
        }
    }

    // Initialize case studies display on page load
    initializePage() {
        // Render featured case studies in home page
        const featuredContainer = document.getElementById('featured-case-studies');
        if (featuredContainer) {
            this.renderCaseStudiesGrid(this.getFeaturedCaseStudies(), 'featured-case-studies');
        }

        // Render all case studies in case studies page
        const allStudiesContainer = document.getElementById('all-case-studies');
        if (allStudiesContainer) {
            this.renderCaseStudiesGrid(this.getAllCaseStudies(), 'all-case-studies');
        }

        // Set up language change listener
        window.addEventListener('languageChanged', () => {
            // Re-render all case studies when language changes
            this.initializePage();
        });
    }
}

// Initialize case study manager
window.addEventListener('DOMContentLoaded', () => {
    window.caseStudyManager = new CaseStudyManager();
    window.caseStudyManager.initializePage();
});

// Helper function to easily add case studies (for development/content management)
window.addCaseStudy = (caseStudyData) => {
    if (window.caseStudyManager) {
        return window.caseStudyManager.addCaseStudy(caseStudyData);
    }
    throw new Error('Case Study Manager not initialized');
};