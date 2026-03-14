document.addEventListener('DOMContentLoaded', () => {
    const categoryList = document.getElementById('category-list');
    const documentList = document.getElementById('document-list');
    const contextNavSection = document.getElementById('context-nav-section');

    const viewIndex = document.getElementById('view-index');
    const viewCategory = document.getElementById('view-category');
    const viewDocument = document.getElementById('view-document');

    const categoryTitle = document.getElementById('category-title');
    const categoryContent = document.getElementById('category-content');

    const docTitle = document.getElementById('doc-title');
    const docMeta = document.getElementById('doc-meta');
    const docSummary = document.getElementById('doc-summary');

    const btnViewMd = document.getElementById('btn-view-md');
    const btnViewCaseText = document.getElementById('btn-view-case-text');
    const btnViewPdf = document.getElementById('btn-view-pdf');
    const btnDownload = document.getElementById('btn-download');

    const mdViewer = document.getElementById('md-viewer');
    const pdfViewer = document.getElementById('pdf-viewer');
    const noViewerMsg = document.getElementById('no-viewer-msg');

    let currentDoc = null;
    let currentView = null;

    function initSidebar() {
        categoryList.innerHTML = '';
        ARCHIVE_DATA.forEach(cat => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${cat.id}`;
            a.textContent = cat.category;
            a.id = `nav-${cat.id}`;
            li.appendChild(a);
            categoryList.appendChild(li);
        });
    }

    function handleRoute() {
        const hash = window.location.hash.substring(1);
        const parts = hash.split('/');
        const catId = parts[0];
        const subIdOrDocId = parts[1];
        const docId = parts[2];

        viewIndex.style.display = 'none';
        viewCategory.style.display = 'none';
        viewDocument.style.display = 'none';
        contextNavSection.style.display = 'none';

        document.querySelectorAll('#category-list a').forEach(a => a.classList.remove('active'));

        if (!catId) {
            viewIndex.style.display = 'block';
            return;
        }

        const category = ARCHIVE_DATA.find(c => c.id === catId);
        if (!category) return;

        const navElem = document.getElementById(`nav-${catId}`);
        if (navElem) navElem.classList.add('active');

        if (!subIdOrDocId) {
            renderCategory(category);
        } else {
            if (category.subcategories) {
                const sub = category.subcategories.find(s => s.id === subIdOrDocId);
                if (sub && !docId) {
                    renderCategory(category, sub);
                } else if (sub && docId) {
                    const doc = sub.items.find(i => slugify(i.title) === docId);
                    if (doc) renderDocument(category, doc, sub);
                } else if (!sub && subIdOrDocId) {
                    for (const s of category.subcategories) {
                        const doc = s.items.find(i => slugify(i.title) === subIdOrDocId);
                        if (doc) {
                            renderDocument(category, doc, s);
                            break;
                        }
                    }
                }
            } else {
                const doc = category.items.find(i => slugify(i.title) === subIdOrDocId);
                if (doc) renderDocument(category, doc);
            }
        }
    }

    function renderCategory(category, subcategory = null) {
        viewCategory.style.display = 'block';
        categoryTitle.textContent = subcategory ? `${category.category}: ${subcategory.name}` : category.category;

        categoryContent.innerHTML = '';

        if (!subcategory && category.subcategories) {
            const subNav = document.createElement('div');
            subNav.className = 'category-index';
            category.subcategories.forEach(sub => {
                const section = document.createElement('section');
                section.innerHTML = `<h3><a href="#${category.id}/${sub.id}">${sub.name}</a></h3>`;
                categoryContent.appendChild(section);

                const grid = document.createElement('div');
                grid.className = 'category-grid';
                sub.items.forEach(item => {
                    grid.appendChild(createDocCard(item, category, sub));
                });
                categoryContent.appendChild(grid);
            });
        } else {
            const items = subcategory ? subcategory.items : (category.items || []);
            const grid = document.createElement('div');
            grid.className = 'category-grid';
            items.forEach(item => {
                grid.appendChild(createDocCard(item, category, subcategory));
            });
            categoryContent.appendChild(grid);
        }
    }

    function createDocCard(item, category, subcategory) {
        const card = document.createElement('div');
        card.className = 'doc_card';
        const slug = slugify(item.title);
        const href = subcategory ? `#${category.id}/${subcategory.id}/${slug}` : `#${category.id}/${slug}`;

        card.innerHTML = `
            <span class="year">${item.year || ''}</span>
            <h3>${item.title}</h3>
            <p>${item.summary.substring(0, 100)}${item.summary.length > 100 ? '...' : ''}</p>
            <a href="${href}">Examine Document</a>
        `;
        return card;
    }

    function renderDocument(category, doc, subcategory = null) {
        viewDocument.style.display = 'block';
        currentDoc = doc;

        docTitle.textContent = doc.title;
        docMeta.textContent = `${category.category}${subcategory ? ' • ' + subcategory.name : ''}${doc.year ? ' • ' + doc.year : ''}`;
        docSummary.textContent = doc.summary;

        mdViewer.style.display = 'none';
        pdfViewer.style.display = 'none';
        noViewerMsg.style.display = 'none';

        btnViewMd.style.display = doc.files.markdown ? 'inline-block' : 'none';
        btnViewCaseText.style.display = doc.files.caseText ? 'inline-block' : 'none';
        btnViewPdf.style.display = doc.files.pdf ? 'inline-block' : 'none';

        if (doc.files.markdown) {
            showMarkdown(doc.files.markdown);
        } else if (doc.files.caseText) {
            showPdf(doc.files.caseText, true);
        } else if (doc.files.pdf) {
            showPdf(doc.files.pdf);
        } else {
            noViewerMsg.style.display = 'block';
        }

        populateContextSidebar(category, subcategory);
    }

    function populateContextSidebar(category, subcategory) {
        contextNavSection.style.display = 'block';
        const title = document.getElementById('context-nav-title');
        title.textContent = subcategory ? subcategory.name : category.category;

        documentList.innerHTML = '';
        const items = subcategory ? subcategory.items : category.items;

        items.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            const slug = slugify(item.title);
            a.href = subcategory ? `#${category.id}/${subcategory.id}/${slug}` : `#${category.id}/${slug}`;
            a.textContent = item.title;
            if (item === currentDoc) a.classList.add('active');
            li.appendChild(a);
            documentList.appendChild(li);
        });
    }

    async function showMarkdown(path, isCaseText = false) {
        mdViewer.style.display = 'block';
        pdfViewer.style.display = 'none';

        btnViewMd.classList.remove('active');
        btnViewCaseText.classList.remove('active');
        btnViewPdf.classList.remove('active');

        if (isCaseText) {
            btnViewCaseText.classList.add('active');
            currentView = 'caseText';
        } else {
            btnViewMd.classList.add('active');
            currentView = 'markdown';
        }

        try {
            const response = await fetch(path);
            const text = await response.text();
            mdViewer.innerHTML = marked.parse(text);
        } catch (err) {
            mdViewer.innerHTML = `<p>Error loading document: ${err.message}</p>`;
        }
    }

    function showPdf(path) {
        pdfViewer.style.display = 'block';
        mdViewer.style.display = 'none';

        btnViewPdf.classList.add('active');
        btnViewMd.classList.remove('active');
        btnViewCaseText.classList.remove('active');

        currentView = 'pdf';
        pdfViewer.src = path;
    }

    btnViewMd.addEventListener('click', () => currentDoc && showMarkdown(currentDoc.files.markdown));
    btnViewCaseText.addEventListener('click', () => currentDoc && showPdf(currentDoc.files.caseText, true));
    btnViewPdf.addEventListener('click', () => currentDoc && showPdf(currentDoc.files.pdf));

    btnDownload.addEventListener('click', () => {
        if (!currentDoc) return;
        let fileToDownload = null;
        if (currentView === 'markdown') fileToDownload = currentDoc.files.markdown;
        else if (currentView === 'caseText') fileToDownload = currentDoc.files.caseText;
        else if (currentView === 'pdf') fileToDownload = currentDoc.files.pdf;

        if (fileToDownload) {
            const link = document.createElement('a');
            link.href = fileToDownload;
            link.download = fileToDownload.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

    // Utilities
    function slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    // Initialize
    initSidebar();
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
});
