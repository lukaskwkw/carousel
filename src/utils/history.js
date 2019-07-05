const listeners = new Set();

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () =>
    listeners.forEach(callback => callback(location.pathname))
  );
}

const push = pathname => {
  window.history.pushState({}, "", pathname);

  listeners.forEach(callback => callback(pathname));
};

export default {
  push,
  addListener: cb => listeners.add(cb)
};
