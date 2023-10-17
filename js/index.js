async function appendPage(pdf, container, pageNumber) {
    await pdf.getPage(pageNumber)
    .then(page => {
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        page.render({
            canvasContext: context,
            viewport: viewport,
        });
    });
}

async function renderPages(pdfUrl, container) {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise.then(pdf => pdf);
    console.log(pdf);
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
        await appendPage(pdf,container, i);
    }

    container.setAttribute('style', 'display: block;');
    document.getElementById('loader').setAttribute('style', 'display: none;');
}

function plusZoom() {
    const pdfViewer = document.getElementById('container-pdf');
    let width = pdfViewer.offsetWidth;
    let widthScreeen = window.innerWidth;

    width += widthScreeen/10;

    if (width > widthScreeen) {
        width = widthScreeen;
    }

    pdfViewer.setAttribute('style', `width: ${width}px;`);
}


function lessZoom() {
    const pdfViewer = document.getElementById('container-pdf');
    let width = pdfViewer.offsetWidth;
    let widthScreeen = window.innerWidth;

    width -= widthScreeen/10;

    if (width < 0) {
        return;
    }
    
    pdfViewer.setAttribute('style', `width: ${width}px;`);
}


function justifyZoom() {
    const pdfViewer = document.getElementById('container-pdf');
    let width = pdfViewer.offsetWidth;
    let widthScreeen = window.innerWidth;

    width = (widthScreeen * 63) / 100;
    
    pdfViewer.setAttribute('style', `width: ${width}px;`);
}

function showPdf(pdfUrl) {
    const container = document.getElementById('pdfViewer');
    container.innerHTML  = "";

    container.setAttribute('style', 'display: none;');
    document.getElementById('loader').setAttribute('style', 'display: block;');

    renderPages(pdfUrl, container);
}


window.addEventListener("resize", justifyZoom);

document.getElementById('file').addEventListener('change', function(e) {
    if (e.target.files[0]) {
        const objectURL = window.URL.createObjectURL(e.target.files[0]);
        showPdf(objectURL);
    }
});