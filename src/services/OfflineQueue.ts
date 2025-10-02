// OfflineQueue.ts
import { MMKV } from 'react-native-mmkv';
import NetInfo from '@react-native-community/netinfo';
import axios, { AxiosRequestConfig } from 'axios';

export interface OfflineRequest<T = any> {
  url: string;
  data: T;
  config?: AxiosRequestConfig;
}

export class OfflineQueue<T = any> {
    syncPending(arg0: string) {
        throw new Error('Method not implemented.');
    }
  private storage: MMKV;
  private storageKey: string;
  

  constructor(storageKey: string = 'pendingRequests') {
    this.storage = new MMKV();
    this.storageKey = storageKey;

    // Start listening for internet changes
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.syncPendingRequests();
      }
    });
  }

  private saveRequests(requests: OfflineRequest<T>[]) {
    this.storage.set(this.storageKey, JSON.stringify(requests));
  }

  public loadRequests(): OfflineRequest<T>[] {
    const stored = this.storage.getString(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }


public getAllStored(): OfflineRequest<T>[] {
  return this.loadRequests(); // loadRequests() already fetches all pending from MMKV
}

  private clearRequests() {
    this.storage.delete(this.storageKey);
  }

  // 🔹 Save single request offline
  private addRequest(req: OfflineRequest<T>) {
    const requests = this.loadRequests();
    requests.push(req);
    this.saveRequests(requests);
    console.log('[OfflineQueue] Request saved offline:', req);
  }

  // 🔹 Try sending, otherwise queue
  async sendOrQueue(url: string, data: T, config: AxiosRequestConfig = {}): Promise<void> {
    const state = await NetInfo.fetch();

    if (state.isConnected) {
      try {
        const res = await axios.post(url, data, config);
        console.log(res,"res");
        console.log('[OfflineQueue] Sent online:', res.data);
      } catch (err) {
        console.log('[OfflineQueue] API failed, saving offline:', data);
        this.addRequest({ url, data, config });
      }
    } else {
      console.log('[OfflineQueue] Offline, saving offline:', data);
      this.addRequest({ url, data, config });
    }
  }

  // 🔹 Sync all pending
 async syncPendingRequests(): Promise<number> {
  const requests = this.loadRequests();
  if (requests.length === 0) return 0;

  const failed: OfflineRequest<T>[] = [];
  let syncedCount = 0;

  for (const req of requests) {
    try {
      await axios.post(req.url, req.data, req.config);
      syncedCount++;
    } catch {
      failed.push(req);
    }
  }

  if (failed.length > 0) {
    this.saveRequests(failed);
  } else {
    this.clearRequests();
  }

  return syncedCount;
}

// Returns all stored requests (pending + already synced if you store them separately)

}



