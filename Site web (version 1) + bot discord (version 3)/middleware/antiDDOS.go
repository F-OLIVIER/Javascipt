package utils

import (
	"math"
	"sync"
	"time"
)

type TokenBucket struct {
	mu             sync.Mutex
	tokens         float64
	maxTokens      float64
	refillRate     float64
	lastRefillTime time.Time
}

// NewTokenBucket creates a new TokenBucket instance.
func NewTokenBucket(maxTokens float64, refillRate float64) *TokenBucket {
	return &TokenBucket{
		tokens:         maxTokens,
		maxTokens:      maxTokens,
		refillRate:     refillRate,
		lastRefillTime: time.Now(),
	}
}

// refill refills the token bucket based on the elapsed time since the last refill.
func (tb *TokenBucket) refill() {
	now := time.Now()
	duration := now.Sub(tb.lastRefillTime)
	tokensToAdd := tb.refillRate * duration.Seconds()
	tb.tokens = math.Min(tb.tokens+tokensToAdd, tb.maxTokens)
	tb.lastRefillTime = now
}

// Request checks if the token bucket has enough tokens for a request ? deducts the tokens and returns true : false
func (tb *TokenBucket) Request(tokens float64) bool {
	tb.mu.Lock()
	defer tb.mu.Unlock()
	tb.refill()
	if tokens <= tb.tokens {
		tb.tokens -= tokens
		return true
	}
	return false
}
