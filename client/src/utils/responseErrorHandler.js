export function redirectToInternalErrorPage() {
  window.location = "/internal-error";
}

export function redirectToNotFoundPage() {
  window.location = "/not-found";
}

const handleError = {
  404: redirectToNotFoundPage,
  500: redirectToInternalErrorPage,
};

export function handleHttpError(err) {
  if (err && err.response) {
    const status = err.response.status;

    if (handleError[status]) {
      handleError[status]();
    } else {
      handleError[500]();
    }
  }
}
