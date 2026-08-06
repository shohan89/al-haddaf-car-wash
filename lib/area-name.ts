// Many area titles are already stored as a full phrase like "Car Wash in
// Dubai Marina" rather than a bare place name. Strip that prefix when
// composing the name into another phrase (e.g. "Book Now in {name}"), so we
// don't end up with "Book Now in Car Wash in Dubai Marina".
export function bareAreaName(title: string): string {
  return title.replace(/^car wash (in|on)\s+/i, '');
}
