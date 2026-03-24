import path from 'path';
import os from 'os';

export const APP_ID = 'com.tari.universe.alpha';

export function getAppConfigDir(): string {
    switch (os.platform()) {
        case 'darwin':
            return path.join(os.homedir(), 'Library', 'Application Support', APP_ID);
        case 'win32':
            return path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), APP_ID);
        default:
            return path.join(os.homedir(), '.config', APP_ID);
    }
}

// ============================================================
// WARNING: LOCALNET-ONLY TEST WALLET — DO NOT USE ON MAINNET
// ============================================================
// These keys are committed to version control and have ZERO
// security. They exist solely for automated E2E tests against
// a local development network. Using these keys on mainnet or
// stagenet will result in loss of funds.
// ============================================================
export const TEST_WALLET = {
    walletId: 'test01',
    address: 'H27bCbHq55SZio4NcNQvTVdGKjMnVfeHPBfQ7N744iGyi34z5nv4zXKFzy8sug4VyWfndMCwjtpN9TXZUhVjeKFkJp9',
    seedWords: [
        'park',
        'visit',
        'october',
        'addict',
        'grocery',
        'suggest',
        'portion',
        'bus',
        'display',
        'island',
        'mother',
        'tiger',
        'mutual',
        'actress',
        'arrest',
        'buzz',
        'thing',
        'range',
        'final',
        'urban',
        'much',
        'noble',
        'this',
        'oxygen',
    ],
    spendKeyHex: '8ee08ece531fdf67ff574234e085bcd25e7d986ad60a4c1dee8147473a2ae543',
    viewKeyHex: 'bba72d1e62d91ef18bb55bd4260ed63ac7b2c54de0efa2765e555ae4a4d1c40f',
    cborHex:
        'a16e656e637279707465645f7365656498180218ff051821189f1867184718f5182f187518a1185218e818ce18d7185c18e918fc1850182c18ad18f4188e18c8',
};
