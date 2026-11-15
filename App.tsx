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
  return out;
}
