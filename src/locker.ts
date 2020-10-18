import { exec } from "child_process";
import { post, Type } from "./slackNotifire";
import fetch from "node-fetch";
import config from "config";

export const openLocks = async () => {
  try {
    const address = config.get<string>("switchbot_mac_address");
    await retry(() => openAutoLock(address), 5);

    await sleep(10);

    const apiToken = config.get<string>("sesame_api_token");
    const deviceId = config.get<string>("sesame_device_id");
    await openSesame(apiToken, deviceId);
  } catch (e) {}
};

const openAutoLock = async (address: string) => {
  const openAutoLockCommand = `python switchbot.py ${address} Press`;
  new Promise((resolve, reject) => {
    exec(openAutoLockCommand, (err, stdout, stderr) => {
      if (err) {
        const message = `openAutoLock: failed\n\`\`\`${stderr}\`\`\``;
        post(Type.FAILED, message);
        console.error(message);

        return reject();
      }
      const message = `openAutoLock: success`;
      post(Type.SUCCESS, message);
      console.log(message);
      return resolve();
    });
  });
};

const openSesame = async (apiToken: string, deviceId: string) => {
  const response = await fetch(
    `https://api.candyhouse.co/public/sesame/${deviceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiToken,
      },
      body: JSON.stringify({ command: "unlock" }),
    }
  );
  return response
    .json()
    .then(() => {
      const message = "openSesame: success";
      post(Type.SUCCESS, message);
      console.log(message);
    })
    .catch((e) => {
      const message = `openSesame: error\n\`\`\`${e}\`\`\``;
      post(Type.FAILED, message);
      console.error(message);
      throw Exception();
    });
};

function Exception() {}

const sleep = (sec: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), sec * 1000);
  });
};

function retry(func: () => Promise<any>, retryCount: number) {
  let promise = func();
  for (let i = 1; i <= retryCount; ++i) {
    promise = promise.catch(func);
  }
  return promise;
}
