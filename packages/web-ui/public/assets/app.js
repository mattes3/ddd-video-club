// The little bit of client-side behaviour that the server-rendered pages need.

// Opens every <dialog> that htmx swaps into #dialog-slot as a modal dialog.
document.addEventListener('htmx:after:swap', () => {
    document.querySelector('#dialog-slot dialog:not([open])')?.showModal();
});
