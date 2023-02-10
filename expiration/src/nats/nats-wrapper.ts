import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Connot access NATS client before connecting");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, {
      url,
      waitOnFirstConnect: true,
    });
    return new Promise<void>((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this._client?.on("error", (err) => {
        console.log(`Error when connecting to NATS: ${err}`);
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
