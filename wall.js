import * as math from './math.js'

export default class Wall {
    static walls = [] // static to hold all the walls

    #start
    #end
    #depth
    #baseline

    #normal

    #points // wall corner points
    #pointsVisible // wall corner points visibility
    #segments

    constructor(start = [0, 0], end = [0, 0], depth = 2, baseline = 0) {
        this.#start = start
        this.#end = end
        this.#depth = depth
        this.#baseline = baseline

        this.#points = []
        this.#pointsVisible = []
        this.#segments = [[], [], [], []]

        this.#normal = [0, 0]

        Wall.walls.push(this)

        this.#update()
        this.#updateWalls()
    }

    get segments() {
        return this.#segments.flat()
    }

    get start() {
        return this.#start
    }

    get end() {
        return this.#end
    }

    get depth() {
        return this.#depth
    }

    get baseline() {
        return this.#baseline
    }

    /**
     * @param {[number, number]} start 
     */
    set start(start) {
        this.#start[0] = start[0]
        this.#start[1] = start[1]
        this.#update()
        this.#updateWalls()
    }

    /**
     * @param {[number, number]} end 
     */
    set end(end) {
        this.#end[0] = end[0]
        this.#end[1] = end[1]
        this.#update()
        this.#updateWalls()
    }

    /**
     * @param {number} depth 
     */
    set depth(depth) {
        this.#depth = depth
        this.#update()
        this.#updateWalls()
    }

    /**
     * @param {number} baseline 
     */
    set baseline(baseline) {
        this.#baseline = baseline
        this.#update()
        this.#updateWalls()
    }

    isPointInside(point) {
        let intersections = 0
        for (let i = 0; i < this.#points.length; i++) {
            const start = this.#points[i]
            const end = this.#points[(i + 1) % this.#points.length]
            if (math.getRaySegmentIntersection(point, [point[0] + 1, point[1]], start, end))
                intersections++
        }
        return intersections % 2 === 1
    }

    #isPointInsideOtherWalls(point) {
        for (let i = 0; i < Wall.walls.length; i++) {
            const wall = Wall.walls[i]
            if (wall !== this && wall.isPointInside(point))
                return true
        }
        return false
    }

    #sortPoints(points, start = points[0]) {
        points.sort((a, b) => {
            return math.distanceSquared(a, start) - math.distanceSquared(b, start)
        })
    }

    // #createCorners() {
    //     // get walls connected to the same point
    //     for (let i = 0; i < Wall.walls.length; i++) {
    //         const wall = Wall.walls[i]
    //         for let
    //     }
    // }

    /**
     * get visible segments for a wall side
     * @param {*} segment 
     * @returns {Array} visible segments
     */
    #getVisibleSegments(start, end) {
        const points = []

        points.push(start)
        Wall.walls.forEach(wall => {
            if (wall === this) { return }
            for (let i = 0; i < wall.#points.length; i++) {
                const intersection = math.getSegsIntersection(start, end, wall.#points[i], wall.#points[(i + 1) % wall.#points.length])
                if (intersection) {
                    points.push(intersection)
                }
            }
        })
        points.push(end)

        this.#sortPoints(points, start)

        const segments = []

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i]
            const next = points[i + 1]
            const middlePoint = [
                (current[0] + next[0]) / 2,
                (current[1] + next[1]) / 2
            ]
            if (!this.#isPointInsideOtherWalls(middlePoint)) {
                segments.push([current, next])
            }
        }

        return segments
    }

    #update() {
        this.#normal[0] = this.#end[1] - this.#start[1]
        this.#normal[1] = this.#start[0] - this.#end[0]
        math.normalize(this.#normal)

        this.#points.length = 0
        this.#pointsVisible.length = 0

        this.#points.push([this.#start[0] + this.#normal[0] * this.#depth, this.#start[1] + this.#normal[1] * this.#depth])
        this.#points.push([this.#start[0] - this.#normal[0] * this.#depth, this.#start[1] - this.#normal[1] * this.#depth])
        this.#points.push([this.#end[0] - this.#normal[0] * this.#depth, this.#end[1] - this.#normal[1] * this.#depth])
        this.#points.push([this.#end[0] + this.#normal[0] * this.#depth, this.#end[1] + this.#normal[1] * this.#depth])

        this.#pointsVisible.push(!this.#isPointInsideOtherWalls(this.#points[0]))
        this.#pointsVisible.push(!this.#isPointInsideOtherWalls(this.#points[1]))
        this.#pointsVisible.push(!this.#isPointInsideOtherWalls(this.#points[2]))
        this.#pointsVisible.push(!this.#isPointInsideOtherWalls(this.#points[3]))

        for (let i = 0; i < this.#segments.length; i++) {
            this.#segments[i] = this.#getVisibleSegments(
                this.#points[i],
                this.#points[(i + 1) % this.#points.length]
            )
        }
    }

    #updateWalls() {
        Wall.walls.forEach(wall => {
            wall !== this && wall.#update()
        })
    }
}
