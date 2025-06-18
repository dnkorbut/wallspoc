const EPSILON = 0.000001
export function normalize(vector) {
    const length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
    vector[0] /= length
    vector[1] /= length
    return vector
}
export function distanceSquared(p1, p2) {
    return (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2;
}
export function getSegsIntersection(s1, e1, s2, e2) {
    const [x1, y1] = s1;
    const [x2, y2] = e1;
    const [x3, y3] = s2;
    const [x4, y4] = e2;
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < EPSILON)
        return null;
    const px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;
    const py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;
    if (px >= Math.min(x1, x2) - EPSILON && px <= Math.max(x1, x2) + EPSILON &&
        py >= Math.min(y1, y2) - EPSILON && py <= Math.max(y1, y2) + EPSILON &&
        px >= Math.min(x3, x4) - EPSILON && px <= Math.max(x3, x4) + EPSILON &&
        py >= Math.min(y3, y4) - EPSILON && py <= Math.max(y3, y4) + EPSILON) {
        return [px, py];
    }
    return null;
}
export function getRaySegmentIntersection(rayStart, rayEnd, segmentStart, segmentEnd) {
    const [x1, y1] = rayStart;
    const [x2, y2] = rayEnd;
    const [x3, y3] = segmentStart;
    const [x4, y4] = segmentEnd;
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < EPSILON)
        return null;
    const px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;
    const py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;

    // Check if intersection lies on the segment
    if (!(px >= Math.min(x3, x4) - EPSILON && px <= Math.max(x3, x4) + EPSILON &&
        py >= Math.min(y3, y4) - EPSILON && py <= Math.max(y3, y4) + EPSILON)) {
        return null;
    }

    // Check if intersection is in the forward direction of the ray
    const rayDirX = x2 - x1;
    const rayDirY = y2 - y1;
    const toIntersectionX = px - x1;
    const toIntersectionY = py - y1;

    // Dot product to check if intersection is in forward direction
    const dotProduct = rayDirX * toIntersectionX + rayDirY * toIntersectionY;
    if (dotProduct < -EPSILON) {
        return null; // Intersection is behind the ray start
    }

    return [px, py];
}
export function isEqual(a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON
}
