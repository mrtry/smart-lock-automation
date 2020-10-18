import { PubSub } from "@google-cloud/pubsub";
import { openLocks } from "./locker";
import { post, Type } from "./slackNotifire";
import config from "config";

const accessToken = config.get<string[]>("accessToken");
const subscriptionName = config.get<string>("subscription_name");

const pubSubClient = new PubSub();

function listenForMessages() {
  const subscription = pubSubClient.subscription(subscriptionName);

  const messageHandler = async (message: any) => {
    if (!accessToken.includes(message.attributes.token)) {
      await post(Type.FAILED, `invalid token: ${message.attributes.token}`);
      message.ack();
      return;
    }

    await post(Type.SUCCESS, `received token: ${message.attributes.token}`);
    await openLocks();
    message.ack();
  };

  subscription.on("message", messageHandler);
}

listenForMessages();
