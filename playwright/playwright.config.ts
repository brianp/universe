import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: 1,
    timeout: 180_000,
    expect: { timeout: 30_000 },
    reporter: [['html', { open: 'never' }], ['list']],

    use: {
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'off',
        reducedMotion: 'reduce',
    },

    globalSetup: './helpers/global-setup.ts',
    globalTeardown: './helpers/global-teardown.ts',
});
