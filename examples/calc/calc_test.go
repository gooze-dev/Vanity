package calc

import "testing"

func TestInRange(t *testing.T) {
	tests := []struct {
		n, lo, hi int
		want      bool
	}{
		{5, 0, 10, true},
		{-3, 0, 10, false},
		{42, 0, 10, false},
		{0, 0, 10, true},  // lower bound is inside
		{10, 0, 10, true}, // upper bound is inside
	}
	for _, tt := range tests {
		if got := InRange(tt.n, tt.lo, tt.hi); got != tt.want {
			t.Errorf("InRange(%d, %d, %d) = %v, want %v", tt.n, tt.lo, tt.hi, got, tt.want)
		}
	}
}
