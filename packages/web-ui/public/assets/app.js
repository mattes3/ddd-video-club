// The little bit of client-side behaviour that the server-rendered pages need.

// Opens every <dialog> that htmx swaps into #dialog-slot as a modal dialog.
document.addEventListener('htmx:after:swap', () => {
    document.querySelector('#dialog-slot dialog:not([open])')?.showModal();
});

// Removes a dialog from #dialog-slot once it is closed (Cancel button or Escape key),
// so that a later swap does not re-open it. The close event does not bubble, hence capture.
document.addEventListener(
    'close',
    (event) => {
        if (event.target instanceof HTMLDialogElement && event.target.closest('#dialog-slot')) {
            event.target.remove();
        }
    },
    true,
);
