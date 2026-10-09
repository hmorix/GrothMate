export interface CalendarEventPayload {
  title: string;
  description: string;
  location?: string;
  startDate: Date;
  durationMinutes?: number;
}

export class CalendarService {
  /**
   * Generates a direct Google Calendar Web Link (No OAuth or passwords needed!)
   * Opens Google Calendar with the watering/gardening task prefilled.
   */
  static generateGoogleCalendarUrl(payload: CalendarEventPayload): string {
    const formatTime = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const start = formatTime(payload.startDate);
    const end = new Date(payload.startDate.getTime() + (payload.durationMinutes || 30) * 60000);
    const endStr = formatTime(end);

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: payload.title,
      dates: `${start}/${endStr}`,
      details: payload.description + "\n\n— Scheduled via GrowMate AI (Touch Grass Hacktoberfest)",
      location: payload.location || "Home Garden"
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  /**
   * Downloads a standard universal .ics file for Apple Calendar, Google Calendar, Outlook
   */
  static downloadIcsFile(payload: CalendarEventPayload): void {
    const formatTime = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const start = formatTime(payload.startDate);
    const end = new Date(payload.startDate.getTime() + (payload.durationMinutes || 30) * 60000);
    const endStr = formatTime(end);

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//GrowMate AI//Gardening Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:${payload.title}`,
      `DESCRIPTION:${payload.description}`,
      `LOCATION:${payload.location || "Home Garden"}`,
      `DTSTART:${start}`,
      `DTEND:${endStr}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${payload.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
