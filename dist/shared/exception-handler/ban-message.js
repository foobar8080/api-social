"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.banMessage = void 0;
const banned_user_helper_1 = require("../../features/banned-user/banned-user.helper");
/**
 * Generate ban message and format unban date:
 * - input: "2023-08-15T22:26:40.388Z"
 * - output: "Aug 15, 2023"
 */
function banMessage(unbanAt, banId) {
    const date = new Date(unbanAt);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const banReason = banned_user_helper_1.banInfo[banId].name;
    const message = `We regret to inform you that your interactions on our platform have been temporarily suspended until ${formattedDate}, due to a violation of our community guidelines. Reason for suspension: ${banReason}.`;
    return message;
}
exports.banMessage = banMessage;
