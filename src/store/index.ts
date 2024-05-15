import { Storage } from "@plasmohq/storage"

export const storageConfig = {
  key: "share-word",
  instance: new Storage({
    area: "local",
    copiedKeyList: ["share-word"]
  })
}
