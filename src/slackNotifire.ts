import { IncomingWebhook } from "@slack/webhook";
import config from "config";

export enum Type {
  SUCCESS,
  FAILED,
}

export const post = async (type: Type, message: string) => {
  const url = config.get<string>("slack_webhook_url");
  const webhook = new IncomingWebhook(url);
  await webhook.send({
    username: "Smart Lock Automation",
    icon_emoji:
      type == Type.SUCCESS ? ":robot_face:" : ":skull_and_crossbones:",
    text: message,
  });
};
