export default class Vector {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    negative(v) {
        return new Vector(-this.x, -this.y, -this.z);
    }

    add(v) {
        if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
        else return new Vector(this.x + v, this.y + v, this.z + v);
    }

    subtract(v) {
        if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
        else return new Vector(this.x - v, this.y - v, this.z - v);
    }

    multiply(v) {
        if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
        else return new Vector(this.x * v, this.y * v, this.z * v);
    }

    divide(v) {
        if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
        else return new Vector(this.x / v, this.y / v, this.z / v);
    }

    equals(v) {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    len(v) {
        return Math.sqrt(this.dot(this));
    }

    norm()
    {
        return new Vector(this.x/this.len(this), this.y/this.len(this) ,this.z/this.len(this))
    }
}
/*Vector.prototype = {
    cross: function(v) {
        return new Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    },
    unit: function() {
        return this.divide(this.length());
    },
    min: function() {
        return Math.min(Math.min(this.x, this.y), this.z);
    },
    max: function() {
        return Math.max(Math.max(this.x, this.y), this.z);
    },
    toAngles: function() {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.length())
        };
    },
    angleTo: function(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    },
    toArray: function(n) {
        return [this.x, this.y, this.z].slice(0, n || 3);
    },
    clone: function() {
        return new Vector(this.x, this.y, this.z);
    },
    init: function(x, y, z) {
        this.x = x; this.y = y; this.z = z;
        return this;
    }
};*/