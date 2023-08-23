## [Viewer2D](../src/components/viewer2d/)

The `src/components/viewer2D` directory in react-planner contains components responsible for rendering the 2D view of a scene, including its layers and grids. The components and how they interact with each other are as follows:

### [Scene](../src/components/viewer2d/scene.jsx)

This component is the top-level component in the `/viewer2D` directory. It takes two props: `scene` and `catalog`, where `scene` is the current scene being displayed and `catalog` is a registry of available elements and their properties. The Scene component renders the `Grids` component, as well as all of the layers in the scene.

### [Grids](../src/components/viewer2d/grids/grids.jsx)

This component renders the grids in the scene. It takes a single prop, `scene`, which is the current scene being displayed. The `Grids` component maps over all of the grids in the scene and renders either a `GridHorizontalStreak` or `GridVerticalStreak` component, depending on the type of the grid.

### [GridHorizontalStreak](../src/components/viewer2d/grids/grid-horizontal-streak.jsx) and [GridVerticalStreak](../src/components/viewer2d/grids/grid-vertical-streak.jsx)

These components render horizontal and vertical grids, respectively. They take three props: `width`, `height`, and `grid`. The `width` and `height` props specify the width and height of the scene, and the `grid` prop contains information about the properties of the grid, such as its color and spacing.

### [Layer](../src/components/viewer2d/layer.jsx)

This component renders a single layer in the scene. It takes three props: `layer`, `scene`, and `catalog`. The `layer` prop contains information about the layer, such as its elements and visibility. The `scene` prop is the current scene being displayed, and the `catalog` prop is a registry of available elements and their properties.

Overall, the components in `/viewer2D` interact with each other to create the 2D view of a scene. The `Scene` component is the top-level component that renders the `Grids` and `Layer` components. The `Grids` component renders the grids in the scene, and the `Layer` component renders the elements in each layer of the scene.