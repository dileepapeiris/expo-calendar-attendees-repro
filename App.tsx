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
    out.push(`legacy getAttendeesForEventAsync(): ${legacy.length} object(s)`);
    legacy.forEach((a, i) => out.push(` [${i}] ${describe(a)}`));
  }
  return out;
}

export default function App() {
  const [lines, setLines] = useState<string[]>(['running…']);
  const run = () => runCheck().then(setLines).catch((e) => setLines([`error: ${e}`]));
  useEffect(() => { run(); }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>expo-calendar getAttendees() on iOS (#53469)</Text>
      <Button title="run again" onPress={run} />
      <ScrollView style={styles.scroll}>
        {lines.map((l, i) => <Text key={i} style={styles.line} testID={`line-${i}`}>{l}</Text>)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 64, paddingHorizontal: 12, backgroundColor: '#fff' },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  scroll: { flex: 1, marginTop: 8 },
  line: { fontFamily: 'Menlo', fontSize: 11, marginBottom: 2 },
});
