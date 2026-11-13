/**
 * Vault Tracker - Unified Telemetry & Event Tracking for EcoEmo Ecosystem
 * Handles storefront interactions, Agency Den tiers, and Core Vault audio events.
 */
(function (window, document) {
    'use strict';

    const CONFIG = {
        endpoint: '/api/telemetry', // Route handled by your Cloudflare Worker or backend
        debug: true
    };

    function log(message, data) {
        if (CONFIG.debug) {
            console.log(`[VaultTracker] ${message}`, data || '');
        }
    }

    class VaultTracker {
        constructor() {
            this.sessionId = Math.random().toString(36.substring(2, 15));
            this.init();
        }

        init() {
            // Automatically track initial page load/view
            this.trackPageView();

            // Bind global click listeners for automated event delegation
            document.addEventListener('click', (event) => {
                const target = event.target.closest('[data-track-event]');
                if (!target) return;

                const eventName = target.getAttribute('data-track-event');
                const eventCategory = target.getAttribute('data-track-category') || 'general';
                const eventLabel = target.getAttribute('data-track-label') || target.innerText.trim();

                this.trackEvent(eventName, {
                    category: eventCategory,
                    label: eventLabel,
                    path: window.location.pathname
                });
            });

            log('Initialized successfully with session ID:', this.sessionId);
        }

        trackPageView(additionalData = {}) {
            const payload = {
                type: 'page_view',
                path: window.location.pathname,
                search: window.location.search,
                referrer: document.referrer,
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                ...additionalData
            };

            this.send(payload);
        }

        trackEvent(name, metadata = {}) {
            const payload = {
                type: 'custom_event',
                name: name,
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                ...metadata
            };

            log(`Tracking Event: ${name}`, payload);
            this.send(payload);
        }

        send(payload) {
            const data = JSON.stringify(payload);

            // Use sendBeacon for reliability during unloads, fallback to fetch
            if (navigator.sendBeacon) {
                navigator.sendBeacon(CONFIG.endpoint, data);
            } else {
                fetch(CONFIG.endpoint, {
                    method: 'POST',
                    body: data,
                    headers: { 'Content-Type': 'application/json' },
                    keepalive: true
                }).catch((err) => {
                    console.error('[VaultTracker] Dispatch failed:', err);
                });
            }
        }
    }

    // Expose global tracker instance
    window.VaultTracker = new VaultTracker();

})(window, document);
