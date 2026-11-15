import * as Calendar from 'expo-calendar';
import { getAttendeesForEventAsync } from 'expo-calendar/legacy';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

// Repro for https://github.com/expo/expo/issues/53469: on iOS the class-based
// ExpoCalendarEvent.getAttendees() returns attendee objects with no readable fields,
// while the legacy getAttendeesForEventAsync() returns them filled.

const FIELDS = ['name', 'role', 'status', 'type', 'url', 'isCurrentUser', 'email', 'id'] as const;

function describe(a: any) {
  const own = Object.getOwnPropertyNames(a);
  const proto = Object.getOwnPropertyNames(Object.getPrototypeOf(a) ?? {});
  const fields = FIELDS.map((f) => `${f}=${JSON.stringify(a?.[f])}`).join('  ');
  return `${fields}\n   own keys: [${own.join(', ')}]  proto keys: [${proto.join(', ')}]`;
}

async function runCheck(): Promise<string[]> {
  const out: string[] = [];
  const { status } = await Calendar.requestCalendarPermissions();
  if (status !== 'granted') throw new Error('calendar permission not granted');
  const calendars = await Calendar.getCalendars(Calendar.EntityTypes.EVENT);
  const start = new Date();
  const end = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);
  const events = await Calendar.listEvents(calendars, start, end);
  out.push(`${events.length} event(s) in the next 14 days, ${calendars.length} calendar(s)`);
  for (const event of events) {
    const attendees = await event.getAttendees();
    const legacy = await getAttendeesForEventAsync(event.id);
    out.push(`\n"${event.title}" (${event.id})`);
    out.push(`class API getAttendees(): ${attendees.length} object(s)`);
    attendees.forEach((a, i) => out.push(` [${i}] ${describe(a)}`));
  }
  return out;
}
