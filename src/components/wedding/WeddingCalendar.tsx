import { Section } from "./Section";
import { Reveal } from "./Reveal";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const firstWeekday = new Date(2027, 3, 1).getDay();
const dayCount = 30;
const cells: Array<number | null> = [
  ...Array.from({ length: firstWeekday }, () => null),
  ...Array.from({ length: dayCount }, (_, index) => index + 1),
];

while (cells.length % 7 !== 0) cells.push(null);

const weeks = Array.from({ length: cells.length / 7 }, (_, index) =>
  cells.slice(index * 7, index * 7 + 7),
);

export function WeddingCalendar() {
  return (
    <Section
      id="calendar"
      tone="light"
      eyebrow="Save the date"
      title="Wedding Calendar"
      intro="Friday, April 23, 2027 is the day we begin our journey together."
      narrow
    >
      <Reveal>
        <div className="calendar-card">
          <table className="wedding-calendar">
            <caption className="sr-only">
              April 2027 calendar with the wedding date highlighted
            </caption>
            <thead>
              <tr>
                {weekdays.map((day) => (
                  <th key={day} scope="col">
                    <span aria-label={day}>{day}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, row) => (
                <tr key={row}>
                  {week.map((day, column) => (
                    <td key={`${row}-${column}`}>
                      {day === null ? (
                        <span aria-hidden="true" />
                      ) : day === 23 ? (
                        <span
                          className="calendar-wedding-day"
                          role="img"
                          aria-label="Friday, April 23, 2027, wedding day"
                        >
                          <span>{day}</span>
                          <span className="calendar-heart" aria-hidden="true">
                            ♥
                          </span>
                        </span>
                      ) : (
                        <span aria-label={`April ${day}, 2027`}>{day}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="calendar-caption label">Our wedding day · April 23, 2027</p>
        </div>
      </Reveal>
    </Section>
  );
}
