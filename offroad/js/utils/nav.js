export const getCurrentRouteName = (state) => {
  const route = state.routes[state.index];
  return typeof route.index === 'undefined' ? route.routeName : getCurrentRouteName(route);
}
