"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DateHelper {
    static calculateFutureDate(daysToAdd) {
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        const formattedDate = futureDate.toISOString();
        return formattedDate;
    }
}
exports.default = DateHelper;
