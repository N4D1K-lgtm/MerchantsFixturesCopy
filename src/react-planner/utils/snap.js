// Import required Immutable.js data structures
import { Map, List, Record } from "immutable";
// Import required geometry functions for calculating distances and intersections
import * as Geometry from "./geometry";

// Define snap type constants
export const SNAP_POINT = "SNAP_POINT";
export const SNAP_LINE = "SNAP_LINE";
export const SNAP_SEGMENT = "SNAP_SEGMENT";
export const SNAP_GRID = "SNAP_GRID";
export const SNAP_GUIDE = "SNAP_GUIDE";

// Define default snap mask with snapping types enabled/disabled
export const SNAP_MASK = new Map({
  SNAP_POINT: true,
  SNAP_LINE: false,
  SNAP_SEGMENT: false,
  SNAP_GRID: true,
  SNAP_GUIDE: false,
});

// PointSnap: Immutable Record representing a point snap element
class PointSnap extends Record({
  type: "point",
  x: -1,
  y: -1,
  radius: 1,
  priority: 1,
  related: new List(),
}) {
  // Returns the nearest point on the point snap element to the provided coordinates (x, y)
  nearestPoint(x, y) {
    return {
      x: this.x,
      y: this.y,
      distance: Geometry.pointsDistance(this.x, this.y, x, y),
    };
  }
  // Returns true if the provided point (x, y) is within the specified distance from the point snap element
  isNear(x, y, distance) {
    return ~(this.x - x) + 1 < distance && ~(this.y - y) + 1 < distance;
  }
}

// LineSnap: Immutable Record representing a line snap element
class LineSnap extends Record({
  type: "line",
  a: -1,
  b: -1,
  c: -1,
  radius: 1,
  priority: 1,
  related: new List(),
}) {
  // Returns the nearest point on the line snap element to the provided coordinates (x, y)
  nearestPoint(x, y) {
    return {
      ...Geometry.closestPointFromLine(this.a, this.b, this.c, x, y),
      distance: Geometry.distancePointFromLine(this.a, this.b, this.c, x, y),
    };
  }
  // This function is a placeholder and returns true, as the logic for determining if a point is near a line is not implemented
  isNear(x, y, distance) {
    return true;
  }
}

// LineSegmentSnap: Immutable Record representing a line segment snap element
class LineSegmentSnap extends Record({
  type: "line-segment",
  x1: -1,
  y1: -1,
  x2: -1,
  y2: -1,
  radius: 1,
  priority: 1,
  related: new List(),
}) {
  // Returns the nearest point on the line segment snap element to the provided coordinates (x, y)
  nearestPoint(x, y) {
    return {
      ...Geometry.closestPointFromLineSegment(
        this.x1,
        this.y1,
        this.x2,
        this.y2,
        x,
        y
      ),
      distance: Geometry.distancePointFromLineSegment(
        this.x1,
        this.y1,
        this.x2,
        this.y2,
        x,
        y
      ),
    };
  }
  // This function is a placeholder and returns true, as the logic for determining if a point is near a line segment is/ not implemented
  isNear(x, y, distance) {
    return true;
  }
}

// GridSnap: Immutable Record representing a grid snap element
class GridSnap extends Record({
  type: "grid",
  x: -1,
  y: -1,
  radius: 1,
  priority: 1,
  related: new List(),
}) {
  // Returns the nearest point on the grid snap element to the provided coordinates (x, y)
  nearestPoint(x, y) {
    return {
      x: this.x,
      y: this.y,
      distance: Geometry.pointsDistance(this.x, this.y, x, y),
    };
  }
  // Returns true if the provided point (x, y) is within the specified distance from the grid snap element
  isNear(x, y, distance) {
    return ~(this.x - x) + 1 < distance && ~(this.y - y) + 1 < distance;
  }
}

// nearestSnap: Returns the nearest snap element to the provided coordinates (x, y), taking into account the snapMask
export function nearestSnap(snapElements, x, y, snapMask) {
  let filter = {
    point: snapMask.get(SNAP_POINT),
    line: snapMask.get(SNAP_LINE),
    "line-segment": snapMask.get(SNAP_SEGMENT),
    grid: snapMask.get(SNAP_GRID),
  };

  return snapElements
    .valueSeq()
    .filter((el) => filter[el.type] && el.isNear(x, y, el.radius))
    .map((snap) => {
      return { snap, point: snap.nearestPoint(x, y) };
    })
    .filter(({ snap: { radius }, point: { distance } }) => distance < radius)
    .min(
      (
        { snap: { priority: p1 }, point: { distance: d1 } },
        { snap: { priority: p2 }, point: { distance: d2 } }
      ) => (p1 === p2 ? (d1 < d2 ? -1 : 1) : p1 > p2 ? -1 : 1)
    );
}

// addPointSnap: Adds a point snap element to snapElements
export function addPointSnap(snapElements, x, y, radius, priority, related) {
  related = new List([related]);
  return snapElements.push(new PointSnap({ x, y, radius, priority, related }));
}

// addLineSnap: Adds a line snap element to snapElements
export function addLineSnap(snapElements, a, b, c, radius, priority, related) {
  related = new List([related]);

  return snapElements.withMutations((snapElements) => {
    let alreadyPresent = snapElements.some(
      (lineSnap) =>
        lineSnap.type === "line" &&
        a === lineSnap.a &&
        b === lineSnap.b &&
        c === lineSnap.c
    );
    if (alreadyPresent) return snapElements;
    let intersections = snapElements
      .valueSeq()
      .filter((snap) => snap.type === "line")
      .map((snap) =>
        Geometry.twoLinesIntersection(snap.a, snap.b, snap.c, a, b, c)
      )
      .filter((intersection) => intersection !== undefined)
      .forEach(({ x, y }) => addPointSnap(snapElements, x, y, 20, 40));

    snapElements.push(new LineSnap({ a, b, c, radius, priority, related }));
  });
}

// addLineSegmentSnap: Adds a line segment snap element to snapElements
export function addLineSegmentSnap(
  snapElements,
  x1,
  y1,
  x2,
  y2,
  radius,
  priority,
  related
) {
  related = new List([related]);
  return snapElements.push(
    new LineSegmentSnap({ x1, y1, x2, y2, radius, priority, related })
  );
}

// addGridSnap: Adds a grid snap element to snapElements
export function addGridSnap(snapElements, x, y, radius, priority, related) {
  related = new List([related]);
  return snapElements.push(new GridSnap({ x, y, radius, priority, related }));
}
