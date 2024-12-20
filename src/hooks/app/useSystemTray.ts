import { MinerMetrics } from '@app/types/app-status';
import {
    menu,
    CPU_HASH_ITEM_ID,
    GPU_HASH_ITEM_ID,
    EARNINGS_ITEM_ID,
    UNMINIMIZE_ITEM_ID,
    MINIMIZE_ITEM_ID,
} from '@app/utils';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { formatHashrate, formatNumber, FormatPreset } from '@app/utils';
import { MenuItem } from '@tauri-apps/api/menu/menuItem';

const currentWindow = getCurrentWindow();

export function useUpdateSystemTray() {
    const [metrics, setMetrics] = useState<MinerMetrics>();

    const totalEarningsFormatted = useMemo(() => {
        const cpu_est = metrics?.cpu?.mining?.estimated_earnings || 0;
        const gpu_est = metrics?.gpu?.mining?.estimated_earnings || 0;
        const total = cpu_est + gpu_est;
        return total > 0 ? formatNumber(total, FormatPreset.TXTM_COMPACT) : '0';
    }, [metrics]);

    const updateMenuItemEnabled = useCallback(async (itemId: string, enabled: boolean) => {
        const item = await menu.get(itemId);

        if (item) {
            const menuItem = item as MenuItem;
            const currentEnabled = await menuItem?.isEnabled();
            if (currentEnabled !== enabled) {
                await menuItem.setEnabled(enabled);
            }
        }
    }, []);
    const updateMenuItem = useCallback(async ({ itemId, itemText }: { itemId: string; itemText?: string }) => {
        const item = await menu.get(itemId);
        if (item && itemText) {
            await item.setText(itemText);
        }
    }, []);

    const minimized = useRef(false);

    const items = useMemo(() => {
        const { cpu, gpu } = metrics || {};
        const cpu_h = cpu?.mining?.hash_rate || 0;
        const gpu_h = gpu?.mining?.hash_rate || 0;

        const cpuHashItemText = `CPU Hashrate: ${cpu_h ? `${formatHashrate(cpu_h)}` : '-'}`;
        const gpuHashItemText = `GPU Hashrate: ${gpu_h ? `${formatHashrate(gpu_h)}` : '-'}`;
        const estEarningsItemText = `Est earning: ${totalEarningsFormatted !== '0' ? totalEarningsFormatted : '-'} tXTM/day`;

        return [
            { itemId: CPU_HASH_ITEM_ID, itemText: cpuHashItemText },
            { itemId: GPU_HASH_ITEM_ID, itemText: gpuHashItemText },
            { itemId: EARNINGS_ITEM_ID, itemText: estEarningsItemText },
        ];
    }, [metrics, totalEarningsFormatted]);

    useEffect(() => {
        // Run once on mount
        items.forEach(async (item) => {
            await updateMenuItem({ ...item });
        });

        // Run every 10 seconds after
        const intervalId = setInterval(() => {
            items.forEach(async (item) => {
                await updateMenuItem({ ...item });
            });
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const ul = listen('miner_metrics', async ({ payload }) => {
            if (payload) {
                setMetrics(payload as MinerMetrics);
            }

            if ((await currentWindow.isMinimized()) != minimized.current) {
                minimized.current = !minimized;
                await updateMenuItemEnabled(UNMINIMIZE_ITEM_ID, minimized.current);
                await updateMenuItemEnabled(MINIMIZE_ITEM_ID, !minimized.current);
            }
        });
        return () => {
            ul.then((unlisten) => unlisten());
        };
    }, [minimized, updateMenuItemEnabled]);
}
