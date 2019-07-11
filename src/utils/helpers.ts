export const identity = _ => _;

// it's just for vscode syntax higlihter and code completition
export const css = identity;

export const delay = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));
