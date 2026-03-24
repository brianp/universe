const PLATFORM_MAP: Record<string, string> = {
    Win32: 'windows',
    MacIntel: 'macos',
    Linux: 'linux',
    'Linux x86_64': 'linux',
    'Linux aarch64': 'linux',
};

function detectPlatform(): string {
    const nav = typeof navigator !== 'undefined' ? navigator.platform : '';
    return PLATFORM_MAP[nav] || 'linux';
}

function detectArch(): string {
    const nav = typeof navigator !== 'undefined' ? navigator.platform : '';
    if (nav.includes('aarch64') || nav.includes('arm')) return 'aarch64';
    return 'x86_64';
}

function detectOsType(): string {
    const p = detectPlatform();
    if (p === 'windows') return 'windows_nt';
    if (p === 'macos') return 'darwin';
    return 'linux';
}

export async function platform() {
    return detectPlatform();
}
export async function arch() {
    return detectArch();
}
export async function version() {
    return '6.0.0';
}
export async function locale() {
    return 'en-US';
}
export async function hostname() {
    return 'playwright-test';
}

const osType = async () => detectOsType();
export { osType as type };
