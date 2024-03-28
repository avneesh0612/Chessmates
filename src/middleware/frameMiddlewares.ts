import { openframes } from "frames.js/middleware";
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from "frames.js/xmtp";

const frameMiddleWares: any[] = [
  openframes({
    clientProtocol: {
      id: "xmtp",
      version: "2024-02-09",
    },
    handler: {
      isValidPayload: (body: JSON) => isXmtpFrameActionPayload(body),
      getFrameMessage: async (body: JSON) => {
        if (!isXmtpFrameActionPayload(body)) {
          return undefined;
        }
        const result = await getXmtpFrameMessage(body);

        return { ...result };
      },
    },
  }),
];

export { frameMiddleWares };
