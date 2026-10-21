// Package calc has small helpers for numeric input.
package calc

// InRange reports whether n is inside the range [lo, hi].
//
// Both bounds are inclusive: InRange(0, 0, 10) and
// InRange(10, 0, 10) are true, InRange(11, 0, 10) is false.
// It expects lo <= hi.
func InRange(n, lo, hi int) bool {
	if n < lo {
		return false
	}
	if n > hi {
		return false
	}
	return true
}
