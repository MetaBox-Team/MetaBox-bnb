import {Web3Storage} from 'web3.storage';

const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZjM2E5NmQ0" +
  "NDY5YTVBYWQ1ODdjNjQ2OEM5OTk1NjU2ZEI4YkQwNTAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjgxNTAwMjIy" +
  "NDIsIm5hbWUiOiJmaXJzdCJ9.G_FfHh5DODt_txv29ev7fl1QGlccU_Do7SQF8Ob4fsE"

class IPFS {
  async put_ipfs_file(file_chunk: File[]) {
    try {
      const client = new Web3Storage({
        endpoint: new URL("https://API.Web3.Storage"),
        token: API_TOKEN
      });
      return await client.put(file_chunk, {
        maxRetries: 3,
      });
    } catch (e) {
      throw e
    }
  }

  async put_ipfs_blob(blob_chunk: Blob[], file_name: string) {
    try {
      let file_chunk = new File(blob_chunk, file_name, {type: "text/plain"});
      const client = new Web3Storage({
        endpoint: new URL("https://API.Web3.Storage"),
        token: API_TOKEN
      });
      const onStoredChunk = (chunkSize: any) => console.log(`stored chunk of ${chunkSize} bytes`);
      // Pack files into a CAR and send to web3.storage
      // @ts-ignore
      return await client.put([file_chunk], {
        name: file_name,
        maxRetries: 3,
        onStoredChunk,
      });
    } catch (e) {
      throw e
    }
  }

  async get_ipfs(cid: string) {
    try {
      const client = new Web3Storage({
        endpoint: new URL("https://API.Web3.Storage"),
        token: API_TOKEN
      });
      const res = await client.get(cid); // Web3Response
      // Web3File[]
      return await res?.files();
    } catch (e) {
      throw e
    }
  }
}

export const IPFSApi = new IPFS()
