"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DateHelper {
    /**
     * Calculate a future or past date from the current moment based on the provided count of days.
     * @returns a string in ISO 8601 date and time format (e.g., 2023-09-23T20:58:38.638Z)
     */
    static calculateDate(days, type) {
        const milliseconds = days * 24 * 60 * 60 * 1000;
        const dateNow = new Date();
        const calculatedDate = type === 'future' ? new Date(dateNow.getTime() + milliseconds) : new Date(dateNow.getTime() - milliseconds);
        const dateISO = calculatedDate.toISOString();
        return dateISO;
    }
}
exports.default = DateHelper;
